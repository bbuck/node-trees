var ooj = require("ooj"),
    path = require("path"),
    requireAll = require("../lib/require_all");

module.exports = ooj.Class({
  construct: function(app) {
    var ctrlDir, ctrl;
    this.app = app;
    ctrlDir = path.join(this.app.trees.applicationRoot, "app", "controllers");
    this.controllers = requireAll(ctrlDir);
    this._configureViewPaths(this.controllers);
  },

  generateHandler: function(handler) {
    var ctrlKey, action, Controller;
    if (typeof handler === "string") {
      var temp = handler.split("#");
      if (temp.length !== 2)
        throw "Invalid handler string given to route handler";
      ctrlKey = temp[0];
      action = temp[1];
    }
    else if (handler.controller && handler.action) {
      ctrlKey = handler.controller;
      handler = handler.action;
    }
    else {
      throw "Invalid handler given to route handler";
    }

    Controller = this.controllers;

    ctrlKeys = ctrlKey.split("/");

    ctrlKeys.forEach(function(key) {
      Controller = Controller[key];
    });

    return function(req, res, next) {
      var viewPath, ctrlName = ctrlKeys[ctrlKeys.length - 1],
          ctrl = new Controller(ctrlName, action, req, res, next);
      ctrl[action]();
      if (!ctrl._completed && !res._headerSent) {
        ctrl.render(action);
      }
    };
  },

  _configureViewPaths: function(base, baseKey) {
    var ctrlKey, ctrl, basePath;
    baseKey = baseKey || "";
    for (ctrlKey in base) {
      ctrl = base[ctrlKey];
      if (baseKey.length === 0)
        basePath = ctrlKey;
      else
        basePath = [baseKey, "/", ctrlKey].join("");
      if (typeof ctrl === "function") {
        ctrl.prototype._viewPath = basePath;
      }
      else if (typeof ctrl === "object") {
        this._configureViewPaths(ctrl, basePath);
      }
    }
  }
});
