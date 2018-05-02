const connectors = require('./lib/connectors'),
      db = connectors.MongoDB(),
      members = db.model('members');

members.nuke({username:'dudethree'}, (error) => {
  console.log(error);
});