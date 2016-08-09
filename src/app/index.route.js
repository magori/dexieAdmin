export function routerConfig ($routeProvider) {
  'ngInject';
  $routeProvider
    .when('/db', {
      templateUrl: 'app/dbManger/dbManager.html',
      controller: 'DbManagerController',
      controllerAs: 'dbManger'
    })
    .when('/', {
      templateUrl: 'app/main/main.html',
      controller: 'MainController',
      controllerAs: 'dbManger'
    })
    .otherwise({
      redirectTo: '/'
    });
}
