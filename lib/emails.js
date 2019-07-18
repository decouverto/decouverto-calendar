var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
        host: 'ssl0.ovh.net',
        port: 587,
        secure: false, 
        auth: {
            user: 'contact@decouverto.fr',
            pass: require('../email-password.json').password
        }
});

var weekdays = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

function generateDateText(event) {
    var date = new Date(event.start);
    var d = date.getDate(),
        m = date.getMonth() + 1,
        hh = date.getHours(),
        mm = date.getMinutes();
    return 'le '  + weekdays[date.getDay()] + ' ' + (d < 10 ? '0' : '') + d + '/' + (m < 10 ? '0' : '') + m + ' à ' + (hh < 10 ? '0' : '') + hh + ':' + (mm < 10 ? '0' : '') + mm;
}


module.exports = {
    subscribe: function (email, event) {
        
        var html = `<h1>Inscription réussite</h1>
                    <img src="https://calendrier.decouverto.fr/banner_email.jpg"/>
                    <p>Bonjour ${email.firstname} ${email.name},
                    <br>Vous venez de vous inscrire à l'événement Découverto "<i>${event.title}</i>" qui aura lieu <b>${generateDateText(event)}</b> !</p>
                    <p>Cordialement,<br>L'équipe Découverto</p>
                    <p style="font-size: 10px">Vous pouvez vous désinscrire à tous moments sur https://calendrier.decouverto.fr/email/${email.email}</p>`
        var text = `Inscription réussite\n
                    Bonjour ${email.firstname} ${email.name},\n
                    Vous venez de vous inscrire à l'événement Découverto "${event.title}" qui aura lieu ${generateDateText(event)}> !\n
                    Cordialement,\n
                    L'équipe Découverto\n
                    \n
                    Vous pouvez vous désinscrire à tous moments sur https://calendrier.decouverto.fr/email/${email.email}`

        var mailOptions = {
            from: 'Découverto <contact@decouverto.fr>',
            to: email.email,
            replyTo: 'decouverto@yahoo.com',
            subject: 'Vous êtes inscrit à l\'événement "' + event.title +'"',
            text: text,
            html: html
        };

        transporter.sendMail(mailOptions);
    },
    unsubscribe: function (email, event) {
        var html = `<h1>Désinscription réussite</h1>
                    <img src="https://calendrier.decouverto.fr/banner_email.jpg"/>
                    <p>Bonjour ${email.firstname} ${email.name},
                    <br>Vous venez de vous <b>désinscrire</b> de l'événement Découverto "<i>${event.title}</i>" qui aura lieu ${generateDateText(event)}. </p>
                    <p>Cordialement,<br>L'équipe Découverto</p>
                    <p style="font-size: 10px">Vous pouvez gérer toutes vous inscription sur https://calendrier.decouverto.fr/email/${email.email}.</p>`
        var text = `Désinscription réussite\n
                    Bonjour ${email.firstname} ${email.name},\n
                    Vous venez de vous désinscrire de l'événement Découverto "${event.title}" qui aura lieu ${generateDateText(event)}>.\n
                    Cordialement,\n
                    L'équipe Découverto\n
                    \n
                    Vous pouvez gérer toutes vous inscription sur https://calendrier.decouverto.fr/email/${email.email}`

        var mailOptions = {
            from: 'Découverto <contact@decouverto.fr>',
            to: email.email,
            replyTo: 'decouverto@yahoo.com',
            subject: 'Désinscrition de l\'événement "' + event.title +'"',
            text: text,
            html: html
        };

        transporter.sendMail(mailOptions);
    }
}