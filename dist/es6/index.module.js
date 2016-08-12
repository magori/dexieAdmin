'use strict';

var _dbManager = require('./service/dbManager.service');

var _dbManager2 = require('./dbManager/dbManager.directive');

angular.module('dexieAdmin', ['ui.bootstrap']).service('dbManagerService', _dbManager.DbManagerService).directive('dbManager', _dbManager2.DbManagerDirective);