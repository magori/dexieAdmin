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
            }
          }
        });
      });
    }
  }]);

  return DbManagerController;
}();