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
}

module.exports = LokiModel;