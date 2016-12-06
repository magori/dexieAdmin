export class DbManagerController {
  constructor($scope, $log, $uibModal, $timeout, $route, dbManagerService) {
    'ngInject';

    this.$timeout = $timeout;
    this.$log = $log;
    this.$scope = $scope;
    this.$route = $route;
    this.$uibModal = $uibModal
    this.dbManager = dbManagerService;
    this.tables = this.dbManager.getTables();
    this.selectedTable = this.tables[0];
    this.selectedTableIndex = 0;
    this.dbManager.configOnRefresh(() => {
      this.tables = this.dbManager.getTables();
      this.displayData(this.selectedTableIndex);
    });
    dbManagerService.countTupleForEachTable();
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

  dumpSizeInKo() {
    if(this.fileDump){
      return Math.ceil(this.fileDump.size/1024);
    }
  }

  loadDump() {
      var reader = new FileReader();
      reader.onload = (loadEvent) => {
        this.dbManager.drop().then(()=>{
          var db;
          eval(loadEvent.target.result);
          delete this.fileDump;
          alert("Dump loaded, reload the application")
          //this.$route.reload();
        });
      }
      reader.readAsText(this.fileDump);
  }

  cancelDump(){
    delete this.fileDump
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
      this.displayModal({},true);
  }

  displayModal(data, isNewValue) {
    var tempalte = "displayJson.html";
    var displaySimple = false;
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
                   this.selectedTable.nbRow = this.selectedTable.nbRow-1;
                    this.displayData(this.selectedTableIndex);
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
                    if(isNewValue){
                      this.selectedTable.nbRow = this.selectedTable.nbRow+1;
                    }
                    this.dbManager.save(this.selectedTable,objet).then(()=>{
                        this.displayData(this.selectedTableIndex);
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
            objetData: () => data
        }
    });
  }

  displayRow(id) {
    this.selectedTable.get(id).then((data) => {
        this.displayModal(data);
    });
  }
}
