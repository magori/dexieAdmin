import { DbManagerConfig } from './dbManager.config';
import { DbManagerService} from './service/dbManager.service';

angular.module('dexieAdmin', ['ui.bootstrap'])
  .service('dbManagerService', DbManagerService)
  .service('dbManagerConfig', DbManagerConfig)
