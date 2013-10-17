"use script";

var os = require("os"),
    fs = require("fs"),
    path = require("path"),
    i = require("i")();

var eol = os.EOL;

module.exports = function(program, pkg) {
  var cleanUp, file,
      filePath = program.args.shift(),
      dirPath = path.join(process.cwd(), filePath);

  // package.json
  var package = [
    '{',
    '  "name": "application-name",',
    '  "version": "0.0.1",',
    '  "private": true,',
    '  "main": "index.js",',
    '  "scripts": {',
    '    "start": "node index.js"',
    '  },',
    '  "dependencies": {',
    '    "express": "3.4.0",',
    '    "tree-server": "' + pkg.version + '",',
    '    "jade": "*",',
    '    "ooj": "~> 0.1.0",',
    '    "i": "~> 0.3.2",',
    '    "grunt": "~> 0.4.1"',
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
  ].join(eol);

  // index.js (core of the application)
  var index = [
    'var path = require("path"),',
    '    trees = require("tree-server"),',
    '    http = require("http"),',
    '    app = require("./scripts/app");',
    '',
    'process.env.TREES_ENV = process.env.TREES_ENV || "development"',
    'app.trees = {',
    '  applicationRoot: __dirname,',
    '  environment: process.env.TREES_ENV',
    '};',
    '',
    '// Load and configure the express server',
    'app.trees.config = new trees.Configuration(app);',
    'app.trees.config._loadConfigFiles();',
    'app.trees.config._configure(app.trees.environment);',
    '',
    '// Load the route handler and router',
    'app.trees.routeHandler = new trees.RouteHandler(app);',
    'app.trees.router = new trees.Router(app);',
    '',
    '// Load the routes',
    'require("./config/routes");',
    '',
    'var server = http.createServer(app).listen(app.get("port"), function(){',
    '  console.log("Express server listening on port " + app.get("port"));',
    '});'
  ].join(eol);

  // config/routes.js
  var routes = [
    'var app = require("../scripts/app");',
    '',
    'app.trees.router.draw(function() {',
    '  // You should set a default route for your root path',
    '  //   this.root({to: {controller: "controller", action: "action"}});',
    '  //  OR',
    '  //   this.root({to: "controller#action"});',
    '  //  OR',
    '  //   this.root("controller#action");',
    '',
    '  this.root("pages#home");',
    '',
    '  // Use match to match arbitrary routes',
    '  //   this.match("posts", {handler: "posts#index", via: "get"});',
    '',
    '  // Use specific methods if you need to.',
    '  //  this.get("post/:post_id/comments", "post#comments");',
    '  //  this.delete("post", "post#delete");',
    '',
    '  // Use resources to specify standard CRUD routes for a certain resource',
    '  //   this.resources("posts");',
    '  // Gives you:',
    '  //   GET /posts => "posts#index"',
    '  //   GET /posts/new => "posts#new"',
    '  //   POST /posts => "posts#create"',
    '  //   (express param) :post_id => "posts#load_post"',
    '  //   GET /posts/:post_id => "posts#show"',
    '  //   GET /posts/:post_id/edit => "posts#edit"',
    '  //   PUT/PATCH /posts/:post_id => "posts#update"',
    '  //   DELETE /posts/:post_id => "posts#delete"',
    '',
    '  // Use namespaces to group routes',
    '  //   this.namespace("admin", function() {',
    '  //     this.root({to: "admin#home"}); // => GET /admin',
    '  //     this.get("control_panel", "admin#control_panel"); // GET /admin/control_panel',
    '  //   });',
    '});'
  ].join(eol);

  // config/database.json
  var databaseJson = [
    '{',
    '  "development": {',
    '    "adapter": "mongodb",',
    '    "host": "localhost"',
    '  },',
    '  "production": {',
    '    "adapter": "mongodb",',
    '    "host": "localhost"',
    '  },',
    '  "test": {',
    '    "adapter": "mongodb",',
    '    "host": "localhost"',
    '  },',
    '}'
  ].join(eol);

  // config/application.js
  var applicationConfig = [
    'var app = require("../scripts/app");',
    '',
    'app.trees.config.set("application", function(config) {',
    '  config["view engine"] = "jade";',
    '  config.favicon = true;',
    '  config.logger = "dev";',
    '  config.cookies = "your secret goes here";',
    '  config.sessions = true;',
    '});'
  ].join(eol);

  // config/environments/development.js
  var developmentConfig = [
    'var app = require("../../scripts/app");',
    '',
    'app.trees.config.set("development", function(config) {',
    '  config.errorHandler = true;',
    '});'
  ].join(eol);

  // config/environment/production.js
  var productionConfig = [
    'var app = require("../../scripts/app");',
    '',
    'app.trees.config.set("production", function(config) {',
    '  config.compress = true;',
    '});'
  ].join(eol);

  // app/controllers/pages.js
  var pagesController = [
    'var ooj = require("ooj"),',
    '    BaseController = require("tree-server").BaseController;',
    '',
    '// Define our Pages Controller, the use of OOJ is here to make extending',
    '// the BaseController simpler and less involved.',
    'module.exports = ooj.Class({',
    '  // Grab functionality in the Base Controller',
    '  extend: BaseController,',
    '',
    '  // This is the home action, actions are just named functions inside of a',
    '  // controller',
    '  home: function() {',
    '    // Anything attached to viewData will be passed to the view when it is',
    '    // rendered.',
    '    this.viewData.name = "World";',
    '',
    '    // There was no render or send call specified, which means that trees',
    '    // will look for app/views/pages/home.jade to render. We can specify',
    '    // a render if we want something different',
    '    //   this.render("alt_home");',
    '    // The above will look for app/views/pages/alt_home.jade',
    '  }',
    '});'
  ].join(eol);

  // app/views/home.ejs
  var homeView = [
    'extends ../layouts/application',
    '',
    'block body',
    '  div',
    '    h1 Hello, #{name}'
  ].join(eol);

  // app/views/layouts/application.jade
  var applicationLayout = [
    '!!!',
    'html',
    '  head',
    '    title ' + i.titleize(filePath),
    '    block head',
    '  body',
    '    block body'
  ].join(eol);

  // ----- END FILE CONTENTS -----

  var structure = {
    "package.json": package,
    "index.js": index,
    "app": {
      "controllers": {
        "pages.js": pagesController
      },
      "models": {},
      "views": {
        "layouts": {
          "application.jade": applicationLayout
        },
        "pages": {
          "home.jade": homeView
        }
      }
    },
    "config": {
      "routes.js": routes,
      "database.json": databaseJson,
      "application.js": applicationConfig,
      "environments": {
        "development.js": developmentConfig,
        "production.js": productionConfig
      }
    },
    "public": {
      "images": {},
      "javascripts": {},
      "stylesheets": {}
    },
    "scripts": {
      "app.js": app
    }
  };

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
            fs.writeFile(path.join(rootPath, key), file, function() {});
          }
          else {
            newDirPath = path.join(rootPath, key);
            fs.mkdir(newDirPath, function(err) {
              if (err)
                throw err;
              createFiles(file, newDirPath);
            });
          }
        })(prop);
      }
    });
  }
};
