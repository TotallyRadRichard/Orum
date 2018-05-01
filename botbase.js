const path = require('path'),
      MongoDB = require('./lib/connectors/mongodb/connector.mongo'),
      db = MongoDB(),
      members = db.model('members');

;

members.updateOrCreateMany([
  {
    filter: {username:'dude'},
    update: {$set:{isCool:true}}
  },
  {
    filter: {username:'dudethree'},
    update: {$set:{isCool:false,isAwsome:true}}
  }
], (error) => {
  console.log(error);
});