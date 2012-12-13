# ## RouteManager
#
# Manage the creation and set up of routes.
#
class RouteManager

  crud_map:
    create: "post"
    read: "get"
    update: "put"
    destroy: "delete"

  create: "create"
  read: "read"
  update: "update"
  destroy: "destroy"

  init_routes: (route_initializer) ->
    route_initializer.call @

  resource: (resource, options = {}) ->
    as = options.as ? null
    only = [@create, @read, @update, @destroy]
    # Handle only or except, not both. Only overrides except.
    if options.only?
      {only} = options
    else if options.except?
      only = _.filter only, (item) ->
        not (item in options.except)
    name = if as is null then resource else as
    if @create in only 
      @match "/#{name}s", to: "#{resource}#create", via: @create
      @match "/#{name}s/new", to: "#{resource}#new", via: @read
    itemUrl = "/#{name}/:#{resource}Id"
    if @read in only
      @match itemUrl, to: "#{resource}#show", via: @read
    if @update in only
      @match itemUrl, to: "#{resource}#update", via: @update
    if @delete in only
      @match itemUrl, to: "#{resource}#destroy", via: @destroy

  match: (route, options = {}) ->
    return unless options.to?
    options.via = @read unless options.via?
    {to, via} = options
    [resource, funk] = to.split "#"
    console.log "MAP: #{@crud_map[via].toUpperCase()} #{route} to the #{resource} controller's #{funk} function."

module.exports = new RouteManager