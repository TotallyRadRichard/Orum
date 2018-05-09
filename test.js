const bb = require('./botbase');

const db = bb.connect({connector:'mongodb'}, function(error) {
  if(error) {
    throw error;
  }
});

const members = db.model('members', {
  username:  bb.type.TEXT,
  age: bb.type.INT,
  lastping: bb.type.INT
});

let username = "Member 171051";
//username = 'Member ' + (Math.round(Math.random() * 999999) + 100000);

members.readOrCreate({username:username}, {
  age: 0,
  lastping: Date.now()
}, (error, member) => {
  console.log(error || member);
});