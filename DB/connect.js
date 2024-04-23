const mongoose = require("mongoose");
require("dotenv").config();

async function connectToDatabase() {
  try {
    // Connect Mongoose to the same database
    await mongoose.connect(process.env.URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB Atlas with Mongoose!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectToDatabase();
