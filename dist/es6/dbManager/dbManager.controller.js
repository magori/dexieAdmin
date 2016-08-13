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
    this.dbManager.onRefresh(function () {
      _this.tables = _this.dbManager.getDb().tables;
      _this.displayData(_this.selectedTable);
    });
    this.tables = this.dbManager.getDb().tables;
    this.displayData(this.tables[0]);
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
    key: "hasActionLoad",
    value: function hasActionLoad(table) {
      return this.dbManager.hasActionLoad(table);
    }
  }, {
    key: "hasTrash",
    value: function hasTrash(table) {
      return this.dbManager.hasTrash(table);
    }
  }, {
    key: "createDb",
    value: function createDb() {
      return this.dbManager.createDb();
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
      var _this3 = this;

      this.dbManager.search(textSearch, this.selectedTable).then(function (result) {
        _this3.dataTable = result;
        _this3.$scope.$digest();
      });
    }
  }, {
    key: "displayData",
    value: function displayData(table) {
      var _this4 = this;

      this.selectedTable = table;
      this.selectedTableIndexes = this.dbManager.resolveColumns(table);
      this.dbManager.buildData(table).then(function (list) {
        return _this4.dataTable = list;
      }).then(function () {
        return _this4.$scope.$digest();
      });
    }
  }, {
    key: "displayRow",
    value: function displayRow(data) {
      this.$log.log(data);
      this.$uibModal.open({
        controller: ['$scope', 'json', function ($scope, json) {
          $scope.json = json;
        }],
        templateUrl: 'displayJson.html',
        controllerAs: 'jsonCtrl',
        size: 'lg',
        resolve: {
          json: function json() {
            return JSON.stringify(data, function (k, v) {
              return k != '$$hashKey' ? v : undefined;
            }, 2).replace(/\{/g, "").replace(/\}/g, "").replace(/\s\s+\n/g, "");
          }
        }
      });
    }
  }]);

  return DbManagerController;
}();