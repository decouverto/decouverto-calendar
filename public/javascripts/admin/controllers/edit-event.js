module.exports = ['$scope', '$http', '$rootScope', 'notie', '$routeParams', '$location', 'Upload', function ($scope, $http, $rootScope, notie, $routeParams, $location, Upload) {
    $scope.tinymceOptions = {
        inline: false,
        skin: 'lightgray',
        theme: 'modern'
    };
    $scope.lpath = '/list-events'
    $scope.edit = true;
    $scope.content = false;
    $scope.progressScore = 0;
    $scope.now = new Date();
    $scope.event = { description: '' };

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
                }
            }).error($rootScope.$error);
        }
    };
    
    $http.get('./api/events/' + $routeParams.id).success(function (event) {
        $scope.event = {
            title: event.title,
            type: event.type, 
            start: new Date(event.start),
            is_defined_end: event.is_defined_end,
            end: new Date(),
            can_subscribe: event.can_subscribe,
            is_located: event.is_located,
            lat: 0,
            long: 0,
            location_name: '',
            description: event.description,
            number_limit: event.number_limit || 25,
            walk_id: event.walk_id || '',
            filename: event.filename
        };
        if (event.is_located) {
            $scope.event.lat = event.location.lat
            $scope.event.long = event.location.long
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
        $scope.invalid = false;
    }).error($rootScope.$error);

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

    $scope.editImage = function () {
        $scope.progress = true
        var obj = {};
        obj.file = $scope.content;
        Upload.upload({
            url: '/api/events/' + $routeParams.id + '/image',
            method: 'PUT',
            data: obj
        }).then(function (res) {
            notie.alert(1, 'L\'image a été ajouté.', 3);
            $scope.progress = false;
            $scope.event.filename = res.data.filename;
        }, function () {
            $scope.progress = false;
            $rootScope.$error();
        }, function (evt) {
            $scope.progressScore = parseInt(100.0 * evt.loaded / evt.total);
        });
    };

    $scope.deleteImage = function () {
        $http.delete('/api/events/' + $routeParams.id + '/image').success(function() {
            notie.alert(1, 'L\'image a été supprimée avec succès.', 3);
            $scope.event.filename = '';
        }).error($rootScope.$error);
    };
}];