$(document).ready(function () {
  var hostname = $(location).attr('hostname');
  var port = $(location).attr('port');
  var socket = io.connect(hostname + ':' + port); // INVOKE SERVER SIDE SOCKET

  $('.carousel').carousel(); //INVOKE CAROUSEL CSS AND FUNCTIONALITY

  $('.registration-form').submit(function(e) {
    e.preventDefault();
    var userName = $('#name').val();
    socket.emit('register', userName);
    socket.on('successReg', function(data) {
      window.location.href = '/scrum-poker?id=' + data.id + '&name=' + data.name;
    });
  });

  //SET PLAYER IN DASHBOARD
  socket.on('successReg', function(data) {
    $('.notif').append('<div class="notif-holder"><p class="center-align">' + data.name + ' has joined!</p></div>').fadeOut(2000, 'swing');
    $('.player-container').append('<div class="playerdata center-align" id="' + data.id + '"><h4>' + data.name + '</h4>' +
    '<div class="pulse-holder">' +
    '<div class="flip-card">' +
      '<div class="flip-card-inner">' +
        '<div class="flip-card-front"></div>' +
        '<div class="flip-card-back">' +
          '<div class="inner-border"></div>' +
          '<div class="upper-left score-' + data.id + '"></div>' +
          '<div class="lower-right score-' + data.id + '"></div>' +
          '<div class="center-wrapper valign-center"><h1 id="score-' + data.id + '"></h1></div>' +
        '</div>' +
      '</div>' +
    '</div></div></div>');
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
    if(data.action == 'set') {
      $('.playerdata#'+data.id + ' .pulse-holder').addClass('cyan pulse');
      $('#score-'+data.id).append(data.score);
      $('.upper-left.score-'+data.id).append(data.score);
      $('.lower-right.score-'+data.id).append(data.score);
    } else {
      $('.playerdata#'+data.id + ' .pulse-holder').removeClass('cyan pulse');
      $('#score-'+data.id).empty();
      $('.upper-left.score-'+data.id).empty();
      $('.lower-right.score-'+data.id).empty();
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

  $('.reveal-button').click(function() {
    $('.flip-card').addClass('flipped');
    $('.hide-button').removeAttr('disabled');
    $(this).attr('disabled', true);
  });

  $('.hide-button').click(function() {
    $('.flip-card').removeClass('flipped');
    $('.reveal-button').removeAttr('disabled');
    $(this).attr('disabled', true);
  });

  $('.disconnect-button').click(function() {
    var userName = new URLSearchParams(window.location.search).get('name');
    var userId = new URLSearchParams(window.location.search).get('id');
    socket.emit('dc', { name: userName, id: userId });
    window.location.href = '/';
  });

  socket.on('dc', function(data) {
    $('.playerdata#'+data.id).remove();
  });
});