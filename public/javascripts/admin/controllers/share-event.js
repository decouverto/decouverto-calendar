module.exports = ['$scope', '$http', '$rootScope', 'notie', '$routeParams', '$document', function ($scope, $http, $rootScope, notie, $routeParams, $document) {

    $scope.text = '';
    $scope.title = '';

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
                m = date.getMonth() + 1;
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
            html = html.replace(/&nbsp;/g, '');

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

            html = html.replace(/Km/g, 'km'); // erreur de Vincent

            html = html.replace(/(\r\n|\n|\r)/gm,' ');
            html = html.replace(/\s+/g, " ");

            return html;
        }
        text += '\n\n' + strip(event.description);

        /* Lieu */
        if (event.is_located) {
            text += '\n\nLieu : ' + event.location.name
        }

        /* Lien */
        if (event.can_subscribe) {
            text += '\n\nInscription sur: https://calendrier.decouverto.fr/#/' + $routeParams.id;
        } else {
            text += '\n\nPlus de détails sur: https://calendrier.decouverto.fr/#/' + $routeParams.id;
        }

        $scope.text = text;


        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        var imageObj = new Image();
        imageObj.onload = function () {
            context.drawImage(imageObj, 0, 0, 1024, 128);
            context.fillStyle = '#fff';
            context.strokeStyle = '#fff';

            if (event.title.length > 55) {
                context.font = '25px Calibri';
            } else if (event.title.length <= 20) {
                context.font = '50px Calibri';
            } else {
                context.font = '30px Calibri';
            }
            context.fillText(event.title, 25, 100);
        };
        imageObj.src = '/banner.png';

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


    $scope.download = function () {
        var link = document.createElement('a');
        link.download = 'event.png';
        link.href = document.getElementById('canvas').toDataURL();
        link.click();
    }
}];