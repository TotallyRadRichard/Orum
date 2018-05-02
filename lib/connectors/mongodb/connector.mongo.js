const MongoClient = require('mongodb').MongoClient,
      Model = require('./model.mongo');

const MongoDB = function(configuration = {}, onConnect) {
  this.url = configuration.url;
  this.connected = false;
  this.db = null;
  this.models = {};

  if(!this.url && configuration.host) {
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

MongoDB.prototype.model = function(name, attributes) {
  if(!this.connected) {
    this.models[name] =  new Model(null, attributes);
  } else {
    this.models[name] = new Model(this.db.collection(name), attributes);
  }

  return this.models[name];
};

module.exports = function(configuration, onConnect) {
  return new MongoDB(configuration, onConnect);
};