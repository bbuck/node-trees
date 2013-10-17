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
$ npm install
```

### Create A Controller

Review the default generated controller. You should see:

```javascript
var ooj = require("ooj"),
    BaseController = require("tree-server").BaseController;

// Define our Pages Controller, the use of OOJ is here to make extending
// the BaseController simpler and less involved.
module.exports = ooj.Class({
  // Grab functionality in the Base Controller
  extend: BaseController,

  // This is the home action, actions are just named functions inside of a
  // controller
  home: function() {
    // Anything attached to viewData will be passed to the view when it is
    // rendered.
    this.viewData.name = "World";

    // There was no render or send call specified, which means that trees
    // will look for app/views/pages/home.jade to render. We can specify
    // a render if we want something different
    //   this.render("alt_home");
    // The above will look for app/views/pages/alt_home.jade
  }
});
```

Check the `config/routes.js` and see how trees knows which controller and action
to perform for which route. You can see we've defined the root path (`/`) to point
to the `pages` controllers `home` action.

```javascript
var app = require("../scripts/app");

app.trees.router.draw(function() {
  // You should set a default route for your root path
  //   this.root({to: {controller: "controller", action: "action"}});
  //  OR
  //   this.root({to: "controller#action"});
  //  OR
  //   this.root("controller#action");

  this.root("pages#home");

  // Use match to match arbitrary routes
  //   this.match("posts", {handler: "posts#index", via: "get"});

  // Use specific methods if you need to.
  //  this.get("post/:post_id/comments", "post#comments");
  //  this.delete("post", "post#delete");

  // Use resources to specify standard CRUD routes for a certain resource
  //   this.resources("posts");
  // Gives you:
  //   GET /posts => "posts#index"
  //   GET /posts/new => "posts#new"
  //   POST /posts => "posts#create"
  //   (express param) :post_id => "posts#load_post"
  //   GET /posts/:post_id => "posts#show"
  //   GET /posts/:post_id/edit => "posts#edit"
  //   PUT/PATCH /posts/:post_id => "posts#update"
  //   DELETE /posts/:post_id => "posts#delete"

  // Use namespaces to group routes
  //   this.namespace("admin", function() {
  //     this.root({to: "admin#home"}); // => GET /admin
  //     this.get("control_panel", "admin#control_panel"); // GET /admin/control_panel
  //   });
});
```

**NOTE:** The `resources` has not yet been implemented and `namespace` has not
been fully tested so may not function properly with views/controllers.

Finally we'll check the view that is rendered at `app/views/pages/home.jade`:

```jade
extends ../layouts/application

block body
  div
    h1 Hello, #{name}
```

This view extends the base application layout and simply outputs a `div` with
an `h1` inside of it.

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
