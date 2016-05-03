var app = {
  server: 'https://api.parse.com/1/classes/messages',
  username: '',
  rooms: ['lobby']
};

app.init = function() {
  $('#send').on('submit', app.handleSubmit);
  $('#rooms').on('change', function() {
    app.roomname = $('#rooms').val();
  });
  app.username = window.location.search.substring(1).split('=')[1];
  app.populateRooms();
  app.fetch();
};

app.send = function(message) {
  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    success: function(data) {
      console.log('Message successfully sent!');
      app.fetch();
    },
    error: function(err) {
      console.error('Error posting message: ', err);
    }
  });
};

app.fetch = function() {
  $.ajax({
    url: app.server,
    type: 'GET',
    data: {include: 'createdAt'},
    success: function(data) {
      console.log('Retrieved all messages');
      app.addMessage(data);
      app.addRoom(data);
    },
    error: function(err) {
      console.error('Error fetching data: ', err);
    }
  });
};

app.clearMessages = function() {
  $('#chats').children().detach();
};

app.addMessage = function(data) {
  // app.clearMessages();
  data.results.forEach(function(val) {
    var $user = $('<div class="username"></div>');
    var $message = $('<div></div>');
    var $container = $('<div class="chat"></div>');

    $user.text(val.username);
    $message.text(val.text);
    $user.attr('id', val.username);
    $user.on('click', function() {
      app.addFriend(val.username);
    });

    $container.append($user, $message);
    $('#chats').append($container);
  });

};

app.addRoom = function(data) {
  $('#roomSelect').append('<option>' + data.roomname + '</option>');
};

app.addFriend = function(username) {

};

app.handleSubmit = function(e) {
  console.log(window.location.search.substring(1).split("=")[1]);
  var message = {
    username: app.username,
    text: $('#message').val(),
    roomname: $('#roomSelect').val()
  };
  app.send(message);
  e.preventDefault();
};

app.populateRooms = function() {
  app.rooms.forEach(function(val) {
    var $room = $('<option></option>');
    $room.text(val);
    $('#roomSelect').append($room);
  });
};


$(document).ready(function() {
  app.init();
});