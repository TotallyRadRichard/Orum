const Queue = require('./queue');

/*
 * This is the base interface for all models. It includes
 * all the functions that you will need to implement as well as
 * a few helpers. It is provided as an object you "mixin" to
 * your prototype via Object.assign(YourModel.prototype, BaseModel);
 */
class Model {
  constructor(name, attributes) {
    this.name = name;
    this.attributes = this.parseAttributes(attributes);
  }

  /*
  * Creates a queue to use for pre-connected queries.
  */
  createQueue() {
    this.queue = Queue();
  }

  /*
   * Adds all the attributes given. Should be called during initialization.
   */
  parseAttributes(attributes) {
    for(let a in attributes) {
      this.addAttribute(a, attributes[a]);
    }
  }

  /*
   * Sets an attribute definition on the model. Do not override this method.
   */
  addAttribute(name, definition) {
    if(typeof definition === 'function') {
      this.attributes[name] = {
        dataType: definition() //Calls the datatype function referenced
      };
    } else {
      this.attributes[name] = {
        dataType: definition.dataType
      };
    }
  }

  /*
   * Runs the query queue. If a queue is required, this should be called
   * automatically when the connector successfully connects to the database.
   */
  drainQueue() {
    this.queue.drain((queryType, args) => this[queryType](...args));
  }

  /*
   * Inserts a new record.
   */
  create(record, onComplete) {}

  /*
   * Retrieves a record.
   */
  read(query, onComplete) {}

  /*
   * Retrieves a record or creates the record and returns it.
   */
  readOrCreate() {}

  /*
   * Updates a record.
   */
  update(filter, updates, onComplete) {}

  /*
   * Upserts a record (creates the record if it doesn't exist).
   */
  updateOrCreate(filter, updates, onComplete) {}

  /*
   * Upserts multiple records. The implementation of this will be complex.
   */
  updateOrCreateMany(updates, onComplete) {}

  /*
   * Removes a record.
   */
  delete(filter, onComplete) {}

  /*
   * Fun alias for delete. #NukeIt
   */
  nuke(filter, onComplete) {
    this.delete(filter, onComplete);
  }
};

module.exports = Model;