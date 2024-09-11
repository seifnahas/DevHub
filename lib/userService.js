import User from "@/models/User";
import dbConnect from "@/lib/mongoose";

// Utility function for saving or updating a user
export async function saveOrUpdateUser(profile) {
  await dbConnect(); // Ensure the database is connected

  try {
    // Find the user by their GitHub ID
    let dbUser = await User.findOne({ githubId: profile.id });

    // If the user does not exist, create a new one
    if (!dbUser) {
      dbUser = await User.create({
        name: profile.name || profile.login,
        email: profile.email,
        image: profile.avatar_url,
        githubId: profile.id,
        username: profile.login,
      });
    } else {
      // If the user exists, update their information
      await User.findOneAndUpdate(
        { githubId: profile.id },
        {
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          username: profile.login,
        }
      );
    }

    // Return the user document
    return dbUser;
  } catch (error) {
    console.error("Error saving/updating user:", error);
    throw new Error("Failed to save or update user");
  }
}
