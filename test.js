const bb = require('./botbase');
bb.register('loki');

const db = bb.connect({connector:'loki'});

db.connect().then((error) => {
  console.log('Connected?');
});

// const members = db.model('members', {
//   username:  bb.type.TEXT,
//   age: bb.type.INT,
//   lastping: bb.type.INT
// });

// let username = "Member 171051";
// //username = 'Member ' + (Math.round(Math.random() * 999999) + 100000);

// members.updateOrCreate({username:username}, {$set: {
//   age: 0,
//   lastping: Date.now()
// }}, (error, created) => {
//   console.log(error || created);
// });