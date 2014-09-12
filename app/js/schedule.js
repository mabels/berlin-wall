$(function() {
  var checkForNewItemEvery = 60;
  var $scheduleItems = $('.schedule-item');

  var hideAllScheduleItems = function() {
    $scheduleItems.hide();
  };

  var dateTimeFor = function($item) {
    return parseInt($item.attr('date-time'), 10);
  };

  var findNextScheduleItem = function() {
    var now = new Date;
    var minutes = now.getMinutes();
    if (minutes < 10) {
      minutes = '0' + minutes;
    }

    var timestamp = parseInt(now.getHours() + '' + minutes, 10);
    var $dueItem;

    $scheduleItems.each(function() {
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

  var showNextScheduleItem = function() {
    var $nextScheduleItem = findNextScheduleItem();
    if ($nextScheduleItem.length !== 0) {
      hideAllScheduleItems();
      $nextScheduleItem.show();
    }
  };

  hideAllScheduleItems();
  showNextScheduleItem();
  setInterval(showNextScheduleItem, checkForNewItemEvery * 1000);
});
