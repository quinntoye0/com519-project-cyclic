// imports relevant models being accessed by this controller
const User = require("../models/User");
const bcrypt = require('bcrypt');

// function to create new user
exports.create = async (req, res) => {
  try {  // attempts to run indented code
    // retrieves email and password from create user form and uses 'User' model to create new user
    let user = new User({email: req.body.email, password: req.body.password});
    // saves user to db collection
    await user.save();
    // redirects user to homepage
    res.redirect(`/`);
  } catch (e) {  // if an error is raised, it is caught and sent to browser/displayed to user
    if (e.errors){
      // error logged in console and message returned to user (if page can still be rendered)
      console.log(e.errors);
      return res.render('create-user', {errors: e.errors});
    }
    return res.status(400).send({message: JSON.parse(e)})
  }
};

// function to authenticate user login
exports.login = async (req, res) => {
  // retrieves user from collection based on email address
  const user = await User.findOne({ email: req.body.email });
  // checks that entered password matches the one retrieved from the db collection
  // uses becrypt to check hashed values
  const match = await bcrypt.compare(req.body.password, user.password);
  // if passwords match:
  if (match) {
    req.session.userID = user._id;  // the user is logged as the session user
    console.log(req.session.userID);  // session userID is logged to console
    res.redirect('/');  // user is redirected to homepage, now logged in
    return
  }
};
