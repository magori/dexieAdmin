import { DbManagerController } from './dbManager.controller';
export function DbManagerDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: 'app/dbManager/dbManager.html',
    controller: DbManagerController ,
    controllerAs: 'dbManger',
    bindToController: true
  };

  return directive;
}
