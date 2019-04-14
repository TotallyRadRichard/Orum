const Loki = require('lokijs'),
      Interface = require('../../interface'),
      Model = require('./loki.model');

class LokiDB extends Interface {
  constructor(configuration = {}) {
    super();

    this.path = configuration.url || './database.db';
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.db = new Loki(this.path, {
        autosave: true,
        autosaveInterval: 1000,
        autoload: true,
        autoloadCallback: () => {
          this.initialize();
          resolve();
        }
      });
    });
  }

  initialize() {
    this.connected = true;

    for(let m in this.models) {
      this.models[m].initialize(this.db);
    }
  }

  model(name, attributes = {}) {
    let def = this.loadDefinition(name, attributes);

    const model = new Model(def.name, def.attributes);
    this.models[name] = model;

    if(this.connected) {
      model.initialize(this.db);
    }

    return model;
  }
}

module.exports = function(configuration, onConnect) {
  return new LokiDB(configuration, onConnect);
};