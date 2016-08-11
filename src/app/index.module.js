import { config } from './index.config';
import { DbManagerConfig } from './dbManager.config';
import { routerConfig } from './index.route';

angular.module('DBManger', ['ngRoute', 'ui.bootstrap','dexieAdmin'])
  .config(config)
  .config(routerConfig)
  .controller('MainController', ()=>{})
  .service('dbManagerConfig', DbManagerConfig)
