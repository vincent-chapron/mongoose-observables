var mongoose = require("mongoose");

if (!process.env.DB_MONGODB_TEST) {
    throw new Error("You have to define 'DB_MONGODB_TEST' environment variable."); }

mongoose.connect(process.env.DB_MONGODB_TEST);
