# Trees

Trees is a wrapper around the very awesome express.js module that provides a
more structured and common MVC framework to work with. You gain the benefit of
tested MVC structure and the stability and features of express (a win/win)!

# Usage

**NOTE:** It's important to note that Trees in a _very_ early alpha stage and
these instructions are almost guaranteed to change soon or break.

### Install

Install the trees module globally first.

```
$ npm install -g tree-server
```

### Create a New Trees Application

```
$ trees new application
$ cd application
$ npm install -d
```

### Create A Controller

Create a file `application/app/controllers/pages.js`

```javascript
// This is not totally necessary now, but once base Controllers are implemented
// this will greatly help in simplyfing inheritance
var ooj = require("ooj");

module.exports = ooj.Class({
  // This function is required now but as soon as a base Controller class
  // is written it will no longer be necessary.
  construct: function(req, res, next) {
    this.request = req,
    this.response = res,
    this.next = next;
  },

  // This is our action
  home: function() {
    // Views are not wired in yet so it's best to keep your samples short and
    // simple (response.end)
    return this.response.end("<h1>Hello, World!</h1>");
  }
});
```

Now we need to tell trees when to access your action. Open up `application/config/routes.js`

```javascript
var app = require("../scripts/app");

app.trees.router.draw(function() {
  // You should set a default route for your root path
  //   this.root({to: "controller#action"});
  //  OR
  //   this.root({to: {controller: "controller", action: "action"}});

  // Add this line here, the above is incorrect (for now) as the root function
  // doesn't exist yet.
  this.get("/", {handler: "pages#home"});
});
```

### Run Trees!

Finally, run your server! For now, we do it all manually. I'm planning on adding
in a `trees server` that will run the server with a live reload feature (etc...)
in the future.

```
$ node index.js
```

And finally, go to `localhost:3000` in your browser!

# Author

Brandon Buck <lordizuriel@gmail.com>

# Licence

[MIT](http://opensource.org/licenses/MIT)
