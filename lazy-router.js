define(function() {
    var Router = function(options) {
        options || (options = {});
        if (options.routes) this.routes = options.routes;
        
        this._bindRoutes();
        this.initialize.apply(this, arguments);
    };

    _.extend(Router.prototype, Backbone.Events, {
        initialize: function(){},

        routes: {},
        router: null,

        _bindRoutes: function() {
            var routes = {};
            _.forEach(this.routes, function(controller, route) {
                var action = 'index';
                if(controller.match('@')) {
                    var arr = controller.split('@');
                    controller = arr[0];
                    action = arr[1];
                }

                routes[route] = function() {
                    require([
                        controller
                    ], function(controller) {
                        controller[action].apply(controller, arguments);
                    });
                }
            }, this);

            this.router = new Backbone.Router({
                routes: routes
            });
        },

        extend: Backbone.History.extend
    });

    return Router;
});
