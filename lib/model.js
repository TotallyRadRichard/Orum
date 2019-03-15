const Queue = require('./queue');

/*
 * This is the base interface for all models. It includes
 * all the functions that you will need to implement as well as
 * a few helpers. All specific models should extend this one.
 */
class Model {
  constructor(name, attributes) {
    this.name = name;
    this.attributes = {};
    this.queue = new Queue();

    this.parseAttributes(attributes);
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
      //Calls the datatype function referenced
      this.attributes[name] = definition(); 
    } else {
      this.attributes[name] = definition;
    }
  }

  /*
   * Runs the query queue. If a queue is required, this should be called
   * automatically when successfully connected to the database.
   */
  drainQueue() {
    this.queue.drain((queryType, callback) => callback());
  }

  /*
   * Queues or runs an operation based on whether the criteria is met.
   * This should always be used to ensure operations are only ran when
   * the model has what it needs and/or is connected.
   */
  attempt(criteria, name, callback) {
    if(!criteria) {
      this.queue.add(name, callback);
    } else {
      callback();
    }
  }

  /*
   * Inserts a new record.
   */
  create(record) {}

  /*
   * Retrieves a record.
   */
  read(query) {}

  /*
   * Retrieves a single record.
   */
  readSingle(query) {}

  /*
   * Retrieves a record or creates the record and returns it.
   */
  readOrCreate(query, record) {}

  /*
   * Updates a record.
   */
  update(filter, updates) {}

  /*
   * Upserts a record (creates the record if it doesn't exist).
   */
  updateOrCreate(filter, updates) {}

  /*
   * Upserts multiple records. The implementation of this will be complex.
   * @param {string} idAttribute - The name of the attribute to use when
   * querying the records to update.
   * @param {Array} ids - The values of the idAttribute for the records
   * that should be updated. If a value appears in the array but cannot
   * be found, the record will be created by combining the updates and
   * the value.
   * @param {object} updates - The updates to make on the records found,
   * or the base object to create in the database if not found.
   */
  updateOrCreateMany(idAttribute, ids, updates) {}

  /*
   * Removes a record.
   */
  delete(filter) {}

  /*
   * Fun alias for delete. #NukeIt
   */
  nuke(filter) {
    return this.delete(filter);
  }
};

module.exports = Model;