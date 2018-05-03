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

members.create({
  username: 'Member ' + (Math.round(Math.random() * 999999) + 100000),
  age: 0,
  lastping: Date.now()
}, (error, member) => {
  console.log(error || member);
});