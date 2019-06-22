var modal = document.getElementById('modal');

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
            event = this.getAttribute('eventid');
            document.getElementById('event-choosed').innerText = this.getAttribute('eventtitle')
        }
    }
}

document.getElementById('subscribe-btn').onclick = function (e) {
    /* Gère l'inscription */
    e.preventDefault();
    console.log(event)
}