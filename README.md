# ngDexieAdmin
A administration interface for [dexie](http://dexie.org). 
You can read, delete, dump, and search data in tables.
The interface is made with [Bootstrap 3](http://getbootstrap.com/), [UI Bootstrap](https://angular-ui.github.io/bootstrap) and [fontawesome](http://fontawesome.io)

Requirements
----------------
The module doesn't include dexie and other librarys, but it is included in it's bower dependencies.

Installation
------------

Install via bower

    bower install ng-dexie-admin --save

#### Initialize
```javascript
// require module in your app:
var app = angular.module('exampleApp', ['ngDexieAdmin'])
          .service('ngDexieAdminConfig', function () {
            var db = new Dexie("MyDatabases");
                 db.version(1).stores({
                  friends: "++id, name, age, isCloseFriend, contact.phone ",
                  notes: "++id, title, date, *items",
                  noLoadAction: "++id"
                });
            return {
              getDb : function () {
                return db;
              },
            }
          });
```    

Then include the directive, bootstrap, ui-bootstrap and fontawsome in your html (you can also use the minified versions)
    
```html
  <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.css" />
  <link rel="stylesheet" href="bower_components/font-awesome/css/font-awesome.css" />
  <link rel="stylesheet" href="bower_components/font-awesome-animation/dist/font-awesome-animation.css" />
  ....
  <script src="bower_components/dexie/dist/dexie.min.js"></script> 
  <script src="bower_components/ng-dexie-admin/dist/ngDexieAdmin.js"></script>
  <script src="bower_components/angular-bootstrap/ui-bootstrap-tpls.js"></script>
```

