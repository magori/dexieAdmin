import { DbManagerService} from './service/dbManager.service';
import { NgDexieAdminDirective} from './dbManager/ngDexieAdmin.directive';

angular.module('ng.dexieadmin', ['ui.bootstrap','ng.jsoneditor'])
  .service('dbManagerService', DbManagerService)
  .directive('ngDexieAdmin', NgDexieAdminDirective);
