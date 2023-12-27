const { default: mongoose } = require("mongoose");

const youtubeDataSchema = new mongoose.Schema(
    {
        ytId: {
            type: String,
            index: true,
        },
        title: {
            type: String,
        },
        description: {
            type: String,
        },
        publishedAt: {
            type: String,
            index: true,
        },
        thumbnails: {
            defaultUrl: String,
            mediumUrl: String,
            highUrl: String,
        },
    },
    { collection: "YouTubeData" }
);

youtubeDataSchema.index({ title: "text", description: "text" });

const youtubeData = mongoose.model("youtubeData", youtubeDataSchema);

module.exports = youtubeData;
