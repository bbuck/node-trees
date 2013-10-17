module.exports = {
  merge: function(target, source) {
    var prop;
    for (prop in source) {
      target[prop] = source[prop];
    }
  }
};