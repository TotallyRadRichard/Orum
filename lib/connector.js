const ModelBase = require('./model');

/*
 * Simple filler model for the base interface.
 */
Model = function(name, attributes) {
  this.name = name;
  this.parseAttributes(attributes);
};

Object.assign(Model.prototype, ModelBase);

/*
 * The main interface for connectors. The only override
 * in this interface should be the model method.
 */
module.exports = {
  /*
   * A hash of models, just in case you need to access
   * a model without a direct reference.
   */
  models: {},
  /*
   * Connected flag. Set this to true when connected.
   */
  connected: false,
  /*
   * Standard method for adding entries to the models hash.
   * There is no need to override this method normally.
   */
  addModel: function(name, model) {
    this.models[name] = model;
    return model;
  },
  /*
   * Returns a new model instance. Override this in your connector
   * to fit your model's bootstrapping needs.
   */
  model: function(name, attributes) {
    return new Model(name, attributes);
  }
};