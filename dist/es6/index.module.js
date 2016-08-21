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
}]).service('dbManagerService', _dbManager.DbManagerService).directive('ngDexieAdmin', _ngDexieAdmin.NgDexieAdminDirective).directive('json', ["$exceptionHandler", function ($exceptionHandler) {
  return {
    restrict: 'A', // only activate on element attribute
    require: 'ngModel', // get a hold of NgModelController
    link: function link(scope, element, attrs, ngModelCtrl) {
      function fromUser(text) {
        if (!text || text.trim() === '') return {};else try {
          return angular.fromJson(text);
        } catch (e) {
          scope.error2 = e.message;
          scope.$emit("jsonParsException", e);
        }
      }

      function toUser(object) {
        // better than JSON.stringify(), because it formats + filters $$hashKey etc.
        return angular.toJson(object, true);
      }
      // push() if faster than unshift(), and avail. in IE8 and earlier (unshift isn't)
      ngModelCtrl.$parsers.push(fromUser);
      ngModelCtrl.$formatters.push(toUser);

      // $watch(attrs.ngModel) wouldn't work if this directive created a new scope;
      // see http://stackoverflow.com/questions/14693052/watch-ngmodel-from-inside-directive-using-isolate-scope how to do it then
      scope.$watch(attrs.ngModel, function (newValue, oldValue) {
        if (newValue != oldValue) {
          if (!scope.error) {
            ngModelCtrl.$setViewValue(toUser(newValue));
            // TODO avoid this causing the focus of the input to be lost..
            ngModelCtrl.$render();
          }
          delete scope.error2;
        }
      }, true); // MUST use objectEquality (true) here, for some reason..
    }
  };
}]);