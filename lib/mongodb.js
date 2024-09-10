import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function createOrUpdateUser(userData) {
  try {
    const client = await clientPromise;
    const db = client.db();

    const result = await db
      .collection("users")
      .updateOne(
        { auth0_id: userData.auth0_id },
        { $set: userData },
        { upsert: true }
      );

    if (result.upsertedCount > 0) {
      return {
        message: "User created successfully",
        userId: result.upsertedId,
      };
    } else if (result.modifiedCount > 0) {
      return { message: "User updated successfully" };
    } else {
      return { message: "No changes made to user data" };
    }
  } catch (error) {
    console.error("Error in createOrUpdateUser:", error);
    throw error;
  }
}

export default clientPromise;
