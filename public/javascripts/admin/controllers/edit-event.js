module.exports = ['$scope', '$http', '$rootScope', 'notie', '$routeParams', '$location', function ($scope, $http, $rootScope, notie, $routeParams, $location) {
    $scope.tinymceOptions = {
        inline: false,
        skin: 'lightgray',
        theme: 'modern'
    };
    $scope.lpath = '/list-events'

    $scope.now = new Date();
    $scope.event = { description: '' };
    
    $http.get('/api/events/' + $routeParams.id).success(function (event) {
        $scope.event = {
            title: event.title,
            type: event.type, 
            start: new Date(event.start),
            is_defined_end: event.is_defined_end,
            end: new Date(),
            can_subscribe: false,
            is_located: event.is_located,
            lat: 0,
            long: 0,
            location_name: '',
            description: event.description,
            number_limit: event.number_limit || 25,
            walk_id: event.walk_id || '',
        };
        if (event.is_located) {
            $scope.event.lat = event.location.lat
            $scope.event.long = event.location.lat
            $scope.event.location_name = event.location.name
        }
        if (event.is_defined_end) {
            $scope.event.end = new Date(event.end);
        }
        $scope.invalidForm = function () {
            var invalid = false;
            if ($scope.event.description == '') {
                invalid = true;
            }
            if ($scope.event.type == '') {
                invalid = true;
            }
            if ($scope.event.title == '') {
                invalid = true;
            }
            if ($scope.event.is_located && ($scope.event.location_name == '' || $scope.event.lat == 0 || $scope.event.long == 0)) {
                invalid = true;
            }
            if ($scope.event.can_subscribe && $scope.event.number_limit == 0) {
                invalid = true;
            }
            $scope.invalid = invalid;
        };
        $scope.invalid = true;
    }).error(function () {
        $rootScope.$error();
        $scope.progress = false;
    });

    $scope.invalidForm = function () {
        return true
    };
    
    $scope.invalid = true;

    $http.get('/api/events/types').success(function(types) {
        $scope.existsType = true;
        $scope.types = types;
        $scope.checkTheme = function (type) {
            var e = false;
            for (var k in types) {
                if (type == types[k]) {
                    e = true;
                    break;
                }
            }
            $scope.existsType = e;
        }
    }).error($rootScope.$error);

    $scope.publish = function () {
        $scope.progress = true
        $http.put('/api/events/' + $routeParams.id, $scope.event).success(function () {
            notie.alert(1, 'L\'événement a été ajouté.', 3);
            $scope.progress = false;
            $location.path('/list-events/');
        }).error(function () {
            $rootScope.$error();
            $scope.progress = false;
        });
    };
}];