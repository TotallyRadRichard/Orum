const Model = {
  addAttribute: function(name, type) {},
  create: function(record, onComplete) {},
  read: function(query, onComplete) {},
  update: function(filter, updates, onComplete) {},
  updateOrCreate: function(filter, updates, onComplete) {},
  updateOrCreateMany: function(updates, onComplete) {},
  delete: function(filter, onComplete) {}
};

module.exports = Model;