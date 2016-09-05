(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DbManagerController = exports.DbManagerController = function () {
  DbManagerController.$inject = ["$scope", "$log", "$uibModal", "$timeout", "dbManagerService"];
  function DbManagerController($scope, $log, $uibModal, $timeout, dbManagerService) {
    'ngInject';

    var _this = this;

    _classCallCheck(this, DbManagerController);

    this.$timeout = $timeout;
    this.$log = $log;
    this.$scope = $scope;
    this.$uibModal = $uibModal;
    this.dbManager = dbManagerService;
    this.tables = this.dbManager.getTables();
    this.selectedTable = this.tables[0];
    this.selectedTableIndex = 0;
    this.dbManager.onRefresh(function () {
      _this.tables = _this.dbManager.getTables();
      _this.displayData(_this.selectedTableIndex);
    });
    this.toDelete = {};
  }

  _createClass(DbManagerController, [{
    key: "animate",
    value: function animate($event, classCss, promise) {
      var _this2 = this;

      $event.stopPropagation();
      var element = angular.element($event.target);
      var i = element.find("i");
      if (i.length) {
        element = i;
      }
      element.addClass(classCss + " animated");
      promise.then(function () {
        return _this2.$timeout(function () {
          return element.removeClass(classCss + " animated");
        });
      });
    }
  }, {
    key: "loadAll",
    value: function loadAll($event) {
      this.animate($event, 'fa-spin', this.dbManager.loadAll());
    }
  }, {
    key: "load",
    value: function load($event, table) {
      this.animate($event, 'fa-spin', this.dbManager.load(table));
    }
  }, {
    key: "add",
    value: function add(table, objet) {
      this.animate($event, 'faa-flash', this.dbManager.add(table, objet));
    }
  }, {
    key: "hasActionLoad",
    value: function hasActionLoad(table) {
      return this.dbManager.hasActionLoad(table);
    }
  }, {
    key: "hasDelete",
    value: function hasDelete(table) {
      return this.dbManager.hasDelete(table);
    }
  }, {
    key: "createDb",
    value: function createDb() {
      return this.dbManager.createDb();
    }
  }, {
    key: "reolveIdsToDelete",
    value: function reolveIdsToDelete() {
      var _this3 = this;

      var ids = [];
      if (this.toDelete) {
        Object.keys(this.toDelete).forEach(function (id) {
          if (_this3.toDelete[id]) {
            ids.push(id * 1);
          }
        });
      }
      return ids;
    }
  }, {
    key: "nbDataToDelete",
    value: function nbDataToDelete() {
      return this.reolveIdsToDelete().length;
    }
  }, {
    key: "deleteSelected",
    value: function deleteSelected($event) {
      var ids = this.reolveIdsToDelete();
      this.animate($event, 'faa-flash', this.dbManager.delete(this.selectedTable, ids));
    }
  }, {
    key: "deleteAllDb",
    value: function deleteAllDb($event) {
      this.animate($event, 'faa-flash', this.dbManager.deleteAllTable());
    }
  }, {
    key: "delete",
    value: function _delete($event, table) {
      this.animate($event, 'faa-flash', this.dbManager.delete(table));
    }
  }, {
    key: "forceDelete",
    value: function forceDelete($event, table) {
      this.animate($event, 'faa-flash', this.dbManager.delete(table));
    }
  }, {
    key: "drop",
    value: function drop($event) {
      this.animate($event, 'faa-flash', this.dbManager.drop());
    }
  }, {
    key: "dump",
    value: function dump($event) {
      this.animate($event, 'faa-flash', this.dbManager.dump());
    }
  }, {
    key: "save",
    value: function save($event, table) {
      this.animate($event, 'faa-flash', this.dbManager.dumpTable(table));
    }
  }, {
    key: "search",
    value: function search(textSearch) {
      var _this4 = this;

      this.dbManager.search(textSearch, this.selectedTable).then(function (result) {
        _this4.dataTable = result;
        _this4.$scope.$digest();
      });
    }
  }, {
    key: "checkAll",
    value: function checkAll() {
      var _this5 = this;

      this.dataTable.forEach(function (data) {
        return _this5.toDelete[data[_this5.dbManager.primaryKeyName(_this5.selectedTable)]] = _this5.checkAllForDelete;
      });
    }
  }, {
    key: "addOrRmoveToDelete",
    value: function addOrRmoveToDelete($event, id) {
      $event.stopPropagation();
    }
  }, {
    key: "displayData",
    value: function displayData(index) {
      var _this6 = this;

      this.checkAllForDelete = false;
      this.toDelete = {};
      this.selectedTableIndex = index;
      this.selectedTable = this.tables[index];
      this.columns = this.dbManager.resolveColumns(this.selectedTable);
      this.dbManager.buildData(this.selectedTable).then(function (list) {
        return _this6.dataTable = list;
      }).then(function () {
        return _this6.$scope.$digest();
      });
    }
  }, {
    key: "addNewData",
    value: function addNewData() {
      this.displayRow({}, true);
    }
  }, {
    key: "displayRow",
    value: function displayRow(id, isNewValue) {
      var _this7 = this;

      this.selectedTable.get(id).then(function (data) {
        var self = _this7;
        if (!isNewValue) {
          _this7.$log.log(data);
        }
        var tempalte = "displayJson.html";

        var displaySimple = false;
        console.log(_this7.dbManager.displayEditConfig(_this7.selectedTable.name));
        if ('simple' == _this7.dbManager.displayEditConfig(_this7.selectedTable.name)) {
          displaySimple = true;
          tempalte = "displayJsonSimple.html";
        }
        _this7.$uibModal.open({
          controller: ['$scope', 'objetData', '$uibModalInstance', '$timeout', function ($scope, objetData, $uibModalInstance, $timeout) {
            var json = objetData;
            delete json.$$hashKey;
            if (displaySimple) {
              json = angular.toJson(objetData, true);
            } else {
              $scope.editorLoaded = function (jsonEditor) {
                jsonEditor.set(objetData);
                if (!isNewValue) {
                  $timeout(function () {
                    jsonEditor.expandAll();
                  }, 150);
                }
              };
              $scope.options = {
                "mode": isNewValue ? 'text' : "tree",
                "modes": ["tree", "text"],
                "history": true
              };
            }

            $scope.obj = { data: json, dispalyDelete: !isNewValue };

            $scope.del = function () {
              _this7.dbManager.deleteObject(_this7.selectedTable, objetData).then(function () {
                self.displayData(self.selectedTableIndex);
                $uibModalInstance.close($scope.obj.data);
              });
            };
            $scope.save = function () {
              $scope.error = null;
              var objet = $scope.obj.data;
              if (displaySimple) {
                try {
                  objet = angular.fromJson(objet);
                } catch (e) {
                  $scope.error = e;
                }
              }
              if (!$scope.error) {
                _this7.dbManager.save(self.selectedTable, objet).then(function () {
                  self.displayData(self.selectedTableIndex);
                  $uibModalInstance.close($scope.obj.data);
                });
              }
            };
            $scope.cancel = function () {
              $uibModalInstance.dismiss('cancel');
            };
          }],
          templateUrl: tempalte,
          controllerAs: 'jsonCtrl',
          size: 'lg',
          resolve: {
            objetData: function objetData() {
              return data;
            } //JSON.stringify(data, (k, v) => (k != '$$hashKey') ? v : undefined, 2).replace(/\{/g, "").replace(/\}/g, "").replace(/\s\s+\n/g, "")
          }
        });
      });
    }
  }]);

  return DbManagerController;
}();
},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NgDexieAdminDirective = NgDexieAdminDirective;

