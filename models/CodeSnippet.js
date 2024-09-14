import mongoose from "mongoose";

const CodeSnippetSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    code: {
      type: String,
    },
    language: {
      type: String,

      enum: ["javascript", "typescript", "java", "python"],
    },
    description: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.models.CodeSnippet ||
  mongoose.model("CodeSnippet", CodeSnippetSchema);
