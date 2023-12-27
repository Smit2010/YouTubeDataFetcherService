const { default: axios } = require("axios");
const { getYTSearchParams, getAndUpdateKey } = require("../utils/cronUtils");
const { logError } = require("../utils/logErrors");
const { saveDataToDb, saveStatsToDb } = require("../utils/saveToDb");

const BASE_URL = "https://www.googleapis.com/youtube/v3";

exports.fetchYTData = async () => {
    console.log("Fetch Cron Start", new Date().toISOString());
    axios
        .get(`${BASE_URL}/search`, {
            params: getYTSearchParams(),
        })
        .then(async (res) => {
            const ytIdStr = await saveDataToDb(res.data);
            if (ytIdStr !== "") {
                // Fetching video statistics for sort and filtering data
                await fetchYTStatsData(ytIdStr);
            }
            console.log("Fetch Cron End", new Date().toISOString());
        })
        .catch((err) => {
            logError(err, "Fetch Cron End");
        });
};

const fetchYTStatsData = async (ytIdStr) => {
    axios
        .get(
            `${BASE_URL}/videos?${ytIdStr}&part=statistics&key=${getAndUpdateKey()}`
        )
        .then((res) => {
            saveStatsToDb(res.data);
        })
        .catch((err) => {
            logError(err);
        });
};
