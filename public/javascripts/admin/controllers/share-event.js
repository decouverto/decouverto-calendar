module.exports = ['$scope', '$http', '$rootScope', 'notie', '$routeParams', '$document', function ($scope, $http, $rootScope, notie, $routeParams, $document) {

    $scope.text = '';

    $http.get('./api/events/' + $routeParams.id).success(function (event) {

        var text = event.title + '\n' + event.type + '\n';

        /* Date */
        var weekdays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

        function getHours(date) {
            var h = date.getHours(),
                m = date.getMinutes();
            return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
        }

        function getDay(date) {
            var h = date.getDate(),
                m = date.getMonth();
            return (h < 10 ? '0' : '') + h + '/' + (m < 10 ? '0' : '') + m;
        } 

        var start = new Date(event.start);
        text += '\nLe ' + weekdays[start.getDay()] + ' ' + getDay(start);

        if (event.is_defined_end) {
            text += ' de ' + getHours(start) + ' à ';
            var end = new Date(event.end);
            text += getHours(end);
        } else {
            text += ' à ' + getHours(start);
        }

        /* Description */
        function strip(html) {
            html = html.replace(/<strong>/g, '');
            html = html.replace(/<\/strong>/g, '');
            html = html.replace(/<em>/g, '');
            html = html.replace(/<\/em>/g, '');
            html = html.replace(/(<([^>]+)>)/ig, '\n');
            html = html.replace(/&egrave;/g, 'è');
            html = html.replace(/&eacute;/g, 'é');
            html = html.replace(/&ecirc;/g, 'ê');
            html = html.replace(/&euml;/g, 'ë');
            
            html = html.replace(/&agrave;/g, 'à');
            html = html.replace(/&acirc;/g, 'ä');
            html = html.replace(/&auml;/g, 'â');
            
            html = html.replace(/&ograve;/g, 'ò');
            html = html.replace(/&ocirc;/g, 'ô');
            html = html.replace(/&ouml;/g, 'ö');
            
            html = html.replace(/&igrave;/g, 'ì');
            html = html.replace(/&icirc;/g, 'î');
            html = html.replace(/&iuml;/g, 'ï');
            
            html = html.replace(/&ugrave;/g, 'ù');
            html = html.replace(/&uuml;/g, 'ü');
            html = html.replace(/&ucirc;/g, 'û');
            return html;
        }
        text += '\n\n' + strip(event.description);

        /* Lieu */
        if (event.is_located) {
            text += '\n\nLieu : ' + event.location.name
        }

        /* Lien */
        if (event.can_subscribe) {
            text += '\n\nInscription sur: https://decouverto.fr/calendrier/#/' + $routeParams.id;
        } else {
            text += '\n\nPlus de détails sur: https://decouverto.fr/calendrier/#/' + $routeParams.id;
        }

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
}

];