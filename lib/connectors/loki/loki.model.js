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
    return this.attempt('read', () => this.collection.findOne(query));
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
            switch(u) {
              case '$inc':
                record[field] += updates[u][field];
                break;       
            }
          }
        }
      } else {
        record[u] = updates[u];
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
          ...updates
        });
        console.log(record);
      }

      return record;
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