var fs = require("fs"),
    path = require("path");

module.exports = function(dir) {
  required = {};
  var files = fs.readdirSync(dir);
  files.forEach(function(file) {
    file = path.join(dir, file);
    fileInfo = fs.lstatSync(file);
    if (fileInfo.isFile()) {
      if (file.substr(-3) === ".js") {
        var key = path.basename(file, ".js");
        required[key] = require(file);
      }
    }
    else if (fileInfo.isDirectory()) {
      var basename = path.basename(file);
      required[basename] = requireAll(file, required);
    }
  });

  return required;
};