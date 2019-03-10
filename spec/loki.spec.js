const Orum = require('../index');

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
  
    it('should resolve when connected', () => {
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

  describe('Model Attributes', () => {

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
  });

  describe('Post Connection Model Operations', () => {
    let recordToSave = {
      name: 'Test One',
      value: 12,
      selected: false
    };

    it('should be able to create records', () => {
      return opModel.create(recordToSave).then(record => {
        expect(record).toEqual(recordToSave);
      });
    });

    it('should be able to read multiple records', () => {
      return opModel.read({name:recordToSave.name}).then(records => {
        expect(records[0]).toEqual(recordToSave);
      });
    });

    it('should be able to read single records', () => {
      return opModel.readSingle({name:recordToSave.name}).then(record => {
        expect(record).toEqual(recordToSave);
      });
    });
  });
});