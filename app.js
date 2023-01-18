require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const chalk = require("chalk");
const User = require("./models/User");

/**
 * Controllers (route handlers).
 */
const myShowController = require("./controllers/my-show");
const userController = require("./controllers/user");

const app = express();
app.set("view engine", "ejs");
app.use(express.static( "public" ))

const expressSession = require("express-session");
app.use(expressSession({ secret: 'thisisthesecretkey', cookie: { expires: new Date(253402300000000) } }))

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

global.user = false;
app.use("*", async (req, res, next) => {
  if (req.session.userID && !global.user) {
    const user = await User.findById(req.session.userID);
    global.user = user;
  }
  next();
});

const authMiddleware = async (req, res, next) => {
  const user = await User.findById(req.session.userID);
  if (!user) {
    return res.redirect('/');
  }
  next()
}


app.get("/", myShowController.listHome, (req, res) => {
  res.render("index");
});

app.post("/login", userController.login)
app.get("/login", (req, res) => {
  res.render("login", {errors:{}});
});

app.post("/add-user", userController.create)
app.get("/add-user", (req, res) => {
  res.render("add-user", {errors:{}});
});

app.get("/logout", async (req, res) => {
  req.session.destroy();
  global.user = false;
  res.redirect('/');
});

app.post("/add-show", authMiddleware, myShowController.add)
app.get("/add-show", (req, res) => {
  res.render("add-show", {errors:{}});
});

app.get("/my-shows", authMiddleware, myShowController.list, (req, res) => {
  res.render("my-shows", {errors:{}});
});

app.get("/my-shows/my-shows", authMiddleware, myShowController.list, (req, res) => {
  res.render("my-shows", {errors:{}});
});

app.get("/my-shows/edit/my-shows", authMiddleware, myShowController.list, (req, res) => {
  res.render("my-shows", {errors:{}});
});

app.get("/my-shows", authMiddleware, myShowController.list);
app.get("/my-shows/delete/:id", authMiddleware, myShowController.delete);
app.get("/my-shows/edit/:id", authMiddleware, myShowController.edit);
app.post("/my-shows/edit/:id", authMiddleware, myShowController.update);

// app.get("/tastings", tastingController.list);
// app.get("/tastings/delete/:id", tastingController.delete);


app.listen(WEB_PORT, () => {
  console.log(
    `Example app listening at http://localhost:${WEB_PORT}`,
    chalk.green("✓")
  );
});
