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

// exports.list = async (req, res) => {
//   const perPage = 10;
//   const limit = parseInt(req.query.limit) || 10; // Make sure to parse the limit to number
//   const page = parseInt(req.query.page) || 1;



//   try {
//     const tastings = await Tasting.find({}).skip((perPage * page) - perPage).limit(limit);
//     const count = await Tasting.find({}).count();
//     const numberOfPages = Math.ceil(count / perPage);

//     res.render("tastings", {
//       tastings: tastings,
//       numberOfPages: numberOfPages,
//       currentPage: page
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(404).send({ message: "could not list tastings" });
//   }
// };

// exports.delete = async (req, res) => {
//   const id = req.params.id;
//   try {
//     await Tasting.findByIdAndRemove(id);
//     res.redirect("/tastings");
//   } catch (e) {
//     res.status(404).send({
//       message: `could not delete  record ${id}.`,
//     });
//   }
// };
