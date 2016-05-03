// YOUR CODE HERE:

var app = {server: 'https://api.parse.com/1/classes/messages'};

app.init = function() {
  $('.submit').click(function() {
    app.send($('#message').val());
  });

  // $('#main').append('<div id="chats"></div>');
};

app.send = function(message) {
  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    success: function(data) {
      console.log('success', data);
      // something to update the client app
    },
    error: function(data) {
      console.error('Error');
    }
  });
};

app.fetch = function() {
  $.ajax({
    url: app.server,
    type: 'GET',
    data: {include: 'createdAt'},
    success: function(data) {
      console.log('success', data);
      app.addMessage(data);
    },
    error: function(data) {
      console.error('Error');
    }
  });
};

app.clearMessages = function() {
  $('#chats').children().detach();
};

app.addMessage = function(data) {
  $('#chats').append('<div>' + data.text + '</div>');
};

app.addRoom = function() {

};

app.addFriend = function() {

};

app.handleSubmit = function() {

};