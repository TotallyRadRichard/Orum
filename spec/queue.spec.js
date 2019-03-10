const Queue = require('../lib/queue'),
      queue = new Queue(),
      data = {some:'data'};

describe('Queue Object', () => {

  it("should start with an empty queue", () => {
    expect(queue.queue.length).toBe(0);
  });

  it('should allow adding to the queue', () => {
    queue.add('name', {some:'data'});

    expect(queue.queue[0]).toEqual(['name', data]);
  });

  it('should allow adding with if', () => {
    queue.addIf(true, 'nametrue', data);

    expect(queue.queue[1]).toEqual(['nametrue', data]);
  });

  it('should not allow a false if', () => {
    queue.addIf(false, 'namefalse', data);

    expect(queue.queue.length).toBe(2);
  });

  it('should be able to drain its queue', () => {
    queue.drain((n, d, i) => {
      if(i === 0) {
        expect(n).toBe('name');
      } else if(i === 1) {
        expect(n).toBe('nametrue');
      }

      expect(d).toEqual(data);
    });

    expect(queue.queue.length).toBe(0);
  });
});