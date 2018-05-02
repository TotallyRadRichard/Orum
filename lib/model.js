const Queue = require('./queue')

/*
 * This is the base interface for all models. It includes
 * all the functions that you will need to implement as well as
 * a few helpers. It is provided as an object you "mixin" to
 * your prototype via Object.assign(YourModel.prototype, BaseModel);
 */
const Model = {
  attributes: {},
  /*
  * Creates a queue to use for pre-connected queries.
  */
  createQueue: function() {
    this.queue = Queue();
  },
  /*
   * Sets an attribute definition on the model. Some connectors may
   * override this based on the specific ORM they use.
   */
  addAttribute: function(name, definition) {
    this.attributes[name] = definition;
  },
  /*
   * Runs the query queue. If a queue is required, this should be called
   * automatically when the connector successfully connects to the database.
   */
  drainQueue: function() {
    this.queue.drain((queryType, args) => this[queryType](...args));
  },
  /*
   * Inserts a new record.
   */
  create: function(record, onComplete) {},
  /*
   * Retrieves a record.
   */
  read: function(query, onComplete) {},
  /*
   * Updates a record.
   */
  update: function(filter, updates, onComplete) {},
  /*
   * Upserts a record (creates the record if it doesn't exist).
   */
  updateOrCreate: function(filter, updates, onComplete) {},
  /*
   * Upserts multiple records. The implementation of this will be complex.
   */
  updateOrCreateMany: function(updates, onComplete) {},
  /*
   * Removes a record.
   */
  delete: function(filter, onComplete) {},
  /*
   * Fun alias for delete. #NukeIt
   */
  nuke: function(filter, onComplete) {
    this.delete(filter, onComplete);
  }
};

module.exports = Model;