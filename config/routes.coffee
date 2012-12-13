RouteManager = require "../utils/route_manager"

RouteManager.init_routes ->

  @resource "posts"
  @resource "comments"
  @match "/admin", to: "admin_controller#show_controls", via: @read