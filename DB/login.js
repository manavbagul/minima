const mongoose = require("mongoose");
require("dotenv").config();

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  dateofbirth: { type: Date, required: true },
  gender: { type: String, required: true },
});

User = mongoose.model("users", userSchema);

async function registerUser(userdata) {
  try {
    await mongoose.connect(process.env.URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    const newUser = new User({
      ...userdata,
    });
    const user = await newUser.save();
    console.log("User saved successfully:", user);
  } catch (err) {
    console.error("Error saving user:", err);
  }
}

async function signInUser(email, password, callback) {
  try {
    // Connect to MongoDB if not already connected (assuming separate connection logic)
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.URI);
    }

    const user = await User.findOne({ email });

    // Successful sign-in
    console.log(user, email, password);
    if (user.password == password) {
      callback(true, user.firstname);
    } else {
      callback(false);
    }
    return { user: { _id: user._id, email: user.email } }; // Return only necessary user data (excluding sensitive fields)
  } catch (err) {
    console.error("Error signing in user:", err);
    return { error: "Unexpected error" };
  }
}

exports.signInUser = signInUser;
exports.registerUser = registerUser;
