class Queue {
  constructor() {
    this.queue = [];
  }

  add(name, data) {
    this.queue.push([name, data]);
    return true;
  }

  addIf(add, name, data) {
    if(add) {
      return this.add(name, data);
    }
  }

  drain(processor) {
    this.queue.forEach((entry, index) => processor(entry[0], entry[1], index));
    this.queue = [];
  }
}

/*
 * Queue Factory
 */
module.exports = function() {
  return new Queue();
};