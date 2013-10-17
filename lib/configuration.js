var path = require("path"),
    ooj = require("ooj"),
    express = require("express"),
    tools = require("./tools.js"),
    requireAll = require("./require_all");

module.exports = ooj.Class({
  construct: function(app) {
    this.app = app,
    this.configMap = {},
    this.configuration = {};
  },

  set: function(configFor, configFn) {
    if (!this.configMap[configFor]) {
      this.configMap[configFor] = [];
    }
    this.configMap[configFor].push(configFn);
  },

  _loadConfiguration: function(forEnv) {
    var self = this;
    if (this.configMap[forEnv]) {
      this.configMap[forEnv].forEach(function(envConfigFn) {
        (function(fn) {
          var config = {};
          fn.call({}, config);
          tools.merge(self.configuration, config);
        })(envConfigFn);
      });
    }
  },

  _configure: function(forEnv) {
    this._loadConfiguration("application");
    this._loadConfiguration(forEnv);
    this.app.set("port", this.configuration.port || process.env.PORT || 3000);
    if (this.configuration["view engine"]) {
      this.app.set("views", path.join(this.app.trees.applicationRoot, "app", "views"));
      this.app.set("view engine", this.configuration["view engine"]);
    }
    if (this.configuration.favicon && this.configuration.favicon === true)
      this.app.use(express.favicon());
    if (this.configuration.logger)
      this.app.use(express.logger(this.configuration.logger));
    if (this.configuration.compress && this.configuration.compress === true) { // Verify it's actually set
      this.app.use(express.compress());
    }
    if (this.configuration.cookies) {
      this.app.use(express.cookieParser(this.configuration.cookies));
    }
    if (this.configuration.cookies && this.configuration.sessions && this.configuration.sessions === true) {
      this.app.use(express.session());
    }
    if (!(this.configuration.bodyParser && this.configuration.bodyParser === false)) { // has to be configured off
      this.app.use(express.bodyParser());
    }
    this.app.use(express.methodOverride());
    this.app.use(this.app.router);
    this.app.use(express.static(path.join(this.app.trees.applicationRoot, "public")));
    if (this.configuration.errorHandler && this.configuration.errorHandler === true)
      this.app.use(express.errorHandler);
  },

  _loadConfigFiles: function() {
    require(path.join(this.app.trees.applicationRoot, "config", "application"));
    requireAll(path.join(this.app.trees.applicationRoot, "config", "environments"));
  }
});