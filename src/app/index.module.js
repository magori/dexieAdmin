import { config } from './index.config';
import { DbManagerConfig } from './dbManager.config';
import { routerConfig } from './index.route';
import { DbManagerService} from './service/dbManager.service';
import { MainController} from './main/main.controller'
import { DbManagerDirective} from './dbManager/dbManager.directive';

angular.module('DBManger', ['ngRoute', 'ui.bootstrap'])
  .config(config)
  .config(routerConfig)
  .controller('MainController', MainController)
  .service('dbManagerService', DbManagerService)
  .service('dbManagerConfig', DbManagerConfig)
  .directive('dbManager',DbManagerDirective )
