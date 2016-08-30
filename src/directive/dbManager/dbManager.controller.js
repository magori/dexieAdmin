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

  add(table, objet){
    this.animate($event, 'faa-flash', this.dbManager.add(table, objet));
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

  addNewData(){
      this.displayRow({}, true)
  }

  displayRow(data, isNewValue) {
    var self = this;
    if(!isNewValue) {
      this.$log.log(data);
    }
    var tempalte = "displayJson.html";

    var displaySimple = false;
    console.log(this.dbManager.displayEditConfig(this.selectedTable.name));
      if('simple' == this.dbManager.displayEditConfig(this.selectedTable.name)){
      displaySimple = true;
      tempalte = "displayJsonSimple.html";
    }
    this.$uibModal.open({
      controller: ['$scope', 'objetData','$uibModalInstance','$timeout', ($scope, objetData, $uibModalInstance, $timeout) => {
        var json = objetData;
        delete json.$$hashKey;
        if(displaySimple){
          json = angular.toJson(objetData, true);
        } else {
          $scope.editorLoaded = function(jsonEditor){
                jsonEditor.set(objetData);
                if(!isNewValue){
                  $timeout(()=>{jsonEditor.expandAll();},150);
                }
          };
          $scope.options = {
            "mode": (isNewValue)?'text':"tree",
            "modes": [
              "tree",
              "text"
            ],
            "history": true
          };
        }

        $scope.obj = {data: json, dispalyDelete: !isNewValue};

        $scope.del = () => {
          this.dbManager.deleteObject(this.selectedTable, objetData).then(()=>{
            self.displayData(self.selectedTableIndex);
            $uibModalInstance.close($scope.obj.data);
          });
        };
        $scope.save =  () => {
          $scope.error= null;
          var objet = $scope.obj.data;
          if(displaySimple){
            try {
                  objet = angular.fromJson(objet);
                } catch (e) {
                  $scope.error = e;
                }
          }
          if(!$scope.error){
            this.dbManager.save(self.selectedTable,objet).then(()=>{
              self.displayData(self.selectedTableIndex);
              $uibModalInstance.close($scope.obj.data);
            });
          }
        };
        $scope.cancel = () => {
          $uibModalInstance.dismiss('cancel');
        };
      }],
      templateUrl: tempalte,
      controllerAs: 'jsonCtrl',
      size: 'lg',
      resolve: {
        objetData: () => data //JSON.stringify(data, (k, v) => (k != '$$hashKey') ? v : undefined, 2).replace(/\{/g, "").replace(/\}/g, "").replace(/\s\s+\n/g, "")
      }
    });
  }
}
