const Model = require('./model');

class Connector {
  constructor() {
    this.models = {};
    this.connected = false;
  }

  model(name, attributes) {
    this.models[name] = new Model(name, attributes);
    return this.models[name];
  }
}