const MyShow = require("../models/My-Show");

exports.list = async (req, res) => {
  try {
    const myShows = await MyShow.find({});
    res.render("my-shows", { myShows: myShows, message:req.query?.message });
  } catch (e) {
    res.status(404).send({ message: "could not list tasters" });
  }
};



exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    await MyShow.findByIdAndRemove(id);
    res.redirect("/my-shows");
  } catch (e) {
    res.status(404).send({
      message: `could not delete  record ${id}.`,
    });
  }
};

exports.add = async (req, res) => {
  
  try {
    let show = new MyShow({title: req.body.title, synopsis: req.body.synopsis, progress: req.body.progress, review: req.body.review})
    await show.save();
    res.redirect(`/my-shows/?message=${req.body.title} has been added`);
  } catch (e) {
    if (e.errors){
      console.log(e.errors);
      return res.render('add-show', {errors: e.errors});
    }
    return res.status(400).send({message: JSON.parse(e)})
  }
};

exports.edit = async (req, res) => {
  const id = req.params.id;
  try {
    const show = await MyShow.findById(id);
    res.render('edit-show', {show: show, id: id, errors: {}});
  } catch (e) {
    res.status(404).send({
      message: `could not find show ${id}.`,
    });
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    await MyShow.updateOne({_id:id}, req.body);
    const show = await MyShow.findById(id);
    res.redirect(`/my-shows/?message=${show.title} has been updated`);

  } catch (e) {
    if (e.errors){
      console.log(e.errors);
      return res.render('edit-show', {errors: e.errors});
    }
    res.status(404).send({
      message: `could not edit show ${id}.`,
    });
  }
}
