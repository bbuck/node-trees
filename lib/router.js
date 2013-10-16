var ooj = require("ooj"),
    reqMethods = require("methods"),
    RequiredPropertyError = require("../lib/required_prop_error");

var nsDefObject, routerDefObject, genRouteDefHelper, Namespace;

// Generate shorthand match functions
genRouteDefHelper = function(method) {
  return function(route, options) {
    options = this._defaultOptions(options);
    options.via = [method];
    this.match(route, options);
  }
};

// Namespace class definition object
nsDefObject = {
  construct: function(app, root) {
    this.app = app;
    this.routeHandler = this.app.trees.routeHandler;
    this.rootPath = root;
    if (this.rootPath[0] !== "/") {
      this.rootPath = ["/", this.rootPath].join("");
    }
  },

  draw: function(fn) {
    fn.call(this);
  },

  match: function(route, options) {
    var via;
    options = this._defaultOptions(options);
    if (!options.via)
      throw new RequiredPropertyError("When using the \"match\" function you must specify an HTTP method with the \"via\" option.");
    if (!options.handler)
      throw new RequiredPropertyError("Every route needs a \"handler\" defined or it is useless!");
    via = options.via;
    if (!(via instanceof Array))
      via = [via];
    via.forEach(function(method) {
      if (this.app[method]) {
        console.log("Creating", method.toUpperCase(), this._makePath(route), "that points to", options.handler);
        this.app[method](this._makePath(route), this.routeHandler.generateHandler(options.handler));
      }
    }, this);
  },

  resources: function(resourceName, options) {

  },

  root: function(options) {
    if (typeof options === "string")
      options = {to: options}
    if (!options.to)
      throw new RequiredPropertyError("When using \"root\" you must specify a handler with the \"to\" property!")
    this.match("/", {handler: options.to, via: ["get"]});
  },

  namespace: function(root, fn) {
    var ns = new Namespace(this.app, root);
    ns.draw(fn);
  },

  _defaultOptions: function(options) {
    var optionsType;
    options = options || {};
    optionsType = typeof options;
    if (optionsType === "string"
          || (optionsType === "object" && options.controller && options.action))
      options = {handler: options}
    return options;
  },

  _makePath: function(route) {
    if (route[0] !== "/")
      route = ["/", route].join("");
    if (route === "/" || this.rootPath === "/")
      return route;
    else
      return [this.rootPath, route].join("");
  }
};

// Generate all the route match helpers
reqMethods.forEach(function(method) {
  nsDefObject[method] = genRouteDefHelper(method);
});

// Create the Namespace class
Namespace = ooj.Class(nsDefObject);

// Router class definition object
routerDefObject = {
  construct: function(app) {
    this.app = app;
    this.nsRoot = new Namespace(app, "/");
  },

  draw: function(fn) {
    this.nsRoot.draw(fn);
  }
};

module.exports = ooj.Class(routerDefObject);

// Example Usage
// router.draw(function() {
//   this.resources("users", {except: ["show"]});
//   this.match("home", {handler: {controller: "pages", action: "home"}, via: ["get"]});
//   this.get("home", {handler: "pages#home"});
//   this.namespace("admin", function() {
//     this.root({to: "pages#home"});
//   });
// });