const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

const db = mongoose.connection;
db.once("open", () => console.log("MongoDB is connected .... "));
db.once("error", () => console.log("Error occured whiling conneting with DB"));
