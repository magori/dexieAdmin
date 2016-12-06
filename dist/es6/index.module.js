'use strict';

var _dbManager = require('./service/dbManager.service');

var _ngDexieAdmin = require('./dbManager/ngDexieAdmin.directive');

angular.module('ng.dexieadmin', ['ui.bootstrap', 'ng.jsoneditor']).service('dbManagerService', _dbManager.DbManagerService).directive('ngDexieAdmin', _ngDexieAdmin.NgDexieAdminDirective).directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function link(scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                scope.$apply(function () {
                    scope.fileread = changeEvent.target.files[0];
                });
            });
        }
    };
}]).directive('fileInput', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function link(scope, element, attributes) {
            element.bind('change', function () {
                $parse(attributes.fileInput).assign(scope, element[0].files);
                scope.$apply();
            });
        }
    };
}]);;