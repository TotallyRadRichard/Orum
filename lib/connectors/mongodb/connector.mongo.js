const MongoClient = require('mongodb').MongoClient,
      ConnectorBase = require('./../../connector'),
      Model = require('./model.mongo');

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

Object.assign(MongoDB.prototype, ConnectorBase);

MongoDB.prototype.model = function(name, attributes) {
  let collection = null;

  if(this.connected) {
    collection = this.db.collection(name);
  }

  return this.addModel(name, new Model(collection, attributes));
};

module.exports = function(configuration, onConnect) {
  return new MongoDB(configuration, onConnect);
};