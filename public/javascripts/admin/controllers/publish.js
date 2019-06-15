module.exports = ['$scope', '$http', '$rootScope', 'notie', '$location', function ($scope, $http, $rootScope, notie, $routeParams, $location) {
    $scope.tinymceOptions = {
        inline: false,
        skin: 'lightgray',
        theme: 'modern'
    };
    

    function nextSunday(hour){ // obtenir le prochain dimanche avec l'heure
        var now = new Date();    
        now.setDate(now.getDate() + (7-now.getDay()) % 7);
        now.setHours(hour);
        now.setMinutes(0);
        now.setSeconds(0);
        now.setMilliseconds(0);
        return now;
    }

    $scope.now = new Date(); 

    $scope.event = {
            title: '',
            type: 'Randonnée', // ajouter vérification des types existants
            start: nextSunday(10), 
            is_defined_end: false,
            end: nextSunday(19),
            can_subscribe: false,
            is_located: true,
            lat: 0,
            long: 0,
            location_name: 'Parking',
            description: '',
            number_limit: 25
    };

    $scope.addEvent = function () {
        $scope.progress = true
        $http.post('/api/events/', $scope.event).success(function () {
            notie.alert(1, 'L\'événement a été ajouté.', 3);
            $scope.progress = false;
            $location.path('/list-events/');
        }).error(function () {
            $rootScope.$error();
            $scope.progress = false;
        });
    }
}];