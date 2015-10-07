# BackboneLazyRouter
Backbone Lazy Router with require.js

main.js
```javascript
require([
    'lazy-router.js'
], function(LazyRouter) {
    var Router = LazyRouter.extend({
        routes: {
            '(/)': 'controllers/default', //by default it call "index" action or controller may be a function
            'auth/login': 'controllers/security@login',
            'auth/logout': 'controllers/security@logout',
            'blog': function() { 
                //do some magic..
            },
            'blog/:slug': 'blogPost'
        },
        
        blogPost: function(slug) {} //native router style
    });
});

var router = new Router();

router.on('preAction', function() {
    //do something before action
});

router.on('postAction', function() {
    //do something after action
});

Backbone.history.start();
```
controllers/default.js
```javascript
define(function() {
    return {
        index: function() { }
    }
});

//or
define(function() {
    return function() { }
});
```
controllers/security.js
```javascript
define(function() {
    return {
        login: function() { },
        logout: function() { }
    }
});
```
