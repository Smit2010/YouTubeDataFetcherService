const {
    getVideoData,
    getVideoDataWithFilters,
} = require("../services/getVideoData");
const { validateAndReturnParameters } = require("../utils");

exports.getVideoDataController = async (req, res) => {
    try {
        const { search, page, limit } = validateAndReturnParameters(req.query);

        const response = await getVideoData(search, page, limit);
        res.status(200).send(response);
    } catch (err) {
        res.status(500).send({ errMsg: err.message });
    }
};

exports.getVideoDataWithFiltersController = async (req, res) => {
    try {
        const { search, page, limit, filter, sort } =
            validateAndReturnParameters(req.query);

        const response = await getVideoDataWithFilters(
            search,
            page,
            limit,
            filter,
            sort
        );
        res.status(200).send(response);
    } catch (err) {
        res.status(500).send({ errMsg: err.message });
    }
};
