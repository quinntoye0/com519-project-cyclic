// imports required packages and files
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const chalk = require("chalk");
const User = require("./models/User");

// Controllers (route handlers)
const myShowController = require("./controllers/my-show");
const userController = require("./controllers/user");

// initialises express, sets view engine and statics (public folder (images/css etc)
const app = express();
app.set("view engine", "ejs");
app.use(express.static( "public" ))

// imports and initialises 'express-session', which as the name suggests, allows for sessions attributes to be used with express
const expressSession = require("express-session");
app.use(expressSession({ secret: 'thisisthesecretkey', cookie: { expires: new Date(253402300000000) } }))

/**
 * notice above we are using dotenv. We can now pull the values from our environment
*/
// sets up links to web port and mongodb
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

// sets up further links between express and public directory
app.use(express.static(path.join(__dirname, "public")));

// sets up bodyParser to provide more information on requests (e.g POST/GET etc)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// grabs curernt user and sets it up as a global variable allowing it to be easily accessed by any file by simply referencing 'user'
global.user = false;
app.use("*", async (req, res, next) => {
  if (req.session.userID && !global.user) {
    const user = await User.findById(req.session.userID);
    global.user = user;
  }
  next();
});

// middleware used for authentication
// locks down sections of the site to be only accessible when logged in to an account
const authMiddleware = async (req, res, next) => {
  const user = await User.findById(req.session.userID);
  if (!user) {
    return res.redirect('/');
  }
  next()
};

// sets index.ejs as the home destination
app.get("/", myShowController.listHome, (req, res) => {
  res.render("index");
});

// when posting to 'login', function 'login' from user controller is called to process data
app.post("/login", userController.login)
// when a request is lodged for '/login', the 'login' view is rendered, passing any errors through with it
app.get("/login", (req, res) => {
  res.render("login", {errors:{}});
});

// see comments ref log in for identical theory
app.post("/add-user", userController.create)
app.get("/add-user", (req, res) => {
  res.render("add-user", {errors:{}});
});

// when a logout request is raised, the current session is destroyed, removing the session user, and redirecting the user to the hompage
app.get("/logout", async (req, res) => {
  req.session.destroy();
  global.user = false;
  res.redirect('/');
});

// identical theory to login post/render, adding in authentication as mentioned above (only logged in users can access this page)
app.post("/add-show", authMiddleware, myShowController.add)
app.get("/add-show", authMiddleware, (req, res) => {
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
app.get("/my-shows/logout", async(req, res) => {
  req.session.destroy();
  global.user = false;
  res.redirect('/');
});
app.get("/my-shows/edit/logout", async(req, res) => {
  req.session.destroy();
  global.user = false;
  res.redirect('/');
});
// various 'my-shows' functions called from  controller when get requests for these pages are sent
app.get("/my-shows", authMiddleware, myShowController.list);
app.get("/my-shows/delete/:id", authMiddleware, myShowController.delete);
app.get("/my-shows/edit/:id", authMiddleware, myShowController.edit);
app.post("/my-shows/edit/:id", authMiddleware, myShowController.update);

// initialises page at the location designated by 'WEB_PORT' (2020), and posts message to console
app.listen(WEB_PORT, () => {
  console.log(
    `Example app listening at http://localhost:${WEB_PORT}`,
    chalk.green("✓")
  );
});
