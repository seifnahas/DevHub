import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    image: String,
    githubId: {
      type: String,
      unique: true,
      required: true,
    },
    username: String,
    recentRegexTests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RegexTest",
      },
    ],
    codeSnippets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CodeSnippet",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
