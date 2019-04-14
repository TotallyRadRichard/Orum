const Model = require('../../model');

class LokiModel extends Model {
  constructor(name, attributes) {
    super(name, attributes);

    this.collectionName = this.name.toLowerCase().replace(' ', '-');
    this.collection = null;
  }

  initialize(db) {
    this.collection = db.getCollection(this.collectionName);

    if (!this.collection) {
      this.collection = db.addCollection(this.collectionName);
    }

    this.drainQueue();
  }

  attempt(name, callback) {
    return new Promise((resolve) => {
      super.attempt(this.collection, name, () => resolve(callback()));
    }); 
  }

  create(record) {
    return this.attempt('create', () => this.collection.insert(record));   
  }

  read(query) {
    return this.attempt('read', () => this.collection.find(query));
  }

  readSingle(query) {
    return this.attempt('readSingle', () => this.collection.findOne(query));
  }

  readOrCreate(query, newRecord) {
    const queriedRecord = this.collection.findOne(query);

    if(queriedRecord) {
      return this.attempt('readOrCreate', () => queriedRecord);
    } else {
      return this.create(newRecord);
    }
  }


  /*
   * Gets the target object to modify, either the record itself
   * or a sub-object on the record. This allows for "mongo-like"
   * sub-fields/sub-object updates. IE {$set:{'myfield.mysubfield':someValue}}.
   * special update types. 
   * @param {object} record - The record to modify.
   * @param {field} updates - The field the is requested to update.
   * @return {object} {
   *    obj: the object that be used to apply the update
   *    field: the target key on the object to update
   * }
   */
  getTargetObject(record, field) {
    let target = {obj:record, field};
    
    if(field.includes('.')) {
      const keys = field.split('.');

      target.field = keys.pop();
      keys.forEach(key => target.obj = target.obj[key]);
    }

    return target;
  }

  /*
   * Processes a set of given updates, applying any "mongo-like"
   * special update types. 
   * @param {object} record - The record to modify.
   * @param {object} updates - The updates to apply.
   * @return {object} The record.
   */
  applyUpdates(record, updates) {
    for(const u in updates) {
      if(u.startsWith('$')) {
        if(typeof updates[u] === 'object') {
          for(const field in updates[u]) {
            const target = this.getTargetObject(record, field);

            switch(u) {
              case '$set':
                target.obj[target.field] = updates[u][field];
                break;
              case '$inc':
                target.obj[target.field] += updates[u][field];
                break;
            }
          }
        }
      }
    }

    return record;
  }

  update(filter, updates) {
    return this.attempt('update', () => {
      let record = this.collection.findOne(filter);

      if(record) {
        record = this.applyUpdates(record, updates);
        this.collection.update(record);
      }

      return record;
    });
  }

  updateOrCreate(filter, updates) {
    return this.attempt('updateOrCreate', () => {
      let record = this.collection.findOne(filter);
      
      if(record) {
        record = this.applyUpdates(record, updates);
        this.collection.update(record);
      } else {
        record = this.collection.insert({
          ...filter,
          ...updates.$setOnInsert
        });
      }

      return record;
    });
  }

  updateOrCreateMany(idAttribute, ids, updates) {
    let idsToCreate = new Set(ids);

    return this.attempt('updateOrCreateMany', () => {
      this.collection.findAndUpdate({[idAttribute]:{$in:ids}}, record => {
        idsToCreate.delete(record[idAttribute]);
        return this.applyUpdates(record, updates);
      });

      idsToCreate.forEach(id => {
        this.collection.insert({
          [idAttribute]: id,
          ...updates.$setOnInsert
        });
      });

      return this.collection.find({[idAttribute]:{$in:ids}});
    });
  }

  delete(filter) {
    if(!filter) {
      return this.attempt('clear', () => this.collection.clear());
    } else {
      return this.attempt('delete', () => this.collection.findAndRemove(filter));
    }
  }
}

module.exports = LokiModel;