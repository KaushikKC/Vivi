const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  postId: String,
  creatorAddress: String,
  ipfsHash: String,
  transcription: String,
  bountyAmount: Number,
  bountyToken: String,
  isAnonymous: Boolean,
  status: String,
  createdAt: { type: Date, default: Date.now },
  tags: [String],
  lensPostId: String,
  postType: {
    type: String,
    enum: ["text", "voice", "anonymousVoice"],
    required: true,
  },
  content: String, // for text posts
  audioMetadata: {
    originalFileName: String,
    mimeType: String,
    size: Number,
    duration: Number,
  },
});

module.exports = mongoose.model("Post", PostSchema);
