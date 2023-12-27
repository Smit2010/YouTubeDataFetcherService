const cron = require("node-cron");
const { fetchYTData } = require("../services/fetchYTData");

const fetchFrequency = process.env.FETCH_FREQUENCY || "* * * * *";

exports.runFetchJob = () => {
    // Cron to fetch youtube video metadata on a regular interval, defaulted to every minute.
    cron.schedule(fetchFrequency, fetchYTData);
};
