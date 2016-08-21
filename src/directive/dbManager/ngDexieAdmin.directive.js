import { DbManagerController } from './dbManager.controller';
export function NgDexieAdminDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: './dbManager.html',
    controller: DbManagerController ,
    controllerAs: 'dbManger',
    bindToController: true
  };

  return directive;
}
