const mongoose = require("mongoose");
const { Schema } = mongoose;

const myShowsSchema = new Schema(
  {
    title: {type: String, required: [true, 'Title must be entered'], minlength: [1, 'Title not long enough']},
    synopsis: {type: String, required: [true, 'Synopsis must be entered'], minlength: [4, 'Synopsis not long enough, must be at least 4 characters']},
    progress: String,
    review: {type: Number, default: 0},
  },
  { timestamps: true }
);

module.exports = mongoose.model("My-Show", myShowsSchema);
