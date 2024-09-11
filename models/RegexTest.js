import mongoose from "mongoose";

const RegexTestSchema = new mongoose.Schema({
  regex: {
    type: String,
    required: true,
  },
  testString: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.models.RegexTest ||
  mongoose.model("RegexTest", RegexTestSchema);
