const Model = require('./model');

class Interface {
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

  loadDefinition(name, attributes) {
    let definition = {name, attributes};

    if(name && name.endsWith('.js')) {
      definition = require(name);
    }

    return definition;
  }

  model(name, attributes) {
    let definition = this.loadDefinition(name, attributes);
    this.models[name] = new Model(def.name, def.attributes);
    return this.models[name];
  }
}

module.exports = Interface;