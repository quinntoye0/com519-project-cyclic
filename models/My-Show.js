const mongoose = require("mongoose");
const { Schema } = mongoose;

const myShowsSchema = new Schema(
  {
    title: {type: String, required: [true, 'Title must be entered'], minlength: [1, 'Title not long enough']},
    synopsis: {type: String, required: [true, 'Synopsis must be entered'], minlength: [4, 'Synopsis not long enough, must be at least 4 characters']},
    genre: String,
    progress: String,
    // review vals -1 --> 20, (-1 = no review, 20 = who said reviews had to stop at 10?)
    review: {type: Number, default: 0, min: [-1, 'Review cannot be less than -1 (no review)'], max: [20, 'Review cannot be greater than 20']},
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("My-Show", myShowsSchema);
