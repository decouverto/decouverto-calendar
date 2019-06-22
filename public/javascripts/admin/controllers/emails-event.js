module.exports = ['$scope', '$http', '$rootScope', 'notie', '$routeParams', '$document', function ($scope, $http, $rootScope, notie, $routeParams, $document) {

    $scope.text = '';

    $http.get('./api/events/' + $routeParams.id + '/emails').success(function (event) {
        $scope.title = event.title;
        $scope.emails= event.emails;
        $scope.can_subscribe = event.can_subscribe;
        var text = '';

        event.emails.forEach(function (el) {
            text += el.email + ',\n'
        });
        text = text.replace(/,\s*$/, '');

        $scope.text = text;

    }).error($rootScope.$error);

    $scope.copy = function () {

        var el = document.createElement('textarea');
        el.value = $scope.text;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        var selected =
            document.getSelection().rangeCount > 0
                ? document.getSelection().getRangeAt(0)
                : false;
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        if (selected) {
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(selected);
        }
        notie.alert(1, 'Le texte a été copié.', 3);
    };
}];