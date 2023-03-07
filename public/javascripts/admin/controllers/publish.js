module.exports = ['$scope', '$http', '$rootScope', 'notie', '$location', function ($scope, $http, $rootScope, notie, $location) {
    $scope.tinymceOptions = {
        inline: false,
        skin: 'lightgray',
        theme: 'modern'
    };
    $scope.lpath = '/';
    $scope.edit = false;

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
        description: '<p style="margin:0;padding:0;font-size:12px;text-align:justify"><strong><span style="font-size:18px">Bonjour, bienvenue sur cette rando-promenade.</span></strong></p><p style="margin:0;padding:0;font-size:12px;text-align:justify"><span style="font-size:18px;color:#2980b9">En participant à cette sortie, vous vous engagez à respecter les mesures sanitaires actuelles (notamment en ayant un masque sur vous).</span></p><p style="margin:0;padding:0;font-size:12px;text-align:justify"><span style="font-size:18px;color:#2980b9">Les gestes barrières devront être respectés tout au long de la sortie.</span></p><p style="margin:0;padding:0;font-size:12px;text-align:justify"><span style="font-size:18px;color:#ff4aff"><strong><span style="color:#c000c0">On se retrouve aux environs de 10h</span><span style="font-size:8px">(disons entre 10h et 10h15)</span></strong></span></p><p style="margin:0;padding:0;font-size:12px;text-align:justify"><span style="font-size:18px"><strong>Prévoir un repas tiré du sac.</strong><br></span></p><p style="margin:0;padding:0;font-size:12px;text-align:justify"><span style="font-size:18px;color:#009b00"><strong>13 km 300m</strong> de dénivelé</span></p><p style="margin:0;padding:0;font-size:12px;text-align:justify;color:#632280">Attention la sortie est filmée. En vous y inscrivant vous donnez votre accord pour céder votre droit à l’image.</p>',
        number_limit: 25,
        walk_id: '',
    };


    $scope.getPositionFromWalk = function () {
        if ($scope.event.walk_id == '') {
            notie.alert(2, 'Attention: veuillez remplir un id pour la balade.', 3);
        } else {
            $http.get('https://decouverto.fr/walks/first-points.json').success(function(data) {
                walk = data.filter(function(w) {
                    return w.id == $scope.event.walk_id
                });
                if (walk.length == 0) {
                    notie.alert(2, 'Aucune balade correspondante trouvée.', 3);
                } else {
                    walk = walk[0];
                    $scope.event.lat = walk.coord.latitude;
                    $scope.event.long = walk.coord.longitude;
                    notie.alert(1, 'Coordonnées reportées.', 3);
                }
            }).error($rootScope.$error);
        }
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

    $scope.invalid = true;
    $http.get('./api/events/types').success(function(types) {
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
        $http.post('./api/events/', $scope.event).success(function (data) {
            notie.alert(1, 'L\'événement a été ajouté.', 3);
            $scope.progress = false;
            $location.path('/share-event/' + data._id);
        }).error(function () {
            $rootScope.$error();
            $scope.progress = false;
        });
    };
}];