$(document).ready(function () {
  var socket = io.connect('http://localhost:3000'); // INVOKE SERVER SIDE SOCKET

  $('.carousel').carousel(); //INVOKE CAROUSEL CSS AND FUNCTIONALITY

  $('.registration-form').submit(function(e) {
    e.preventDefault();
    var userName = $('#name').val();
    socket.emit('register', userName);
    socket.on('successReg', function(data) {
      window.location.href = '/scrum-poker?id=' + data.id;
    });
  });

  //SET PLAYER IN DASHBOARD
  socket.on('successReg', function(data) {
    $('.notif').append('<div class="notif-holder"><p class="center-align">' + data.name + ' has joined!</p></div>').fadeOut(2000, 'swing');
    $('.player-container').append('<div class="playerdata" style="text-align:center" id="' + data.id + '"><p>' + data.name + '</p>' +
    '<div class="flip-card">' +
      '<div class="flip-card-inner">' +
        '<div class="flip-card-front">' +
          '<img src="../images/cards.jpg" alt="Card">' +
        '</div>' +
        '<div class="flip-card-back">' +
          '<div class="inner-border"></div>' +
          '<div class="upper-left score-' + data.id + '"></div>' +
          '<div class="lower-right score-' + data.id + '"></div>' +
          '<div class="center-wrapper valign-center"><h1 id="score-' + data.id + '"></h1></div>' +
        '</div>' +
      '</div>' +
    '</div></div>');
  }); 

  $('.set-button').click(function() {
    var userId = new URLSearchParams(window.location.search).get('id');
    var score = $('.card.active h2')[0].innerHTML;
    var payload = {
      id: userId,
      score: score,
      action: 'set'
    }
    socket.emit('setScore', payload);
    $(this).attr('disabled', true);
    $('.unset-button').removeAttr('disabled');
  });

  socket.on('returnScore', function(data) {
    $('#score-'+data.id).append(data.score);
    $('.upper-left.score-'+data.id).append(data.score);
    $('.lower-right.score-'+data.id).append(data.score);
    if(data.action == 'set') {
      $('.playerdata#'+data.id).append('<h1>' + data.score+ '</h1>');
    } else {
      $('.playerdata#'+data.id+' h1').remove();
    }
  });

  $('.unset-button').click(function() {
    var userId = new URLSearchParams(window.location.search).get('id');
    var payload = {
      id: userId,
      action: 'unset'
    }
    socket.emit('unsetScore', payload);
    $(this).attr('disabled', true);
    $('.set-button').removeAttr('disabled');
  });
});