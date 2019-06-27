var btnLeave = document.getElementById('btn-leave');
var emailLeave = document.getElementById('email-leave');


btnLeave.onclick = function (e) {
    e.preventDefault();
    if (emailLeave.value != '' && emailLeave.value.match(/@/)) {
        window.open('./email/'+emailLeave.value, '_blank');
    }
}

function postAjax(url, data, success, error) {
    var params = Object.keys(data).map(function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }).join('&');

    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open('POST', url);
    xhr.onreadystatechange = function() {
        if (xhr.readyState>3 && xhr.status==200) { 
            success(xhr.responseText); 
        } else {
            error();
        }
    };
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(params);
    return xhr;
}


var modal = document.getElementById('modal');
var defaultBody = document.getElementById('default-modal-body');
var successBody = document.getElementById('success-modal-body');
var btn = document.getElementById('subscribe-btn');
var warnForm = document.getElementById('warn-form');
var errorForm = document.getElementById('error-form');

var emailInput = document.getElementById('email-input');
var firstnameInput = document.getElementById('firstname-input');
var nameInput = document.getElementById('name-input');

var span = document.getElementsByClassName('close')[0];

span.onclick = function() {
  modal.style.display = 'none';
}

window.onclick = function(e) {
  if (e.target == modal) {
    modal.style.display = 'none';
  }
}

var event = '';

function animate(elem, style, unit, from, to, time, prop) {
    if (!elem) {
        return;
    }
    var start = new Date().getTime(),
        timer = setInterval(function () {
            var step = Math.min(1, (new Date().getTime() - start) / time);
            if (prop) {
                elem[style] = (from + step * (to - from))+unit;
            } else {
                elem.style[style] = (from + step * (to - from))+unit;
            }
            if (step === 1) {
                clearInterval(timer);
            }
        }, 25);
    if (prop) {
          elem[style] = from+unit;
    } else {
          elem.style[style] = from+unit;
    }
}

window.onload = function() {
    var anchors = document.getElementsByClassName('subscribe-btn');
    for(var i = 0; i < anchors.length; i++) {
        var anchor = anchors[i];
        anchor.onclick = function() {
            modal.style.display = 'block';
            defaultBody.style.display = 'block';
            btn.style.display = 'block';
            successBody.style.display = 'none';
            warnForm.style.display = 'none';
            errorForm.style.display = 'none';
            emailInput.value = '';
            firstnameInput.value = '';
            nameInput.value = '';
            event = this.getAttribute('eventid');
            document.getElementById('event-choosed').innerText = this.getAttribute('eventtitle')
        }
    }
    var id = window.location.hash.substr(1).replace('/', '');
    try {
        var selected = document.getElementById(id)
        selected.classList.add('red-border');
        animate(document.scrollingElement || document.documentElement, "scrollTop", "", 0, selected.offsetTop, 500, true);
    } catch(e) {
        
    }
}



btn.onclick = function (e) {
    /* Gère l'inscription */
    e.preventDefault();
    if (emailInput.value == '' || nameInput.value == '' || firstnameInput.value == '' || !emailInput.checkValidity()) {
        warnForm.style.display = 'block';
    } else {
        warnForm.style.display = 'none';
        errorForm.style.display = 'none';
        btn.style.display = 'none';
        postAjax('./api/emails', { email: emailInput.value, name: nameInput.value, firstname: firstnameInput.value, event: event }, function () {
            successBody.style.display = 'block';
            defaultBody.style.display = 'none';
        }, function () {
            errorForm.style.display = 'block';
            btn.style.display = 'block';
        })
        
    }
}
