export class DbManagerController {
  constructor($scope, $log, $uibModal, $timeout, dbManagerService) {
    'ngInject';

    this.$timeout = $timeout;
    this.$log = $log;
    this.$scope = $scope;
    this.$uibModal = $uibModal
    this.dbManager = dbManagerService;
    this.tables = this.dbManager.getTables();
    this.selectedTable = this.tables[0];
    this.selectedTableIndex = 0;
    this.dbManager.onRefresh(() => {
      this.tables = this.dbManager.getTables();
      this.displayData(this.selectedTableIndex);
    });
    this.toDelete = {};
  }

  animate($event, classCss, promise) {
    $event.stopPropagation()
    let element = angular.element($event.target);
    var i = element.find("i");
    if (i.length) {
      element = i;
    }
    element.addClass(classCss + " animated");
    promise.then(() => this.$timeout(() => element.removeClass(classCss + " animated")));
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

  hasDelete(table) {
    return this.dbManager.hasDelete(table);
  }

  createDb() {
    return this.dbManager.createDb();
  }

  reolveIdsToDelete(){
    var ids = [];
    if(this.toDelete){
      Object.keys(this.toDelete).forEach((id) => {
        if(this.toDelete[id]){
          ids.push(id*1);
        }
      });
    }
    return ids;
  }

  nbDataToDelete(){
    return this.reolveIdsToDelete().length;
  }

  deleteSelected($event) {
    var ids = this.reolveIdsToDelete();
    this.animate($event, 'faa-flash', this.dbManager.delete(this.selectedTable, ids));
  }

  deleteAllDb($event) {
    this.animate($event, 'faa-flash', this.dbManager.deleteAllTable());
  }

  delete($event, table) {
    this.animate($event, 'faa-flash', this.dbManager.delete(table));
  }

  forceDelete($event, table) {
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

  checkAll(){
    this.dataTable.forEach((data)=>this.toDelete[data[this.dbManager.primaryKeyName(this.selectedTable)]]= this.checkAllForDelete)
  }

  addOrRmoveToDelete($event, id){
      $event.stopPropagation()
  }

  displayData(index) {
    this.checkAllForDelete = false;
    this.toDelete = {};
    this.selectedTableIndex = index;
    this.selectedTable = this.tables[index];
    this.columns = this.dbManager.resolveColumns(this.selectedTable);
    this.dbManager.buildData(this.selectedTable).then((list) => this.dataTable = list).then(()=>this.$scope.$digest());
  }

  displayRow(data) {
    var self = this;
    this.$log.log(data);
    this.$uibModal.open({

      controller: ['$scope', 'json','$uibModalInstance','$timeout', ($scope, json, $uibModalInstance, $timeout) => {

        delete json.$$hashKey;
        $scope.obj = {data: json};

        $scope.editorLoaded = function(jsonEditor){
              jsonEditor.set(json);
              $timeout(()=>{jsonEditor.expandAll();},150)
        };
        $scope.options = {
          "mode": "tree",
          "modes": [
            "tree",
            "text"
          ],
          "history": true
        };

        $scope.del = () => {
          this.dbManager.deleteObject(this.selectedTable, $scope.obj.data).then(()=>{
            self.displayData(self.selectedTableIndex);
            $uibModalInstance.close($scope.obj.data);
          });

        };
        $scope.save =  () => {
          self.selectedTable.put($scope.obj.data).then(()=>{
            self.displayData(self.selectedTableIndex);
            $uibModalInstance.close($scope.obj.data);
          });
        };
        $scope.cancel = () => {
          $uibModalInstance.dismiss('cancel');
        };
      }],
      templateUrl: 'displayJson.html',
      controllerAs: 'jsonCtrl',
      size: 'lg',
      resolve: {
        json: () => data //JSON.stringify(data, (k, v) => (k != '$$hashKey') ? v : undefined, 2).replace(/\{/g, "").replace(/\}/g, "").replace(/\s\s+\n/g, "")
      }
    });
  }
}
