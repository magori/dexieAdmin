import { DbManagerService} from './service/dbManager.service';
import { NgDexieAdminDirective} from './dbManager/ngDexieAdmin.directive';

angular.module('ng.dexieadmin', ['ui.bootstrap','ng.jsoneditor'])
  .service('dbManagerService', DbManagerService)
  .directive('ngDexieAdmin', NgDexieAdminDirective)
  .directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                scope.$apply(()=> {
                   scope.fileread = changeEvent.target.files[0];
                });
            });
        }
    }
}]).directive('fileInput', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attributes) {
            element.bind('change', function () {
                $parse(attributes.fileInput)
                .assign(scope,element[0].files)
                scope.$apply()
            });
        }
    };
}]);;
