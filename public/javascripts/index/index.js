var modal = document.getElementById('modal');
var defaultBody = document.getElementById('default-modal-body');
var successBody = document.getElementById('success-modal-body');
var btn = document.getElementById('subscribe-btn');
var warnForm = document.getElementById('warn-form');

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
            emailInput.value = '';
            firstnameInput.value = '';
            nameInput.value = '';
            event = this.getAttribute('eventid');
            document.getElementById('event-choosed').innerText = this.getAttribute('eventtitle')
        }
    }
}



btn.onclick = function (e) {
    /* Gère l'inscription */
    e.preventDefault();
    if (emailInput.value == '' || nameInput.value == '' || firstnameInput.value == '' || !emailInput.checkValidity()) {
        warnForm.style.display = 'block';
    } else {
        warnForm.style.display = 'none';
    
        console.log(event)
    }
}