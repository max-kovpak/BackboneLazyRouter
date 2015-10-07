# BackboneLazyRouter
Backbone Lazy Router with require.js

```javascript
var router = new Router({
    routes: {
        '(/)': 'controllers/default', //by default it call "index" action
        'login(/)': 'controllers/security@login',
    }
});
```
