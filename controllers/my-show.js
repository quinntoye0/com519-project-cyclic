// imports relevant models being accessed by this controller
const MyShow = require("../models/My-Show");
const User = require("../models/User");

// function to retrieve all data in 'my-shows' db collection
exports.list = async (req, res) => {
  try {  // attempts to run indented code
    // grabs all data from 'my-shows' collection
    const myShows = await MyShow.find({});
    // renders 'my-shows' view with data retrieved along with a message if one is passed in
    res.render("my-shows", { myShows: myShows, message:req.query?.message });
  } catch (e) {  // if an error is raised, it is caught and sent to browser/displayed to user
    res.status(404).send({ message: "could not list myShows" });
  }
};

// identical function to above with one difference - page rendered is the homepage 'index'
exports.listHome = async (req, res) => {
  try {
    const myShows = await MyShow.find({});
    res.render("index", { myShows: myShows, message:req.query?.message });
  } catch (e) {
    res.status(404).send({ message: "could not list myShows" });
  }
};

exports.findItem = async (req, res) => {
  try {
    const show = await MyShow.findById(id);
    res.render('/', {show: show, id: id, errors: {}});
  } catch (e) {
    res.status(404).send({ message: "could not list myShows" });
  }
} 

// function to delete individual record from collection
exports.delete = async (req, res) => {
  // retrieves ID passed in
  const id = req.params.id;
  try {  // attempts to run indented code
    // finds and removes item with identical ID to that which is passed in
    await MyShow.findByIdAndRemove(id);
    // 'my-shows' view is rendered and user is redirected to it
    res.redirect("/my-shows");
  } catch (e) {  // if an error is raised, it is caught and sent to browser/displayed to user
    res.status(404).send({
      message: `could not delete  record ${id}.`,
    });
  }
};

// function to create new data in db collection
exports.add = async (req, res) => {  
  try {  // attempts to run indented code
    // retrieves new user inputted data from form and creates new show object with that data
    let show = new MyShow({
      title: req.body.title, 
      synopsis: req.body.synopsis, 
      genre: req.body.genre, 
      progress: req.body.progress, 
      review: req.body.review, 
      user_id: req.session.userID
    })
    // saves new object to collection
    await show.save();
    // renders 'my-shows' view with a success message and redirects user to page
    res.redirect(`/my-shows/?message=${req.body.title} has been added`);
  } catch (e) {  // if an error is raised, it is caught and sent to browser/displayed to user
    if (e.errors){
      // error logged in console and message returned to user (if page can still be rendered)
      console.log(e.errors);
      return res.render('add-show', {errors: e.errors});
    }
    return res.status(400).send({message: JSON.parse(e)})
  }
};

// functions for rendering 'edit-shows' view with relevant data
exports.edit = async (req, res) => {
  // retrieves ID passed in
  const id = req.params.id;
  try {  // attempts to run indented code
    // finds item with identical ID to that which is passed in
    const show = await MyShow.findById(id);
    // renders 'edit-show' view with data of show retrieved to prepopulate form for user
    res.render('edit-show', {show: show, id: id, errors: {}});
  } catch (e) {  // if an error is raised, it is caught and sent to browser/displayed to user
    res.status(404).send({
      message: `could not find show ${id}.`,
    });
  }
};

// functions for editing/updating data in db collection
exports.update = async (req, res) => {
  // retrieves ID passed in
  const id = req.params.id;
  try {  // attempts to run indented code
    // updates show with identical id to that passed in
    await MyShow.updateOne({_id:id}, req.body);
    // retrieves show with identical id to grab new show title (in case it was part of the data edited) 
    // and sends it to the re-render of 'my-sows' view as a message
    const show = await MyShow.findById(id);
    res.redirect(`/my-shows/?message=${show.title} has been updated`);
  } catch (e) {  // if an error is raised, it is caught and sent to browser/displayed to user
    if (e.errors){
      // error logged in console and message returned to user (if page can still be rendered)
      console.log(e.errors);
      return res.render('edit-show', {errors: e.errors});
    }
    res.status(404).send({
      message: `could not edit show ${id}.`,
    });
  }
};
