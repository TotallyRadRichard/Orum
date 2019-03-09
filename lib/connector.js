const Model = require('./model');

class Connector {
  constructor() {
    this.db = null;
    this.models = {};
    this.connected = false;
    this.error = '';
  }

  connect() {
    return new Promise((resolve, reject) => {
      if(this.error) {
        return reject(this.error);
      }

      resolve();
    });
  }

  model(name, attributes) {
    this.models[name] = new Model(name, attributes);
    return this.models[name];
  }
}

module.exports = Connector;