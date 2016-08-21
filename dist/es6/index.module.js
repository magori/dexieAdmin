'use strict';

var _dbManager = require('./service/dbManager.service');

var _ngDexieAdmin = require('./dbManager/ngDexieAdmin.directive');

angular.module('dexieAdmin', ['ui.bootstrap', 'angular-json-editor', 'ng.jsoneditor']).config(["JSONEditorProvider", function (JSONEditorProvider) {
    JSONEditorProvider.configure({
        defaults: {
            options: {
                iconlib: 'fontawesome4',
                theme: 'bootstrap3',
                disable_edit_json: false,
                disable_properties: true,
                disable_collapse: true
            }
        }
    });
}]).service('dbManagerService', _dbManager.DbManagerService).directive('ngDexieAdmin', _ngDexieAdmin.NgDexieAdminDirective);