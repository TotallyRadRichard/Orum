const Orum = require('../index'),
      path = require('path');

describe('Loki Interface', () => {
  const db = Orum.create({interface:'loki'}),
        opModel = db.model('tester', {
          name: Orum.type.TEXT,
          value: Orum.type.INT,
          selected: Orum.type.BOOLEAN
        });

  describe('Database Connection', () => {

    it('should start disconnected', () => {
      expect(db.connected).toBe(false);
    });

    it('should not initialize models before connected', () => {
      const model = db.model('pretest');
      expect(model.collection).toBeNull();
    });
  
    it('should resolve queues when connected', () => {
      let queuedRecord = {
        name: 'Test One',
        value: 12,
        selected: false
      };

      opModel.create(queuedRecord).then(record => {
        expect(record).toEqual(queuedRecord);
      });

      expect(opModel.queue.queue.length).toBe(1);

      return db.connect().then(() => {
        expect(db.connected).toBe(true);
      });
    });

    it('should initialize models after connected', () => {
      expect(db.models['pretest'].collection).not.toBeNull();
    });

    it('should initialize new models if connected', () => {
      const model = db.model('posttest');
      expect(model.collection).not.toBeNull();
    });
  });

  describe('Model Basics', () => {

    it('should allow defining attributes on creation', () => {
      const model = db.model('createAtt', {
        name: Orum.type.TEXT,
        value: Orum.type.INT,
        selected: Orum.type.BOOLEAN
      });

      expect(model.attributes.name).toEqual(Orum.type.TEXT());
      expect(model.attributes.value).toEqual(Orum.type.INT());
      expect(model.attributes.selected).toEqual(Orum.type.BOOLEAN());
    });

    it('should allow adding attributes after creation', () => {
      const model = db.model('afterAtt');

      expect(model.attributes.name).toBeUndefined();

      model.addAttribute('name', Orum.type.TEXT);

      expect(model.attributes.name).toEqual(Orum.type.TEXT());
    });

    it('should be able to load external model files',  () => {
      const model = db.model(path.join(__dirname, 'model.test.js'));

      expect(model.name).toBe('External Model');
      expect(model.attributes.obj).toEqual(Orum.type.JSON());
      expect(db.models[model.name]).toBe(model);
    });
  });

  describe('Model Operations', () => {
    let recordToCreate = {
      name: 'Test Two',
      value: 12,
      selected: false
    };

    let recordToResert = {
      name: 'Test Three',
      value: 12,
      selected: false
    };

    it('should be able to create records', () => {
      return opModel.create(recordToCreate).then(record => {
        expect(record).toEqual(recordToCreate);
      });
    });

    it('should be able to read single records', () => {
      return opModel.readSingle({name:recordToCreate.name}).then(record => {
        expect(record).toEqual(recordToCreate);
      });
    });

    it('should be able to read a record, if exists, or create it if not', () => {
      opModel.readOrCreate({name:recordToCreate.name}).then(record => {
        expect(record).toEqual(recordToCreate);
      });

      return opModel.readOrCreate({
        name:recordToResert.name
      }, recordToResert).then(record => {
        expect(record).toEqual(recordToResert);
      });
    });

    it('should be able to read multiple records', () => {
      return opModel.read({selected:false}).then(records => {
        expect(records.length).toBe(3);
        expect(records[1]).toEqual(recordToCreate);
        expect(records[2]).toEqual(recordToResert);
      });
    });

    it('should be able to update a record', () => {
      return opModel.update({name:recordToCreate.name}, {$set:{value:14}}).then(record => {
        expect(record.value).toBe(14);
      });
    });

    it('should be able to update a record, if exists, or create it if not', () => {
      opModel.updateOrCreate({name:recordToResert.name},{$set:{value:15}}).then(record => {
        expect(record.value).toEqual(15);
      });

      return opModel.updateOrCreate({name:'Test Four'}, {$setOnInsert:{value:16}}).then(record => {
          expect(record).toEqual(jasmine.objectContaining({
            name: 'Test Four',
            value: 16
          }));
      });
    });

    it('should be able to set sub-fields using dot notation', () => {
      const subFieldRecord = {
        name: 'Test Six',
        value: {
          one: 'one',
          two: 'two',
          three: {
            number: 3
          }
        }
      };

      return opModel.create(subFieldRecord).then(record => {
        return opModel.update({name:subFieldRecord.name}, {$inc:{'value.three.number':1}}).then(record => {
          expect(record.value).toEqual({
            one: 'one',
            two: 'two',
            three: {
              number: 4
            }
          });
        });
      });
    });

    it('should be able to update multiple records, creating ones that dont exist', () => {
      return opModel.updateOrCreateMany(
        'name',
        ['Test Four', 'Test Five'],
        {$set:{value:22}, $setOnInsert:{value:8}}).then(records => {
          expect(records[0].value).toBe(22);
          expect(records[1]).toEqual(jasmine.objectContaining({
            name: 'Test Five',
            value: 8
          }));
        });
    });

    it('should be able to increment a field using $inc', () => {
      return opModel.update({name:recordToCreate.name}, {$inc:{value:4}}).then(record => {
        expect(record.value).toBe(18);
      });
    });

    it('should be able to delete a single record', () => {
      expect(opModel.collection.count()).toBe(6);

      return opModel.delete({name:'Test One'}).then(() => {
        expect(opModel.collection.count()).toBe(5);
      });
    });

    it('should clear a collection when deleting without a filter', () => {
      expect(opModel.collection.count()).toBe(5);

      return opModel.delete().then(() => {
        expect(opModel.collection.count()).toBe(0);
      });
    });
  });
});