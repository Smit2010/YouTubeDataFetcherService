const express = require("express");
const {
    getVideoDataController,
    getVideoDataWithFiltersController,
} = require("../controllers/videoData");

const router = new express.Router();

router.get("/get-videos", getVideoDataController);
router.get("/get-videos-with-filters", getVideoDataWithFiltersController);

module.exports = router;
