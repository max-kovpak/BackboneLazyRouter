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

        navigate: function(fragment, options) {
            Backbone.history.navigate(fragment, options);
            return this;
        },

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
                    if (typeof self[controller] == 'function') {
                        routes[route] = function() {
                            self.trigger('preAction');
                            self[controller].apply(controller, arguments);
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
                            var args = arguments;
                            require([
                                controller
                            ], function(controller) {
                                self.trigger('preAction');
                                if (typeof controller == 'function') {
                                    controller.apply(controller, args);
                                } else {
                                    controller[action].apply(controller, args);
                                }
                                self.trigger('postAction');
                            });
                        }
                    }
                }
            }, this);

            this.router = new Backbone.Router({
                routes: routes
            });
        }
    });

    Router.extend = Backbone.History.extend;

    return Router;
});
