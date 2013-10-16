"use script";

var os = require("os"),
    fs = require("fs"),
    path = require("path");

var eol = os.EOL;

module.exports = function(program, pkg) {
  // package.json
  var package = [
    '{',
    '  "name": "application-name",',
    '  "version": "0.0.1",',
    '  "private": true,',
    '  "scripts": {',
    '    "start": "node index.js"',
    '  },',
    '  "dependencies": {',
    '    "express": "3.4.0",',
    '    "trees": "' + pkg.version + '",',
    '    "hjs": "*",',
    '    "ooj": "~> 0.1.0"',
    '  }',
    '}'
  ].join(eol);

  // scripts/app.js
  var app = [
    '/**',
    ' * Module dependencies.',
    ' */',
    '',
    'var express = require("express"),',
    '    http = require("http"),',
    '    path = require("path");',
    '',
    'var app;',
    '',
    'module.exports = app = express();',
    '',
    '// all environments',
    'app.set("port", process.env.PORT || 3000);',
    'app.set("views", __dirname + "/views");',
    'app.set("view engine", "hjs");',
    'app.use(express.favicon());',
    'app.use(express.logger("dev"));',
    'if ("production" === app.get("env")) {',
    '  app.use(express.compress());',
    '}',
    'app.use(express.cookieParser("your secret goes here");',
    'app.use(express.session());',
    'app.use(express.bodyParser());',
    'app.use(express.methodOverride());',
    'app.use(app.router);',
    'app.use(express.static(path.join(__dirname, "public")));',
    '',
    '// development only',
    'if ("development" == app.get("env")) {',
    '  app.use(express.errorHandler());',
    '}'
  ].join(eol);

  var index = [
    'var path = require("path"),',
    '    trees = require("trees"),',
    '    http = require("http"),',
    '    app = require("./scripts/app"),',
    '    rootPath = path.dirname(__filename);',
    '',
    'app.trees = {',
    '  applicationRoot: rootPath,',
    '};',
    'app.trees.routeHandler = new trees.RouteHandler(app)',
    'app.trees.router = new trees.Router(app);',
    '',
    'require("./config/routes");',
    '',
    'http.createServer(app).listen(app.get("port"), function(){',
    '  console.log("Express server listening on port " + app.get("port"));',
    '});'
  ].join(eol);

  var routes = [
    'var app = require("../scripts/app");',
    '',
    'app.trees.router.draw(function() {',
    '  // You should set a default route for your root path',
    '  //   this.root({to: "controller#action"});',
    '  //  OR',
    '  //   this.root({to: {controller: "controller", action: "action"}});',
    '});'
  ].join(eol);

  var structure = {
    "package.json": package,
    "index.js": index,
    "app": {
      "controllers": {},
      "models": {},
      "views": {}
    },
    "config": {
      "routes.js": routes,
      "database.json": ""
    },
    "public": {
      "images": {},
      "javascripts": {},
      "stylesheets": {}
    },
    "scripts": {
      "app.js": app
    }
  },
  cleanUp,
  filePath = program.args.shift(), file,
  dirPath = path.join(process.cwd(), filePath);

  cleanUp = (function() {
    var count = 0;
    return function() {
      ++count;
      if (count >= 15) {
        process.exit();
      }
    }
  })();

  fs.mkdir(dirPath, function(err) {
    createFiles(structure, dirPath);
  });

  function createFiles(structure, rootPath) {
    return process.nextTick(function() {
      var prop;
      for (prop in structure) {
        (function(key) {
          var file, typeOfFile, newDirPath;
          file = structure[key];
          typeOfFile = typeof structure[key];
          if (typeOfFile === "string") {
            fs.writeFile(path.join(rootPath, key), file, function() {
              cleanUp();
            });
          }
          else {
            newDirPath = path.join(rootPath, key);
            fs.mkdir(newDirPath, function(err) {
              if (err)
                throw err;
              cleanUp();
              createFiles(file, newDirPath);
            });
          }
        })(prop);
      }
    });
  }
};
