export class DbManagerController {
  constructor($scope, $log, $uibModal, $timeout, dbManagerService) {
    'ngInject';

    this.$timeout = $timeout;
    this.$log = $log;
    this.$scope = $scope;
    this.$uibModal = $uibModal
    this.dbManager = dbManagerService;
    this.dbManager.onRefresh(() => {
      this.tables = this.dbManager.getDb().tables;
      this.displayData(this.selectedTable);
    });
    this.tables = this.dbManager.getDb().tables
    this.displayData(this.tables[0]);
    this.columns = this.resolveColumns(this.tables[0]);
  }

  resolveColumns(table) {
    var columns = this.dbManager.columnsToDisplay(table.name);
    if(!columns){
      columns = {}
    }
    table.schema.indexes.forEach((indexe) => {
      if(columns[indexe.name] === undefined){
        columns[indexe.name] = true;
      }
    })
    var columnsToDisplay = [];
    columnsToDisplay = Object.keys(columns).filter((key)=>{
      let conf = columns[key];
      if(conf === false) {
        return false;
      }
      return true;
    });
    return columnsToDisplay;
  }

  animate($event, classCss, promise) {
    $event.stopPropagation()
    let element = angular.element($event.target);
    var i = element.find("i");
    if (i.length) {
      element = i;
    }
    element.addClass(classCss + " animated");
    promise.then(()=>this.$scope.$digest())
    .then(() => this.$timeout(() => element.removeClass(classCss + " animated")));
  }

  loadAll($event) {
    this.animate($event, 'fa-spin', this.dbManager.loadAll());
  }

  load($event, table) {
    this.animate($event, 'fa-spin', this.dbManager.load(table));
  }

  hasActionLoad(table) {
    return this.dbManager.hasActionLoad(table);
  }

  hasTrash(table) {
    return this.dbManager.hasTrash(table);
  }

  createDb() {
    return this.dbManager.createDb();
  }

  deleteAllDb($event) {
    this.animate($event, 'faa-flash', this.dbManager.deleteAllTable());
  }

  delete($event, table) {
    this.animate($event, 'faa-flash', this.dbManager.delete(table));
  }

  drop($event) {
    this.animate($event, 'faa-flash', this.dbManager.drop());
  }

  dump($event) {
    this.animate($event, 'faa-flash', this.dbManager.dump());
  }

  save($event, table) {
    this.animate($event, 'faa-flash', this.dbManager.dumpTable(table));
  }

  search(textSearch) {
    this.dbManager.search(textSearch, this.selectedTable).then((result) => {
      this.dataTable = result;
      this.$scope.$digest()
    });
  }

  displayData(table) {
    this.selectedTable = table;
    this.selectedTableIndexes = this.resolveColumns(table);
    var dottedIndexes = this.selectedTableIndexes.filter((inedexe) => inedexe.includes("."))
    var indexes = [];
    dottedIndexes.forEach((indexe, i) => {
      indexes.push({
        key: indexe,
        value: indexe.split('.')
      })
    });
    table.toArray().then((list) => {
        list.map(data => {
          indexes.forEach((indexe) => {
            var {key, value} = indexe;
            data[key] = value.reduce((obj, key) => (obj[key]) ? (obj[key]) : '', data);
          })
          return data;
        })
        return list;
      })
      .then((list) => {
        this.dataTable = list
      })
      .then(() => this.$scope.$digest());
  }

  displayRow(data) {
    this.$log.log(data);
    this.$uibModal.open({
      controller: ['$scope', 'json', ($scope, json) => {
        $scope.json = json
      }],
      templateUrl: 'displayJson.html',
      controllerAs: 'json',
      size: 'lg',
      resolve: {
        json: () => JSON.stringify(data, (k, v) => (k != '$$hashKey') ? v : undefined, 2).replace(/\{/g, "").replace(/\}/g, "").replace(/\s\s+\n/g, "")
      }
    });
  }
}
