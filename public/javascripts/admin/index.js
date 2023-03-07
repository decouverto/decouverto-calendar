require('angular'); /*global angular*/
require('angular-route');
require('ng-notie');
require('./tinymce/tinymce.min.js');
require('./tinymce/ui-tinymce.js');


var app = angular.module('Decouverto', ['ngNotie', 'ngRoute', 'ui.tinymce']);
app.config(['$routeProvider', function($routeProvider) {
        // Route configuration
        $routeProvider
        .when('/', {
            templateUrl: '/views/home.html',
            controller: 'HomeCtrl'
        })
        .when('/publish', {
            templateUrl: '/views/publish.html',
            controller: 'PublishCtrl'
        })
        .when('/list-events/', {
            templateUrl: '/views/list-events.html',
            controller: 'ListEventsCtrl'
        })
        .when('/edit-event/:id', {
            templateUrl: '/views/publish.html',
            controller: 'EditEventCtrl'
        })
        .when('/emails-event/:id', {
            templateUrl: '/views/emails-event.html',
            controller: 'EmailsEventCtrl'
        })
        .when('/share-event/:id', {
            templateUrl: '/views/share-event.html',
            controller: 'ShareEventCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);
app.run(['$rootScope', '$location', 'notie', function ($rootScope, $location,  notie) {
    $rootScope.$error = function () { // Send message error
        notie.alert(3, 'Une erreur est survenue.', 3);
    }
    $rootScope.$goTo = function (path) {
        $location.path(path);
    }
}]);
app.controller('HomeCtrl', require('./controllers/home.js'));
app.controller('PublishCtrl', require('./controllers/publish.js'));
app.controller('ListEventsCtrl', require('./controllers/list-events.js'));
app.controller('EditEventCtrl', require('./controllers/edit-event.js'));
app.controller('ShareEventCtrl', require('./controllers/share-event.js'));
app.controller('EmailsEventCtrl', require('./controllers/emails-event.js'));