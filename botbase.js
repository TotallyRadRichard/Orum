const BotBase = {};

BotBase.type = require('./lib/datatypes');
BotBase.Connector = require('./lib/connector');
BotBase.Model = require('./lib/model');

// Collection of database connectors to use
// pre-filled with built in connectors
BotBase.connectors = {
  // 'mongodb': './lib/connectors/mongodb/connector.mongo',
  'loki': './lib/connectors/loki/connector.loki'
};

BotBase.connect = function(configuration) {
  let db = new BotBase.Connector();

  if(!configuration || !configuration.connector) {
    db.error = 'You must specify a connector type in [configuration.connector].';
  }

  if(BotBase.connectors[configuration.connector]) {
    db = BotBase.connectors[configuration.connector](configuration);
  } else {
    db.error = `No connector found for ${configuration.connector}`;
  }

  return db;
};

BotBase.register = function(name, path) {
  if(BotBase.connectors[name] && typeof BotBase.connectors[name] === 'string') {
    BotBase.connectors[name] = require(BotBase.connectors[name]);
  } else if(BotBase.connectors[name]) {
    BotBase.connectors[name] = require(path);
  }
};

module.exports = BotBase;