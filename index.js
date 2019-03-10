const path = require('path');

module.exports = {
  type: require(path.join(__dirname, 'lib', 'datatypes.js')),
  
  // Reference to base Connector class
  Interface: require(path.join(__dirname, 'lib', 'interface.js')),

  // Reference to base Model class
  Model: require(path.join(__dirname, 'lib', 'model.js')),

  /* 
   * Collection of database connectors loaded for use,
   * pre-filled with built-in connectors. Built-in connectors
   * are not loaded by default, to prevent unneed files from 
   * being required.
   */
  interfaces: {
    'loki': path.join(__dirname, 'lib', 'connectors', 'loki', 'loki.interface.js')
  },

  /*
   * Creates a new database interface instance.
   */
  create: function(configuration) {
    let db = new this.Interface();
  
    if(!configuration || !configuration.interface) {
      db.error = 'You must specify a database interface type in [configuration.interface].';
    }

    const interface = configuration.interface;

    // Automatically loads a built-in interface if its not already loaded
    if(this.interfaces[interface] 
      && typeof this.interfaces[interface] === 'string') 
    {
      this.interfaces[interface] = require(this.interfaces[interface]);
    }
  
    if(this.interfaces[interface]) {
      db = this.interfaces[interface](configuration);
    } else {
      db.error = `No connector found for ${interface}`;
    }
  
    return db;
  },

  /*
   * Registers a database interface.
   */
  register: function(name, path) {
    if(!this.interfaces[name]) {
      this.interfaces[name] = require(path);
    }
  }
};