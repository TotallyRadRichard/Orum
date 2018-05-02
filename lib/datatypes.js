module.exports = {
  BOOLEAN: function() {
    return {type:'boolean'}
  },
  TEXT: function(length = 255, fixed = false) {
    return {
      type: 'text',
      length, fixed
    };
  },
  INT: function(bits = 32, signed = false) {
    return {
      type: 'int',
      bits, signed
    };
  },
  FLOAT: function(bytes = 4, percision = 2, signed = false) {
    return {
      type: 'float',
      bytes, percision, signed
    };
  },
  DATE: function(dateonly = false) {
    return {
      type: (dateonly ? 'date' : 'datetime')
    };
  },
  TIME: function() {
    return {type:'time'};
  },
  UUID: function(version = 4) {
    return {
      type: `uuid${version}` 
    };
  },
  BLOB: function(size = 'medium') {
    return {
      type: 'blob',
      size
    };
  }
};