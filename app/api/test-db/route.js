// app/api/test-db/route.js

import mongoose from "mongoose";

const connectToDatabase = async () => {
  const MONGO_URI = process.env.MONGODB_URI; // Ensure you have this variable in your .env file

  if (!MONGO_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local"
    );
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise();
  }

  return mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export async function GET(req) {
  try {
    await connectToDatabase();
    return new Response(JSON.stringify({ message: "Connected to MongoDB" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Connection failed", error: error.message }),
      {
        status: 500,
      }
    );
  }
}
