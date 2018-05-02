const connectors = require('./lib/connectors'),
      dataTypes = require('./lib/datatypes'),
      db = connectors.MongoDB();

const members = db.model('members', {
  username: dataTypes.TEXT,
  age: dataTypes.INT,
  lastping: dataTypes.DATE
});

members.nuke({username:'dudethree'}, (error) => {
  console.log(error);
});