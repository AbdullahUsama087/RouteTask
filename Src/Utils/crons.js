import { RecurrenceRule, scheduleJob } from "node-schedule";

//  ============== Date based scheduler =================
const cronOne = () => {
  scheduleJob("1 * * * * *", function () {
    console.log("Cron Job runs in the first second");
  });
};

const cronTwo = () => {
  scheduleJob("*/10 * * * * *", function () {
    console.log("Cron Job runs every 10 seconds");
  });
};

const cronThree = () => {
  scheduleJob({ hour: 22, dayOfWeek: 1, minute: 2, second: 30 }, function () {
    console.log("Cron runs in 10:02:30 PM");
  });
};

//===================== Recurence rule ================

const rule = new RecurrenceRule();
rule.dayOfWeek = 1;
rule.hour = 22;
rule.minute = 5;
rule.second = 30;

const cronFour = () => {
  scheduleJob(rule, function () {
    console.log("Recurrence rule from Cron Job");
  });
};

export { cronOne, cronTwo, cronThree, cronFour };
