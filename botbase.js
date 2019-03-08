const BotBase = {};

BotBase.type = require('./lib/datatypes');

// Collection of database connectors to use
// pre-filled with built in connectors
BotBase.connectors = {
  'mongodb': './lib/connectors/mongodb/connector.mongo'
};

BotBase.connect = function(configuration, onConnect) {
  if(!configuration || !configuration.connector) {
    return onConnect(new Error('You must specify a connector type in [configuration.connector].'));
  }

  if(BotBase.connectors[configuration.connector]) {
    BotBase.connectors[configuration.connector](configuration, onConnect);
  } else {
    onConnect(new Error(`No connector found for ${configuration.connector}`));
  }
};

BotBase.connector = function(name, path) {
  if(BotBase.connectors[name] && typeof BotBase.connectors[name] === 'string') {
    BotBase.connectors[name] = require(BotBase.connectors[name]);
  } else if(BotBase.connectors[name]) {
    BotBase.connectors[name] = require(path);
  }
};

module.exports = BotBase;