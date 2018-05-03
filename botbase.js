const connectors = require('./lib/connectors'),
      BotBase = {};

BotBase.type = require('./lib/datatypes');

BotBase.connect = function(configuration, onConnect) {
  if(!configuration || !configuration.connector) {
    return onConnect(new Error('You must specify a connector type in [configuration.connector].'));
  }

  switch(configuration.connector.toLowerCase()) {
    case 'mongodb':
      return connectors.MongoDB(configuration, onConnect);
      break;
    default:
      onConnect(new Error(`No connector found for ${configuration.connector}`));
  }
};

module.exports = BotBase;