'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DbManagerDirective = DbManagerDirective;

var _dbManager = require('./dbManager.controller');

function DbManagerDirective() {
  'ngInject';

  var directive = {
    restrict: 'E',
    template: '<style>\r\n\r\n</style><script type="text/ng-template" id="displayJson.html"><pre> {{json}} </pre></script><div class="row"><div class="col-xs-3"><div class="panel panel-default"><div class="panel-heading clearfix"><div class="btn-toolbar" role="toolbar"><div class="pull-left panel-title"><span class="badge">{{ dbManger.tables.length}}</span></div><div class="btn-group pull-right"><div ng-click="dbManger.dump($event)" class="btn btn-default" title="Dump"><i class="fa fa-floppy-o" aria-hidden="true"></i></div><div ng-click="dbManger.loadAll($event)" class="btn btn-default" title="Load all"><i class="fa fa-refresh" aria-hidden="true"></i></div><div ng-click="dbManger.deleteAllDb($event)" class="btn btn-default" title="Empty DB"><i class="fa fa-trash-o" aria-hidden="true"></i></div><div ng-click="dbManger.drop($event)" class="btn btn-danger" title="Drop"><i class="fa fa-trash-o" aria-hidden="true"></i></div></div></div></div><div class="list-group" ng-repeat="table in dbManger.tables track by table.name" ng-click="dbManger.displayData(table)"><div class="list-group-item" ng-class="dbManger.selectedTable.name===table.name ? \'active\':\'\'" style="cursor:pointer"><div class="list-group-item-heading clearfix"><div class="pull-left panel-title"><span class="badge">{{table.nbRow}}</span> <span class="panel-title" style="padding-top: 7.5px;">{{table.name}}</span></div><div class="btn-group pull-right"><div ng-if="dbManger.hasActionLoad(table)" ng-click="dbManger.load($event,table)" class="btn btn-default" title="Load table"><i class="fa fa-refresh" aria-hidden="true"></i></div><div ng-click="dbManger.save($event, table)" class="btn btn-default" title="Dump table"><i class="fa fa-floppy-o" fa-stack-1x aria-hidden="true"></i></div><div ng-if="dbManger.hasDelete(table)" ng-click="dbManger.delete($event, table)" class="btn btn-default" title="Clear table"><i class="fa fa-trash-o" fa-stack-1x aria-hidden="true"></i></div><div ng-if="!dbManger.hasDelete(table)" ng-click="dbManger.forceDelete($event, table)" class="btn btn-danger" title="Force clear table"><i class="fa fa-trash-o" fa-stack-1x aria-hidden="true"></i></div></div></div><p class="list-group-item-text"><i class="fa fa-key" aria-hidden="true"></i> {{table.schema.primKey.name}} : {{table.schema.primKey.auto}}</p><p class="list-group-item-text"></p>index: <span ng-repeat="indexe in table.schema.indexes">{{indexe.src}},</span><p></p></div></div></div></div><div class="col-xs-9"><div class="panel panel-primary"><div class="panel-heading">{{dbManger.selectedTable.name}}</div><div class="panel-body"><form><div class="row"><div class="form-group col-xs-12"><div class="input-group input-group"><span class="input-group-addon"><i class="fa fa-search" aria-hidden="true"></i></span> <input type="text" class="form-control" ng-change="dbManger.search(dbManger.searchValue)" ng-model-options="{ debounce: 250 }" ng-model="dbManger.searchValue"> <span class="input-group-addon"><span class="badge">{{dbManger.dataTable.length}}</span></span></div></div></div></form><div style="height: 70vh !important;overflow-y: auto;"><table class="table table-striped table-condensed"><colgroup><col class="{{::dbManger.selectedTable.schema.primKey.name}}"><col ng-repeat="indexe in dbManger.selectedTable.schema.indexes" class="{{::indexe.name}}"></colgroup><thead><tr><th><i class="fa fa-key" aria-hidden="true"></i>PK</th><th ng-repeat="indexe in dbManger.selectedTableIndexes">{{::indexe}}</th></tr></thead><tbody><tr ng-repeat="data in dbManger.dataTable | limitTo:150" ng-click="dbManger.displayRow(data)"><td>{{data[dbManger.selectedTable.schema.primKey.name]}}</td><td ng-repeat="indexe in dbManger.selectedTableIndexes">{{data[indexe]}}</td></tr></tbody></table></div></div></div></div></div>',
    controller: _dbManager.DbManagerController,
    controllerAs: 'dbManger',
    bindToController: true
  };

  return directive;
}