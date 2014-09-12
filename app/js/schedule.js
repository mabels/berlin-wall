$(function() {
  $(".info-wall").css("border", "5px solid "+$("[data-border-color]")[0].getAttribute("data-border-color"));
  $(".item-time").css("border", "1px solid "+$("[data-border-color]")[0].getAttribute("data-border-color"));
  $(".item-time").css("color", $("[data-border-color]")[0].getAttribute("data-border-color"));
  var checkForNewItemEvery = 1;
  var currentDate = (new Date(2014,8,13,7,32,32))
  var createDate = function() {
    return currentDate;
  }
  var scheduleItems = function(csstrack) {
    var now = createDate()
    return $('.schedule-buffer [data-track='+csstrack+'] .schedule-item[data-date='+(now.getMonth()+1)+now.getDate()+now.getFullYear()+']');
  }

  var dateTimeFor = function($item) {
    return parseInt($item[0].getAttribute('data-time'), 10);
  };

  var findNextScheduleItem = function(csstrack) {
    var now = createDate()
    var minutes = now.getMinutes();
    if (minutes < 10) {
      minutes = '0' + minutes;
    }

    var timestamp = parseInt(now.getHours() + '' + minutes, 10);
    var $dueItem;

    scheduleItems(csstrack).each(function() {
      var $item = $(this);
      var dateTime = dateTimeFor($item);

      if (dateTime < timestamp) {
        return;
      }

      if (!$dueItem) {
        $dueItem = $item;
        return;
      }

      if ((dateTimeFor($dueItem) - timestamp) > (dateTimeFor($item) - timestamp)) {
        $dueItem = $item;
      }
    });

    return $dueItem;
  };

  var count = 0;
  var getBackendData = function() {
    console.log("Backend-Call")
    var jsonpee = $("[data-jsonpee]")[0].getAttribute("data-jsonpee");
    var last
    var urls  = $("[data-backend-urls]")[0].getAttribute("data-backend-urls").split(" ");
    $('.schedule-buffer').remove();
    $("body").append('<div class="schedule-buffer"></div>')
    doc = $(".schedule-buffer")
    for(var i = 0; i < urls.length; ++i) {
      var url = jsonpee + "/" + escape(urls[i].split("://").join("/"))
      window.gotData = function(data) {
        var rows = data.split("\n")
        for(var r = 0; r < rows.length; ++r) {
          cols = rows[r].replace(/"([^"]+)"/g, function(match, part) {
            return part.replace(/,/g, '&#44;')
            }).split(',');

          time = cols[0].replace(/"/g, '')
          if (time) {
            if (cols.length == 12) {
              var track = "Pause"; 
              var date = cols[10]
              var speaker = ""
              var title = cols[5]
            } else {
              var track = cols[9]
              var date = cols[8]
              var speaker = cols[4]
              var title = cols[5]
            }
            var duration = cols[1]
            var css_track = track.replace(/[^a-zA-Z]/g, '')
            var track_div = $('.schedule-buffer [data-track='+css_track+']')
            if (!track_div.length) {
              doc.append('<div data-track="'+css_track+'"></div>')
              var track_div = $('.schedule-buffer [data-track='+css_track+']')
            }
            if (date) {
              track_div.append('<div class="info-wall-item schedule-item" data-time="'+time.replace(/\./g,'')+'" data-date="'+date.replace(/^0/, '').replace(/\//g,'')+'">'+
                  '<h4 class="item-time">'+time+'</h4>'+
                  '<h2 class="item-title">'+track+":"+title+'</h2>'+
                  '</div>')
            }
          }
        }
      }
      $.ajax({
          url: url,
          dataType: 'jsonp',
          async: false,
          jsonpCallback: 'gotData'
      });
    }
  }



  var showNextScheduleItem = function() {
    var items = {};
    var items_count = 0;
    $('.schedule-buffer [data-track]').each(function() {
      var css_track = $(this).data('track');
      if (!css_track) { return }
      ++items_count;
      items[css_track] = findNextScheduleItem(css_track);
    });
    if (items_count) {
      $('#schedule .schedule-item').remove();
      var sorter = []
      for (var item in items) {
        if (item == "Pause") {
          continue;
        }
        sorter.push(item);
      }
      sorter = sorter.sort();
      sorter.push("Pause")
      for(var i = 0; i < sorter.length; ++i) {
        $("#schedule").append(items[sorter[i]].clone()); 
      }
    }
  };

  showNextScheduleItem();
  // TEST
  setInterval(function() { 
    currentDate = new Date(currentDate.getTime()+1000*300) 
    $('body')[0].setAttribute('date-now', currentDate.toString());
  }, checkForNewItemEvery * 999);
  // TEST
  getBackendData();
  //setInterval(getBackendData, checkForNewItemEvery * 1000);
  setInterval(showNextScheduleItem, checkForNewItemEvery * 1000);
  setTimeout(window.location.reload, 60*60*1000);
});
