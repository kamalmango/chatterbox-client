var app = {
  server: 'https://api.parse.com/1/classes/messages',
  username: '',
  roomname: 'lobby',
  dupFree: {},
  friends: {}
};

app.init = function() {
  $('#send').on('submit', app.handleSubmit);
  $('#roomSelect').on('change', function() {
    app.roomname = $(this).val();
    app.fetch();
  });
  app.username = window.location.search.substring(1).split('=')[1];
  app.fetch();

  setInterval(app.fetch, 10000);
};

app.send = function(message) {
  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    success: function(data) {
      console.log('Message successfully sent!');
      app.fetch();
      $('#message').val('');
      $('#newRoom').val('');
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
  app.clearMessages();
  var filteredData = _.filter(data.results, function(chat) {
    return chat.roomname === app.roomname;
  });

  _.each(filteredData, function(chat) {
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
  _.each(data.results, function(chat) {
    var $room = $('<option></option>');
    $room.attr('class', 'room');
    if (!app.dupFree.hasOwnProperty(chat.roomname)) {
      $('#roomSelect').append($room.text(chat.roomname));
      app.dupFree[chat.roomname] = 0;
    }
    if (chat.roomname === app.roomname) {
      $room.attr('selected', true);
    }
  });

};

app.addFriend = function(username) {
  $('#friends').children().detach();
  app.friends[username] = username;
  _.each(app.friends, function(friend) {
    console.log(app.friends);
    var $val = $('<div></div>');
    $('#friends').append($val.text(friend));
  });
};

app.handleSubmit = function(e) {
  if ($('#newRoom').val() !== '') {
    app.roomname = $('#newRoom').val();
  }
  var message = {
    username: app.username,
    text: $('#message').val(),
    roomname: app.roomname
  };
  app.send(message);
  e.preventDefault();
};




$(document).ready(function() {
  app.init();
});