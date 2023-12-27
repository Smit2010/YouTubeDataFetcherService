const { configureEnvs } = require("./src/utils/configureEnv");
configureEnvs();

const express = require("express");
const cors = require("cors");
const { connectDb } = require("./src/db/mongo");
const { runFetchJob } = require("./src/schedulers");
const { logError } = require("./src/utils/logErrors");
const router = require("./src/routes");

const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(router);

connectDb()
    .then(() => {
        console.log("Connected to DB");

        // Controlling which device can run the cron service
        if (process.env.RUN_FETCH_CRON === "true") runFetchJob();

        app.listen(port, () => {
            console.log("Server running on port", port, "...");
        });
    })
    .catch((err) => {
        logError(err, "Error while connecting to DB.");
    });
