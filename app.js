const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const app = express();

// Use Template EJS
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);

// Use body-parser
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));

app.use(methodOverride("_method"));

// Static
app.use(express.static(path.join(__dirname, "/public")));
// Route
app.use("/", require("./routes/index"));
app.use("/authors", require("./routes/authors"));
app.use("/books", require("./routes/books"));

module.exports = app;
