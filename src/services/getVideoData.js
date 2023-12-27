const youtubeData = require("../models/youtubeData");
const { getSortQuery } = require("../utils");
const { logError } = require("../utils/logErrors");

exports.getVideoData = async (
    searchQuery = "",
    page = 1,
    limit = process.env.DATA_LIMIT || 10
) => {
    try {
        const query = searchQuery ? { $text: { $search: searchQuery } } : {};
        let response = await youtubeData
            .find(
                query,
                { _id: 0 },
                {
                    sort: { publishedAt: -1 }, //Default sorting based on published date
                    limit: parseInt(limit) + 1, // Using limit + 1 to see if there is more data to be fetched in the next page
                    skip: (parseInt(page) - 1) * parseInt(limit),
                }
            )
            .exec();

        //Setting an indicator for possible pagination
        let hasMoreData = false;
        if (response.length > limit) hasMoreData = true;

        response = response.slice(0, limit);

        return { response, hasMoreData };
    } catch (err) {
        logError(err);
        throw new Error("Error while fetching video data");
    }
};

exports.getVideoDataWithFilters = async (
    searchQuery = "",
    page = 1,
    limit = process.env.DATA_LIMIT || 10,
    filter,
    sortOrder
) => {
    try {
        let response;

        if (searchQuery) {
            // Searching based on custom search index which filters the stop words from search query
            const agg = [
                {
                    $search: {
                        index: "customSearchIndex",
                        text: {
                            query: searchQuery,
                            path: ["title", "description"],
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        title: 1,
                        description: 1,
                        statistics: 1,
                        thumbnails: 1,
                        publishedAt: 1,
                        ytId: 1,
                        score: { $meta: "searchScore" }, // Score indicated search relevance, calculated by search index
                    },
                },
                {
                    $skip: (parseInt(page) - 1) * parseInt(limit),
                },
                {
                    $limit: parseInt(limit) + 1,
                },
                {
                    $sort: getSortQuery(filter, sortOrder),
                },
            ];

            response = await youtubeData.aggregate(agg).exec();
        } else {
            response = await youtubeData
                .find(
                    {},
                    { _id: 0 },
                    {
                        sort: getSortQuery(filter, sortOrder), // Preparing sort query based on requirements
                        limit: parseInt(limit) + 1, // Using limit + 1 to see if there is more data to be fetched in the next page
                        skip: (parseInt(page) - 1) * parseInt(limit),
                    }
                )
                .exec();
        }

        //Setting an indicator for possible pagination
        let hasMoreData = false;
        if (response.length > limit) hasMoreData = true;

        response = response.slice(0, limit);

        return { response, hasMoreData };
    } catch (err) {
        logError(err);
        throw new Error("Error while fetching video data");
    }
};
