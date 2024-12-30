const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    contentHash: {
      type: String,
      required: true,
    },
    content: {
      text: {
        type: String,
      },
      voice: {
        data: Buffer, // For storing binary voice data
        contentType: String, // For MIME type
        fileName: String,
        fileSize: Number,
      },
    },
    commentType: {
      type: String,
      enum: ["TEXT", "VOICE"],
      required: true,
    },
    creatorAddress: {
      type: String,
      required: true,
      lowercase: true,
    },
    metadata: {
      type: Object,
      required: true,
    },
    likes: [
      {
        type: String, // wallet addresses
        lowercase: true,
      },
    ],
    dislikes: [
      {
        type: String, // wallet addresses
        lowercase: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Validate that either text or voice content is present based on commentType
commentSchema.pre("save", function (next) {
  if (this.commentType === "TEXT" && !this.content.text) {
    next(new Error("Text content is required for TEXT comments"));
  } else if (this.commentType === "VOICE" && !this.content.voice.data) {
    next(new Error("Voice content is required for VOICE comments"));
  } else {
    next();
  }
});

module.exports = mongoose.model("Comment", commentSchema);
