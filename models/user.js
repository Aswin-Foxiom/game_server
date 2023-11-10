const mongoose = require("mongoose");

// Define the user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is Required"],
    unique: true,
    minlength: 4,
    maxlength: 20,
  },
  name: {
    type: String,
    required: [true, "Name is Required"],
  },
  password: {
    type: String,
    required: [true, "Password is Required"],
  },
  dob: {
    type: Date,
    required: [true, "DOB is Required"],
  },
  interest: {
    type: [String], // This specifies an array of strings
  },
  location: {
    type: { type: String },
    coordinates: [Number],
  },
  image: {
    type: String,
  },
  phonenumber: {
    type: String,
    required: [true, "Phone Number is Required"],
    validate: {
      validator: function (v) {
        // Regular expression to validate a basic phone number format
        return /\d{10}/.test(v);
      },
      message: "Invalid phone number format (e.g., 1234567890)",
    },
  },
});

// Define the 2dsphere index on latitude and longitude
userSchema.index({ location: "2dsphere" });

// Create a User model based on the schema
const User = mongoose.model("User", userSchema);

// Export the User model
module.exports = User;
