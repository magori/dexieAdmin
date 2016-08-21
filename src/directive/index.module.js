import { DbManagerService} from './service/dbManager.service';
import { NgDexieAdminDirective} from './dbManager/ngDexieAdmin.directive';

angular.module('dexieAdmin', ['ui.bootstrap','angular-json-editor','ng.jsoneditor'])
.config(function (JSONEditorProvider) {
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
    })
  .service('dbManagerService', DbManagerService)
});
