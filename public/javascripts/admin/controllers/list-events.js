module.exports = ['$scope', '$http', '$rootScope', 'notie', '$location', function ($scope, $http, $rootScope, notie, $location) {
    
    $http.get('/api/events').success(function(events) {
        $scope.events=events;
    }).error($rootScope.$error);

    $scope.removeEvent = function (id) {
        notie.confirm('Êtes-vous sûre de vouloir supprimer cet événement ?', 'Oui', 'Annuler', function() {
            $http.delete('/api/events/' + id).success(function() {
                notie.alert(1, 'L\'événement a été supprimé avec succès.', 3);
                $location.path('/');
            }).error($rootScope.$error);
        });
    };
}];