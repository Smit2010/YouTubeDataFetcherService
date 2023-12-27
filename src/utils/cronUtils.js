const API_KEYS = process.env.API_KEYS.split(",");
let queryDate = new Date("2022-08-01").toISOString();
let keyIdx = 0;

const getNextKeyIdx = () => {
    // Using uniformly distributed random function to pick an API_KEY
    // from a pool to avoid quota exhaustion for an individual key.
    return Math.floor(Math.random() * API_KEYS.length);
};

exports.getAndUpdateKey = () => {
    const currApiKey = API_KEYS[keyIdx];
    keyIdx = getNextKeyIdx();
    return currApiKey;
};

exports.updateQueryDate = (date) => {
    queryDate = date;
};

exports.getYTSearchParams = () => {
    try {
        return {
            part: "snippet",
            type: "video",
            maxResults: process.env.CRON_DATA_LIMIT || 50,
            publishedAfter: queryDate,
            order: "date",
            q: "cricket",
            key: this.getAndUpdateKey(),
        };
    } catch (err) {
        throw err;
    }
};
