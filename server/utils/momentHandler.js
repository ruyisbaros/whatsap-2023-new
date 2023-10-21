const moment = require("moment");
exports.dateHandler = (date) => {
  let now = moment();
  let momentDate = moment(date);
  let time = moment(date).fromNow(true);
  const getDay = () => {
    let days = time.split(" ")[0];
    if (Number(days) < 8) {
      return now.subtract(Number(days), "days").format("dddd");
    } else {
      return momentDate.format("DD/MM/YYYY");
    }
  };
  if (time === "a few seconds") {
    return "a few seconds ago";
  }
  if (time.search("minute") !== -1) {
    /* !==-1 means includes*/
    let mins = time.split(" ")[0];
    if (mins === "a") {
      return "1 min ago";
    } else {
      return `${mins} min ago`;
    }
  }
  if (time.search("hour") !== -1) {
    return `Today ${momentDate.format("HH:mm")}`;
  }
  if (time === "a day") {
    return `Yesterday ${momentDate.format("HH:mm")}`;
  }

  if (time.search("days") !== -1) {
    return getDay();
  }

  return time;
};
