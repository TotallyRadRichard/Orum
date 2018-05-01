const Queue = function() {
  this.queue = [];
};

Queue.prototype.add = function(name, data) {
  this.queue.push([name, data]);
};

Queue.prototype.addIf = function(add, name, data) {
  if(add) {
    this.add(name, data);
    return true;
  }

  return false;
};

Queue.prototype.drain = function(iterator) {
  this.queue.forEach(entry => iterator(entry[0], entry[1]));
  this.queue = [];
};

module.exports = function() {
  return new Queue();
};