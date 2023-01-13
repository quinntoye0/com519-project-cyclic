require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const chalk = require("chalk");

/**
 * Controllers (route handlers).
 */
const myShowController = require("./controllers/my-show");
const tastingController = require("./controllers/tasting");

const app = express();
app.set("view engine", "ejs");
app.use(express.static( "public" ))

/**
 * notice above we are using dotenv. We can now pull the values from our environment
 */

const { WEB_PORT, MONGODB_URI } = process.env;

/**
 * connect to database
 */

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
mongoose.connection.on("error", (err) => {
  console.error(err);
  console.log(
    "MongoDB connection error. Please make sure MongoDB is running.",
    chalk.red("✗")
  );
  process.exit();
});

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.get("/", (req, res) => {
  res.render("index");
});




app.post("/add-show", myShowController.add)
app.get("/add-show", (req, res) => {
  res.render("add-show", {errors:{}});
})

app.get("/my-shows", myShowController.list);
app.get("/my-shows/delete/:id", myShowController.delete);
app.get("/my-shows/edit/:id", myShowController.edit);
app.post("/my-shows/edit/:id", myShowController.update);

app.get("/tastings", tastingController.list);
app.get("/tastings/delete/:id", tastingController.delete);


app.listen(WEB_PORT, () => {
  console.log(
    `Example app listening at http://localhost:${WEB_PORT}`,
    chalk.green("✓")
  );
});
