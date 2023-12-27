const { default: mongoose } = require("mongoose");

const youtubeStatsDataSchema = new mongoose.Schema(
    {
        ytId: String,
        statistics: {
            views: Number,
            likes: Number,
            comments: Number,
        },
    },
    { collection: "YouTubeData" }
);

const youtubeStatsData = mongoose.model(
    "youtubeStatsData",
    youtubeStatsDataSchema
);

module.exports = youtubeStatsData;
