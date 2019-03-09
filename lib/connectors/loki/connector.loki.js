const Loki = require('lokijs'),
      Connector = require('./../../connector');
      //Model = require('./model.mongo');

class LokiDB extends Connector {
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
          resolve();
        }
      });
    });
  }
}

const MongoDB = function(configuration = {}, onConnect) {
  this.url = configuration.url;
  this.db = null;

  if(!this.url && configuration.host) {
    //We must build a URL from the configuration object if given in a non-URL format
    let auth = configuration.user || '';
    if(auth && configuration.pass) {
      auth += ':' + configuration.pass;
    }

    this.url = `mongodb://${auth ? auth + '@' : ''}${configuration.host}${configuration.port ? ':' + configuration.port : ''}/${configuration.db || 'Botington'}`;
  } else {
    this.url = 'mongodb://localhost:27017/Botington';
  }

  MongoClient.connect(this.url, (error, client) => {
    if(error && onConnect) {
      return onConnect(error);
    }

    this.connected = true;
    
    //Get the db based on the database given in the URL
    this.db = client.db(this.url.split('/').pop());
    
    if(onConnect) {
      onConnect(null);
    }

    for(let m in this.models) {
      this.models[m].collection = this.db.collection(m);
      this.models[m].drainQueue();
    }
  });
};

module.exports = function(configuration, onConnect) {
  return new LokiDB(configuration, onConnect);
};