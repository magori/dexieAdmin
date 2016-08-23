'use strict';

var _dbManager = require('./service/dbManager.service');

var _ngDexieAdmin = require('./dbManager/ngDexieAdmin.directive');

angular.module('ng.dexieadmin', ['ui.bootstrap', 'ng.jsoneditor']).service('dbManagerService', _dbManager.DbManagerService).directive('ngDexieAdmin', _ngDexieAdmin.NgDexieAdminDirective);