angular.module('formApp', ['ngAnimate', 'ui.router'])



.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('po', {
        abstract: true,
        url: 'po',
        templateUrl: 'po.component.html'
    })

})