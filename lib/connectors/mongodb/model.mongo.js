const ModelBase = require('./../../model');

const MongoModel = function(collection, attributes) {
  this.parseAttributes(attributes);
  this.collection = collection;
  this.createQueue();
};

//Mixin the base model interface
Object.assign(MongoModel.prototype, ModelBase);

MongoModel.prototype.create = function(record, onComplete) {
  if(this.queue.addIf(!this.collection, 'create', [record, onComplete])) {
    return;
  }

  this.collection.insertOne(record, (error, result) => onComplete(error, (result ? result.ops : null)));
};

MongoModel.prototype.read = function(query, onComplete) {
  if(this.queue.addIf(!this.collection, 'read', [query, onComplete])) {
    return;
  }

  this.collection.find(query).toArray(onComplete);
};

MongoModel.prototype.readOrCreate = function(query, record, onComplete) {
  if(this.queue.addIf(!this.collection, 'readOrCreate', [query, record, onComplete])) {
    return;
  }
  
  //Using the $setOnInsert directive we can ensure no update is
  //made to the record if it is found.
  this.collection.findOneAndUpdate(query, {
    $setOnInsert: record || query
  }, {
    upsert: true,
    returnOriginal: false
  }, (error, result) => onComplete(error, (result ? result.value : null)));
};

MongoModel.prototype.update = function(filter, updates, onComplete) {
  if(this.queue.addIf(!this.collection, 'update', [filter, updates, onComplete])) {
    return;
  }

  this.collection.updateOne(filter, updates, error => onComplete(error));
};

MongoModel.prototype.updateOrCreate = function(filter, updates, onComplete) {
  if(this.queue.addIf(!this.collection, 'updateOrCreate', [filter, updates, onComplete])) {
    return;
  }

  this.collection.updateOne(filter, updates, {upsert:true}, error => onComplete(error));
};

MongoModel.prototype.updateOrCreateMany = function(updates, onComplete) {
  if(this.queue.addIf(!this.collection, 'updateOrCreateMany', [updates, onComplete])) {
    return;
  }

  let ops = [], update = {upsert:true};

  if(updates.attribute && updates.values && updates.update) {
    for(let v = 0; v < updates.values.length; v++) {
      ops.push({
        updateOne: Object.assign({}, update, {
          filter: {[updates.attribute]:updates.values[v]},
          update: updates.update
      })});
    }
  } else {
    for (let u = 0; u < updates.length; u++) {
      if(updates[u].filter && updates[u].update) {
        ops.push({
          updateOne: Object.assign({}, update, updates[u])
        });
      }
    };
  }

  this.collection.bulkWrite(ops, error => onComplete(error));
};

MongoModel.prototype.delete = function(filter, onComplete) {
  if(this.queue.addIf(!this.collection, 'delete', [filter, onComplete])) {
    return;
  }

  this.collection.remove(filter, error => onComplete(error));
};

module.exports = MongoModel;