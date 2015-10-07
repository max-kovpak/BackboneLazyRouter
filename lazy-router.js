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
            var self = this;
            _.forEach(this.routes, function(controller, route) {
                if (typeof controller == 'function') {
                    routes[route] = function() {
                        self.trigger('preAction');
                        controller.apply(controller, arguments);
                        self.trigger('postAction');
                    };
                } else {
                    var action = 'index';
                    if (controller.match('@')) {
                        var arr = controller.split('@');
                        controller = arr[0];
                        action = arr[1];
                    }

                    routes[route] = function() {
                        require([
                            controller
                        ], function(controller) {
                            self.trigger('preAction');
                            if (typeof controller == 'function') {
                                controller.apply(controller, arguments);
                            } else {
                                controller[action].apply(controller, arguments);
                            }
                            self.trigger('postAction');
                        });
                    }
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
