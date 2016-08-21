import { config } from './index.config';
import { NgDexieAdminConfig } from './ngDexieAdmin.config';
import { routerConfig } from './index.route';

angular.module('DBManger', ['ngRoute', 'ui.bootstrap','dexieAdmin'])
  .config(config)
  .config(routerConfig)
  .controller('MainController', ()=>{})
  .service('ngDexieAdminConfig', NgDexieAdminConfig)
