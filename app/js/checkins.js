$(function () {
  var proxy = 'http://mehner.berlin/twitterproxy/';
  var ticketsUrl = 'doc-is-in.tito.io/cssconfeu/cssconf-eu-2014/checkin_lists/bNvUloJV9EskaoVD1rzrUew/tickets.json';
  var url = proxy + ticketsUrl;
  var greetEvery = 0.5;
  var updateEvery = 2;
  var greetings = [
    'Hey, welcome %s!',
    'Did you know that %s is also here?',
    'Come say hi to %s',
    'Welcome to CSSconf EU 2014, %s!',
    'We are glad to see you, %s!',
    'Look who just arrived: %s is here!',
    "Hello %s, we're happy to have you here!",
    'We are happy to welcome %s at CSSconf EU 2014!',
    'Say hi to %s!',
    'Welcome to our conference, %s!',
    'Please welcome %s to CSSconf EU 2014!'
  ];
  var template = _.template($('#attendee-template').html());
  var $attendees = $('.attendees');
  var initialized = false;

  var tickets = [];

  var hasName = function(ticket) {
    return ticket.first_name && ticket.first_name !== null && ticket.first_name.length > 0;
  };

  var hasEmail = function(ticket) {
    return ticket.email;
  };

  var isCheckedIn = function(ticket) {
    return ticket.checked_in;
  };

  var getCheckins = function() {
    $.getJSON(url, function(data) {
      tickets = data.tickets.filter(hasName).filter(isCheckedIn).filter(hasEmail);

      if (!initialized && tickets.length > 0) {
        greetAttendee();
      }
    });
  };

  var greetAttendee = function() {
    var attendee = _.sample(tickets);
    var greeting = greetingFor(attendee.first_name);
    var gravatar = Gravatar(attendee.email);

    $('.attendee-greeting').remove();
    $(template({gravatar: gravatar, greeting: greeting})).appendTo($attendees);
    initialized = true;
  };

  var greetingFor = function(firstName) {
    var greeting = _.sample(greetings);
    return greeting.replace('%s', firstName);
  };

  getCheckins();
  setInterval(getCheckins, updateEvery * 60 * 1000);
  setInterval(greetAttendee, greetEvery * 60 * 1000);
})
