const youtubeData = require("../models/youtubeData");
const youtubeStatsData = require("../models/youtubeStatsData");
const { updateQueryDate } = require("./cronUtils");
const { logError } = require("./logErrors");

exports.saveDataToDb = async (data) => {
    try {
        const { items } = data;
        let ytIdStr = "";

        let bulkWriteOps = [];

        if (items.length > 0) {
            for (let idx = 0; idx < items.length; idx++) {
                const {
                    snippet: { title, description, publishedAt, thumbnails },
                    id: { videoId },
                } = items[idx];

                if (idx === 0) {
                    // Updating date to the latest published date for the next cron cycle, to avoid repetive data
                    const queryDate = new Date(publishedAt).toISOString();
                    updateQueryDate(queryDate);
                }

                // Constructing query string of youtube videoIds to fetch statistics of the video
                ytIdStr += `&id=${videoId}`;

                const newYoutubeData = {
                    title: title,
                    description: description,
                    publishedAt: publishedAt,
                    thumbnails: {
                        defaultUrl: thumbnails.default.url,
                        mediumUrl: thumbnails.medium.url,
                        highUrl: thumbnails.high.url,
                    },
                    ytId: videoId,
                };

                bulkWriteOps.push({
                    updateOne: {
                        filter: { ytId: videoId },
                        update: {
                            $set: newYoutubeData,
                        },
                        upsert: true,
                    },
                });
            }
        }

        if (bulkWriteOps.length > 0) {
            // Bulk write of the data fetched to improve write efficiency and db overhead
            await youtubeData.bulkWrite(bulkWriteOps);
            bulkWriteOps = [];
        }
        return ytIdStr;
    } catch (err) {
        logError(err, "DB Save Error");
    }
};

exports.saveStatsToDb = async (data) => {
    try {
        const { items } = data;

        let bulkWriteOps = [];

        if (items.length > 0) {
            for (let idx = 0; idx < items.length; idx++) {
                const {
                    statistics: { viewCount, likeCount, commentCount },
                    id,
                } = items[idx];

                const updateObj = {
                    "statistics.views": viewCount ? parseInt(viewCount) : 0,
                    "statistics.likes": likeCount ? parseInt(likeCount) : 0,
                    "statistics.comments": commentCount
                        ? parseInt(commentCount)
                        : 0,
                };

                bulkWriteOps.push({
                    updateOne: {
                        filter: { ytId: id },
                        update: {
                            $set: updateObj,
                        },
                    },
                });
            }
        }

        if (bulkWriteOps.length > 0) {
            // Bulk write of the data fetched to improve write efficiency and db overhead
            await youtubeStatsData.bulkWrite(bulkWriteOps);
            bulkWriteOps = [];
        }
    } catch (err) {
        logError(err, "DB Stats Save Error");
    }
};
