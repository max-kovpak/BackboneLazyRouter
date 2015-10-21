define(function () {
    var Router = function (options) {
        options || (options = {});
        if (options.routes) this.routes = options.routes;

        this._bindRoutes();
        this.initialize.apply(this, arguments);
    };

    _.extend(Router.prototype, Backbone.Events, {
        initialize: function () {
        },
        routes: {},
        router: null,

        navigate: function (fragment, options) {
            Backbone.history.navigate(fragment, options);
            return this;
        },

        _bindRoutes: function () {
            var router = this;
            var routes = {};
            _.forEach(this.routes, function (controller, route) {
                routes[route] = this._processController(controller);
            }, this);

            this.router = new Backbone.Router({
                routes: routes
            });
        },

        _processController: function (controller) {
            var result = null;
            var self = this;
            if (typeof controller == 'function') {
                result = function () {
                    self.trigger('preAction');
                    controller.apply(controller, arguments);
                    self.trigger('postAction');
                };
            } else {
                if (typeof self[controller] == 'function') {
                    result = function () {
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

                    result = function () {
                        var args = arguments;
                        require([
                            controller
                        ], function (controller) {
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

            return result;
        },

        route: function (route, name, callback) {
            if (!_.isRegExp(route)) route = this._routeToRegExp(route);
            if (typeof callback == 'undefined') {
                callback = name;
                this.router.route(route, this._processController(callback));
            } else {
                this.router.route(route, name, this._processController(callback));
            }

            return this;
        },

        _routeToRegExp: Backbone.Router.prototype._routeToRegExp
    });

    Router.extend = Backbone.History.extend;
    return Router;
});
