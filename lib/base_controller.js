var ooj = require("ooj"),
    i = require("i")(),
    tools = require("./tools");

if (!i.count) {
  i.count = function(str, count) {
    if (count === 1)
      i.singularize(str);
    else
      i.pluralize(str);
  };
}

module.exports = ooj.Class({
  construct: function(ctrl, action, req, res, next) {
    this.request = req,
    this.response = res,
    this._next = next;
    this.viewData = {};
    this._completed = false;
    this._ripRequest(ctrl, action);
  },

  render: function(viewName, options) {
    var viewPath = this._getViewPath(viewName),
    options = options || {};
    tools.merge(options, this.viewData);
    options.i = i;
    options.session = this.request.session;
    this._render.call(this.response, viewPath, options);
    this._completed = true;
  },

  next: function() {
    this._completed = true;
    this._next();
  },

  _ripRequest: function(ctrl, action) {
    this._render = this.response.render;
    this.response.render = this.render;
    this.session = this.request.session;
    this.params = {};
    tools.merge(this.params, this.request.params);
    tools.merge(this.params, this.request.query);
    tools.merge(this.params, this.request.body);
    this.params.controller = ctrl;
    this.params.action = action;
  },

  _getViewPath: function(path) {
    var viewPath = this._viewPath || "";;
    if (path.indexOf("/") > -1 || viewPath.length === 0)
      return path;
    else
      return [viewPath, "/", path].join("");
  }
});