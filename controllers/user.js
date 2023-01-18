const User = require("../models/User");
const bcrypt = require('bcrypt');

exports.create = async (req, res) => {
  
  try {
    let user = new User({email: req.body.email, password: req.body.password})
    await user.save();
    res.redirect(`/`);
  } catch (e) {
    if (e.errors){
      console.log(e.errors);
      return res.render('create-user', {errors: e.errors});
    }
    return res.status(400).send({message: JSON.parse(e)})
  }
};

exports.login = async (req, res) => {
         
  const user = await User.findOne({ email: req.body.email });
  
  const match = await bcrypt.compare(req.body.password, user.password);
 
 if (match) {
       req.session.userID = user._id;
      console.log(req.session.userID);
      res.redirect('/');
      return
  }
};
