import mongoose from "mongoose";
import Movie from "./src/models/Movie.js";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const movies = await Movie.find({}).lean();
    console.log(`Found ${movies.length} movies`);
    
    if (movies.length > 0) {
      console.log("\nFirst 3 movies (full):");
      movies.slice(0, 3).forEach((m) => {
        console.log(JSON.stringify(m, null, 2));
      });
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

connectDB();
