// imports relevant packages
const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require('bcrypt');  // used to hash passwords

// initialises schema for creation of new user objects 
const userSchema = new Schema(
  {
    // sets names of each field along with their types and any requirements to be met (required field/min length etc) with a relevant message to accompany it 
      email: { type: String, required: [true, 'email is required'], unique: true },
      password: { type: String, required: [true, 'password is required'] }
  },
  { timestamps: true }
);

// before object is saved, this section of code is ran to attempt the hashing of the password for security
userSchema.pre('save', async function (next) {
  // logs password to console
  console.log(this.password);
  try {  // attempts to hash password
      const hash = await bcrypt.hash(this.password, 10);
      this.password = hash;
      next();
  } catch (e) {  // error is caught and thrown if password cannot be hashed
      throw Error('could not hash password');
  }
})
// exports object
module.exports = mongoose.model("User", userSchema);
