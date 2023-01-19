//imports relevant packages
const mongoose = require("mongoose");
const { Schema } = mongoose;

// initialises schema for creation of new song objects 
const myShowsSchema = new Schema(
  {
    // sets names of each field along with their types and any requirements to be met (required field/min length etc) with a relevant message to accompany it 
    title: {type: String, required: [true, 'Title must be entered'], minlength: [1, 'Title not long enough']},
    synopsis: {type: String, required: [true, 'Synopsis must be entered'], minlength: [4, 'Synopsis not long enough, must be at least 4 characters']},
    genre: String,
    progress: String,
    // review vals -1 --> 20, (-1 = no review, 20 = who said reviews had to stop at 10?)
    review: {type: Number, default: 0, min: [-1, 'Review cannot be less than -1 (no review)'], max: [20, 'Review cannot be greater than 20']},
    // currently logged in user is added to link user to their shows and theirs alone
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// exports object
module.exports = mongoose.model("My-Show", myShowsSchema);
