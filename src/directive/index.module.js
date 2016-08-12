import { DbManagerService} from './service/dbManager.service';
import { DbManagerDirective} from './dbManager/dbManager.directive';

angular.module('dexieAdmin', ['ui.bootstrap'])
  .service('dbManagerService', DbManagerService)
  .directive('dbManager',DbManagerDirective )
