module.exports = ['$scope', '$http', '$rootScope', 'notie', '$location', function ($scope, $http, $rootScope, notie, $routeParams, $location) {
    $scope.tinymceOptions = {
        inline: false,
        skin: 'lightgray',
        theme: 'modern'
    };
    $scope.lpath = '/'

    function nextSunday(hour) { // obtenir le prochain dimanche avec l'heure
        var now = new Date();
        now.setDate(now.getDate() + (7 - now.getDay()) % 7);
        now.setHours(hour);
        now.setMinutes(0);
        now.setSeconds(0);
        now.setMilliseconds(0);
        return now;
    }

    $scope.now = new Date();

    $scope.event = {
        title: '',
        type: 'Randonnée', 
        start: nextSunday(10),
        is_defined_end: false,
        end: nextSunday(19),
        can_subscribe: false,
        is_located: true,
        lat: 0,
        long: 0,
        location_name: 'Parking',
        description: '',
        number_limit: 25,
        walk_id: '',
    };

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

    $scope.invalid = false;

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
        $http.post('/api/events/', $scope.event).success(function () {
            notie.alert(1, 'L\'événement a été ajouté.', 3);
            $scope.progress = false;
            $location.path('/list-events/');
        }).error(function () {
            $rootScope.$error();
            $scope.progress = false;
        });
    };
}];