var _dbManager = require('./dbManager.controller');

function NgDexieAdminDirective() {
  'ngInject';

  var directive = {
    restrict: 'E',
    template: '<script type="text/ng-template" id="displayJson.html"><div class="modal-body"> <div ng-jsoneditor="editorLoaded" ng-model="obj.data" options="options" style="height: 70vh;"></div> </div> <div class="modal-footer"> <button ng-if="obj.dispalyDelete" class="btn btn-danger" type="button" ng-click="del()">Delete</button> <button class="btn btn-primary" type="button" ng-click="save()">Save</button> <button class="btn btn-warning" type="button" ng-click="cancel()">Cancel</button> </div></script><script type="text/ng-template" id="displayJsonSimple.html"><div ng-show="error!=null" class="alert alert-danger fade in"> <a ng-click="error=null"class="close" data-dismiss="alert">&times;</a> {{error.message}} </div> <div class="modal-body"> <textarea ng-model="obj.data" style="height: 70vh;" class="form-control"></textarea> </div> <div class="modal-footer"> <button ng-if="obj.dispalyDelete" class="btn btn-danger" type="button" ng-click="del()">Delete</button> <button class="btn btn-primary" type="button" ng-click="save()">Save</button> <button class="btn btn-warning" type="button" ng-click="cancel()">Cancel</button> </div></script><div class="row"><div class="col-xs-3"><div class="panel panel-default"><div class="panel-heading clearfix"><div class="btn-toolbar" role="toolbar"><div class="pull-left panel-title"><span class="badge">{{ dbManger.tables.length}}</span></div><div class="btn-group pull-right"><div ng-click="dbManger.dump($event)" class="btn btn-default" title="Dump"><i class="fa fa-floppy-o" aria-hidden="true"></i></div><div ng-click="dbManger.loadAll($event)" class="btn btn-default" title="Load all"><i class="fa fa-refresh" aria-hidden="true"></i></div><div ng-click="dbManger.deleteAllDb($event)" class="btn btn-default" title="Empty DB"><i class="fa fa-trash-o" aria-hidden="true"></i></div><div ng-click="dbManger.drop($event)" class="btn btn-danger" title="Drop"><i class="fa fa-trash-o" aria-hidden="true"></i></div></div></div></div><div class="list-group" ng-repeat="(index,table) in dbManger.tables track by table.name" ng-click="dbManger.displayData(index)"><div class="list-group-item" ng-class="dbManger.selectedTable.name===table.name ? \'active\':\'\'" style="cursor:pointer"><div class="list-group-item-heading clearfix"><div class="pull-left panel-title"><span class="badge">{{table.nbRow}}</span> <span class="panel-title" style="padding-top: 7.5px;">{{table.name}}</span></div><div class="btn-group pull-right"><div ng-if="dbManger.hasActionLoad(table)" ng-click="dbManger.load($event,table)" class="btn btn-default" title="Load table"><i class="fa fa-refresh" aria-hidden="true"></i></div><div ng-click="dbManger.save($event, table)" class="btn btn-default" title="Dump table"><i class="fa fa-floppy-o" fa-stack-1x aria-hidden="true"></i></div><div ng-if="dbManger.hasDelete(table)" ng-click="dbManger.delete($event, table)" class="btn btn-default" title="Clear table"><i class="fa fa-trash-o" fa-stack-1x aria-hidden="true"></i></div><div ng-if="!dbManger.hasDelete(table)" ng-click="dbManger.forceDelete($event, table)" class="btn btn-danger" title="Force clear table"><i class="fa fa-trash-o" fa-stack-1x aria-hidden="true"></i></div></div></div><p class="list-group-item-text"><i class="fa fa-key" aria-hidden="true"></i> {{table.schema.primKey.name}} : {{table.schema.primKey.auto}}</p><p class="list-group-item-text"></p>index: <span ng-repeat="indexe in table.schema.indexes">{{indexe.src}},</span><p></p></div></div></div></div><div class="col-xs-9"><div class="panel panel-default"><div class="panel-heading clearfix">{{dbManger.selectedTable.name}}<div class="pull-right"><div ng-style="dbManger.nbDataToDelete()?{opacity:100}:{opacity:0}" ng-click="dbManger.deleteSelected($event, table)" class="btn btn-default" title="Delete selected data">{{dbManger.nbDataToDelete()}} <i class="fa fa-trash-o" fa-stack-1x aria-hidden="true"></i></div><div ng-click="dbManger.addNewData($event, table)" class="btn btn-default" title="Add nes data"><i class="fa fa-plus-circle" aria-hidden="true"></i></div></div></div><div class="panel-body"><form><div class="row"><div class="form-group col-xs-12"><div class="input-group input-group"><span class="input-group-addon"><i class="fa fa-search" aria-hidden="true"></i></span> <input type="text" class="form-control" ng-change="dbManger.search(dbManger.searchValue)" ng-model-options="{ debounce: 250 }" ng-model="dbManger.searchValue"> <span class="input-group-addon"><span class="badge">{{dbManger.dataTable.length}}</span></span></div></div></div></form><div style="height: 70vh !important;overflow-y: auto;"><table class="table table-striped table-condensed"><colgroup><col class="del"><col class="{{::dbManger.selectedTable.schema.primKey.name}}"><col ng-repeat="indexe in dbManger.selectedTable.schema.indexes" class="{{::indexe.name}}"></colgroup><thead><tr><th><input type="checkbox" name="del" ng-click="dbManger.checkAll()" ng-model="dbManger.checkAllForDelete"></th><th><i class="fa fa-key" aria-hidden="true"></i>PK</th><th ng-repeat="indexe in dbManger.columns">{{::indexe}}</th></tr></thead><tbody><tr ng-repeat="data in dbManger.dataTable | limitTo:150" ng-click="dbManger.displayRow(data[dbManger.selectedTable.schema.primKey.name])"><td><input type="checkbox" ng-click="$event.stopPropagation()" ng-model="dbManger.toDelete[data[dbManger.selectedTable.schema.primKey.name]]" name="del" d></td><td>{{data[dbManger.selectedTable.schema.primKey.name]}}</td><td ng-repeat="indexe in dbManger.columns">{{data[indexe]}}</td></tr></tbody></table></div></div></div></div></div>',
    controller: _dbManager.DbManagerController,
    controllerAs: 'dbManger',
    bindToController: true
  };

  return directive;
}
},{"./dbManager.controller":1}],3:[function(require,module,exports){
'use strict';

var _dbManager = require('./service/dbManager.service');

var _ngDexieAdmin = require('./dbManager/ngDexieAdmin.directive');

angular.module('ng.dexieadmin', ['ui.bootstrap', 'ng.jsoneditor']).service('dbManagerService', _dbManager.DbManagerService).directive('ngDexieAdmin', _ngDexieAdmin.NgDexieAdminDirective);
},{"./dbManager/ngDexieAdmin.directive":2,"./service/dbManager.service":5}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DbDump = function () {
    function DbDump() {
        'ngInject';

        _classCallCheck(this, DbDump);

        this.rn = "\r\n";
    }

    _createClass(DbDump, [{
        key: "config",
        value: function config(_config) {
            if (_config) {
                this.db = _config.db;
                this.dbName = this.db.name + "";
                this.tables = this.db.tables;
                this.tableDef = this.createTblesDef();
            }
        }
    }, {
        key: "dumpTable",
        value: function dumpTable(table) {
            var _this = this;

            return table.toArray(function (list) {
                var rn = _this.rn;
                var objects = JSON.stringify(list);
                return rn + "//-" + table.name + rn + " db." + table.name + ".bulkPut(" + objects + ")";
            });
        }
    }, {
        key: "createTblesDef",
        value: function createTblesDef() {
            var defTables = {};
            this.db.tables.map(function (table) {
                var primKeyAndIndexes = [table.schema.primKey].concat(table.schema.indexes);
                var schemaSyntax = primKeyAndIndexes.map(function (index) {
                    return index.src;
                }).join(',');
                defTables[table.name] = schemaSyntax;
            });
            return defTables;
        }
    }, {
        key: "dump",
        value: function dump() {
            var _this2 = this;

            var db = this.db,
                self = this,
                rn = this.rn;
            var promise = new Promise(function (resolve) {
                db.open().then(function () {
                    var dump = "var db = new Dexie('" + db.name + "') " + rn + " db.version(" + db.verno + ").stores({ " + rn;
                    var defs = self.createTblesDef();
                    dump = dump + Object.keys(defs).map(function (key) {
                        var schemaSyntax = defs[key];
                        return "  " + key + ": '" + schemaSyntax + "'";
                    }).join("," + rn);
                    return "" + rn + dump + "});" + rn;
                }).then(function (dump) {
                    var p = db.tables.map(function (table) {
                        return self.dumpTable(table);
                    });
                    Promise.all(p).then(function (dumpDataTable) {
                        resolve(dump + "//#### Datas #####" + _this2.rn + dumpDataTable.join(";") + ";");
                    });
                    return dump;
                }).finally(function () {
                    //db.close();
                });
            });
            return promise;
        }
    }]);

    return DbDump;
}();

exports.DbDump = DbDump;
},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DbManagerService = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* global Pormise:false*/


