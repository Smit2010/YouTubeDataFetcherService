const mongoose = require("mongoose");

const mongodb_url = process.env.MONGO_URI;

exports.connectDb = () => {
    return mongoose.connect(mongodb_url, {
        useNewUrlParser: true,
        dbName: process.env.DB_NAME || "dev",
        useUnifiedTopology: true,
    });
};
