$(document).ready(function () {
  var socket = io.connect('http://10.18.112.42:3000');

  $('.registration-form').submit(function(e) {
    e.preventDefault();
    var userName = $('#name').val();
    socket.emit('register', userName);
    window.location.href = '/scrum-poker';
  });

  $('.carousel').carousel();

  socket.on('successReg', function(data) {
    $('.notif').append('<div class="notif-holder"><p class="center-align">' + data.name + ' has joined!</p></div>').fadeOut(2000, 'swing');
  });
});