var _dbDumpService = require('./dbDump.service.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DbManagerService = function () {
  DbManagerService.$inject = ["ngDexieAdminConfig"];
  function DbManagerService(ngDexieAdminConfig) {
    'ngInject';

    _classCallCheck(this, DbManagerService);

    this.config(ngDexieAdminConfig);
    this.previsouSearch = "";
    this.countTupleForEachTable();
  }

  _createClass(DbManagerService, [{
    key: 'config',
    value: function config(_config) {
      this.config = _config;
      this.db = _config.getDb();
      this.tables = this.orderTables(this.db.tables);
      this.dbDump = new _dbDumpService.DbDump();
      this.dbDump.config({
        db: this.db
      });
      var actionsLoad = this.resolveConfigType('load');
      this.actionsLoad = actionsLoad;
      this.context = _config.context;
      this.onNewDb = _config.onNewDb();
    }
  }, {
    key: 'getTables',
    value: function getTables() {
      return this.tables;
    }
  }, {
    key: 'orderTables',
    value: function orderTables(tables) {
      var confOrder = this.resolveConfigType('order');
      var tableOrder = [];
      for (var key in confOrder) {
        tableOrder.push({ name: key, order: confOrder[key] });
      }
      tableOrder.sort(function (a, b) {
        return b.order - a.order;
      });
      tableOrder.map(function (order) {
        var index = tables.findIndex(function (t) {
          return t.name == order.name;
        });
        var table = tables.splice(index, 1)[0];
        tables.unshift(table);
      });
      return tables;
    }
  }, {
    key: 'columnsToDisplay',
    value: function columnsToDisplay(tableName) {
      return this.resolveConfigType('columns')[tableName];
    }
  }, {
    key: 'displayEditConfig',
    value: function displayEditConfig(tableName) {
      var conf = this.resolveConfigType('displayEdit');
      if (conf) {
        return conf[tableName];
      }
      return null;
    }
  }, {
    key: 'resolveColumns',
    value: function resolveColumns(table) {
      var columns = this.columnsToDisplay(table.name);
      if (!columns) {
        columns = {};
      }
      table.schema.indexes.forEach(function (indexe) {
        if (columns[indexe.name] === undefined) {
          columns[indexe.name] = true;
        }
      });
      var columnsToDisplay = [];
      columnsToDisplay = Object.keys(columns).filter(function (key) {
        var conf = columns[key];
        if (conf === false) {
          return false;
        }
        return true;
      });
      return columnsToDisplay;
    }
  }, {
    key: 'buildData',
    value: function buildData(table) {
      var selectedTableIndexes = this.resolveColumns(table);
      var dottedIndexes = selectedTableIndexes.filter(function (inedex) {
        return inedex.includes(".");
      });
      var indexes = [];
      dottedIndexes.forEach(function (indexe) {
        indexes.push({
          key: indexe,
          value: indexe.split('.')
        });
      });
      return table.toArray().then(function (list) {
        list.map(function (data) {
          indexes.forEach(function (indexe) {
            var key = indexe.key;
            var value = indexe.value;

            data[key] = value.reduce(function (obj, key) {
              return obj[key] ? obj[key] : '';
            }, data);
          });
          return data;
        });
        return list;
      }).then(function (list) {
        return list;
      });
    }
  }, {
    key: 'resolveConfigType',
    value: function resolveConfigType(type) {
      var _this = this;

      var config = {};
      Object.keys(this.config.tablesConfig()).forEach(function (table) {
        var tableConfig = _this.config.tablesConfig()[table];
        if (tableConfig && tableConfig[type] != undefined) {
          config[table] = tableConfig[type];
        }
      });
      return config;
    }
  }, {
    key: 'onRefresh',
    value: function onRefresh(call) {
      this.onRefresh = call;
    }
  }, {
    key: 'hasActionLoad',
    value: function hasActionLoad(table) {
      return this.resolveActionLoad(table);
    }
  }, {
    key: 'hasDelete',
    value: function hasDelete(table) {
      var trashConfig = this.resolveConfigType('noDelete');
      if (trashConfig[table.name] === false || trashConfig[table.name] === undefined) {
        return true;
      }
      return false;
    }
  }, {
    key: 'resolveActionLoad',
    value: function resolveActionLoad(table) {
      return this.actionsLoad[table.name];
    }
  }, {
    key: 'deleteAllTable',
    value: function deleteAllTable() {
      var _this2 = this;

      return Promise.all(this.tables.map(function (table) {
        return _this2.hasDelete(table) ? _this2.delete(table) : false;
      }));
    }
  }, {
    key: 'add',
    value: function add(table, objet) {
      return table.put(objet);
    }
  }, {
    key: 'save',
    value: function save(table, objet) {
      return table.put(objet);
    }
  }, {
    key: 'deleteObject',
    value: function deleteObject(table, object) {
      var pk = this.primaryKeyName(table);
      return table.delete(object[pk]);
    }
  }, {
    key: 'delete',
    value: function _delete(table, ids) {
      var _this3 = this;

      var promise = new Promise(function () {});
      if (table && !ids) {
        promise = table.clear();
      } else if (table && ids) {
        promise = table.bulkDelete(ids);
      }
      return promise.then(function () {
        return _this3.countTupleTable(table);
      }).then(function () {
        return _this3.onRefresh();
      });
    }
  }, {
    key: 'loadAll',
    value: function loadAll() {
      var _this4 = this;

      return Promise.all(this.tables.map(function (table) {
        return _this4.load(table);
      }));
    }
  }, {
    key: 'load',
    value: function load(table) {
      var _this5 = this;

      var action = this.resolveActionLoad(table);
      if (action) {
        var promise = this.context ? action.call(this.context) : action(),
            self = this;
        if (promise && promise.then) {
          return promise.then(function () {
            return self.countTupleTable(table);
          }).then(function () {
            return _this5.onRefresh();
          });
        } else {
          return new Pormise(function () {
            _this5.countTupleTable(table);
            _this5.onRefresh();
          });
        }
      }
    }
  }, {
    key: 'createDb',
    value: function createDb() {
      var db = new Dexie(this.dbDump.dbName + "ddd");
      db.version(1).stores(this.dbDump.tableDef);
      return db;
    }
  }, {
    key: 'drop',
    value: function drop() {
      var _this6 = this;

      return this.db.delete().then(function () {
        return _this6.createDb();
      }).then(function (db) {
        db.open().then(function () {
          _this6.db = db;
          _this6.tables = db.tables;
          if (_this6.onNewDb) {
            _this6.onNewDb(_this6.db);
          }
          _this6.dbDump.config({
            db: db
          });
          _this6.countTupleForEachTable();
        });
      });
    }
  }, {
    key: 'dump',
    value: function dump() {
      var _this7 = this;

      return this.dbDump.dump().then(function (dump) {
        return _this7.createFileAndDowload(dump);
      });
    }
  }, {
    key: 'dumpTable',
    value: function dumpTable(talbe) {
      var _this8 = this;

      return this.dbDump.dumpTable(talbe).then(function (dump) {
        return _this8.createFileAndDowload(dump);
      });
    }
  }, {
    key: 'countTupleForEachTable',
    value: function countTupleForEachTable() {
      var _this9 = this;

      var i = 0;
      var size = this.tables.length;
      var f = function f() {
        if (i < size) {
          _this9.countTupleTable(_this9.tables[i]).then(function () {
            i++;
            f();
          });
        } else {
          _this9.onRefresh();
        }
      };
      f();
    }
  }, {
    key: 'countTupleTable',
    value: function countTupleTable(table) {
      return table.count().then(function (nb) {
        table.nbRow = nb;
      });
    }
  }, {
    key: 'primaryKeyName',
    value: function primaryKeyName(table) {
      return table.schema.primKey.name;
    }
  }, {
    key: 'search',
    value: function search(textSearch, table) {
      var _this10 = this;

      var search = textSearch.toUpperCase();
      if (search.indexOf(":") == 0) {
        var _ret = function () {
          var t = search.substr(1).split("=");
          if (t.length > 1) {
            var _ret2 = function () {
              var key = t[0].trim().toLowerCase();
              return {
                v: {
                  v: _this10.buildData(table).then(function (list) {
                    if (list[0][key]) {
                      list = list.filter(function (v) {
                        var value = v[key];
                        if (!isNaN(parseFloat(value)) && isFinite(value)) {
                          return value == t[1] * 1;
                        } else {
                          return value.toUpperCase().includes(t[1]);
                        }
                      });
                    }
                    return list;
                  })
                }
              };
            }();

            if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
          }
          return {
            v: new Promise(function () {})
          };
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
      } else {
        return this.buildData(table).then(function (list) {
          list = list.map(function (v) {
            v.valstring = _this10.valuesToString(v);
            return v;
          }).filter(function (v) {
            return v.valstring.includes(search);
          });
          return list;
        });
      }
    }
  }, {
    key: 'createFileAndDowload',
    value: function createFileAndDowload(text) {
      var data = new Blob([text], {
        type: 'text/plain'
      });
      var url = window.URL.createObjectURL(data);
      var a = document.createElement('a');
      a.style.display = "none";
      a.href = url;
      a.download = "dump_" + new Date().getTime() + ".txt";
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 50);
    }
  }, {
    key: 'valuesToString',
    value: function valuesToString(obj) {
      var values = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          var val = obj[key];
          if (val instanceof Object) {
            values = values + this.valuesToString(val);
          } else {
            values = values + ' ' + obj[key];
          }
        }
      }
      return values.toUpperCase();
    }
  }]);

  return DbManagerService;
}();

exports.DbManagerService = DbManagerService;
},{"./dbDump.service.js":4}]},{},[3]);
