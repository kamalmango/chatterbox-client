var app = {
  server: 'https://api.parse.com/1/classes/messages',
  username: '',
  roomname: 'lobby'
};

app.init = function() {
  $('#send').on('submit', app.handleSubmit);
  $('#rooms').on('change', function() {
    app.roomname = $('#rooms').val();
  });
  app.username = window.location.search.substring(1).split('=')[1];
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
    // data: {include: 'createdAt'},
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
  data.results.forEach(function(chat) {
    var $user = $('<div class="username"></div>');
    var $message = $('<div></div>');
    var $container = $('<div class="chat"></div>');

    $user.text(chat.username);
    $message.text(chat.text);
    $user.attr('id', chat.username);
    $user.on('click', function() {
      app.addFriend(chat.username);
    });

    $container.append($user, $message);
    $('#chats').append($container);
  });

};

app.addRoom = function(data) {
  var dupFree = {};
  data.results.forEach(function(chat) {
    var $room = $('<option></option>');
    if (!dupFree.hasOwnProperty(chat.roomname)) {
      $('#roomSelect').append($room.text(chat.roomname));
      dupFree[chat.roomname] = 0;
    }
  });

};

app.addFriend = function(username) {

};

app.handleSubmit = function(e) {
  var message = {
    username: app.username,
    text: $('#message').val(),
    roomname: $('#roomSelect').val()
  };
  app.send(message);
  e.preventDefault();
};




$(document).ready(function() {
  app.init();
});