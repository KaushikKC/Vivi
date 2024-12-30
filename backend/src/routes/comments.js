const express = require("express");
const router = express.Router();
const multer = require("multer");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const ipfs = require("../config/ipfs");
const authMiddleware = require("../middleware/auth");

// Multer configuration for voice comments
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

// Create comment (supports both text and voice)
router.post(
  "/:postId/comments",
  authMiddleware,
  upload.single("voice"),
  async (req, res) => {
    try {
      const { type, content: textContent } = req.body;
      const postId = req.params.postId;
      let content = {};

      // Validate post exists
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({
          status: "error",
          message: "Post not found",
        });
      }

      // Handle TEXT comments
      if (type === "TEXT") {
        if (!textContent) {
          return res.status(400).json({
            status: "error",
            message: "Content is required for text comments",
          });
        }
        content.text = textContent;
      }
      // Handle VOICE comments
      else if (type === "VOICE") {
        if (!req.file) {
          return res.status(400).json({
            status: "error",
            message: "Voice file is required for voice comments",
          });
        }
        content.voice = {
          data: req.file.buffer,
          contentType: req.file.mimetype,
          fileName: req.file.originalname,
          fileSize: req.file.size,
        };
      } else {
        return res.status(400).json({
          status: "error",
          message: "Invalid comment type",
        });
      }

      // Create metadata
      const metadata = {
        type: type || "TEXT",
        author: req.walletAddress,
        timestamp: Date.now(),
        ...(type === "VOICE" && {
          fileName: content.voice?.fileName,
          fileSize: content.voice?.fileSize,
          contentType: content.voice?.contentType,
        }),
      };

      // Prepare IPFS content
      const ipfsContent = {
        content: type === "TEXT" ? content.text : undefined,
        metadata,
      };

      // Upload to IPFS
      const result = await ipfs.add(JSON.stringify(ipfsContent));

      // Create comment
      const comment = new Comment({
        postId,
        content,
        contentHash: result.path,
        commentType: type,
        creatorAddress: req.walletAddress,
        metadata,
        likes: [],
        dislikes: [],
      });

      await comment.save();

      // Update post comment count
      await Post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });

      res.json({
        contentHash: result.path,
        commentId: comment._id,
        status: "success",
      });
    } catch (error) {
      console.error("Comment creation error:", error);
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
);

// Get comments for a post
router.get("/:postId/comments", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });

    res.json({
      status: "success",
      comments,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// Get voice comment content
router.get("/comments/:commentId/voice", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment || comment.commentType !== "VOICE" || !comment.content.voice) {
      return res.status(404).json({
        status: "error",
        message: "Voice content not found",
      });
    }

    res.set("Content-Type", comment.content.voice.contentType);
    res.send(comment.content.voice.data);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// Toggle like/dislike for post or comment (unchanged)
router.post("/:id/reaction", authMiddleware, async (req, res) => {
  try {
    const { type, isPost } = req.body;
    const id = req.params.id;
    const userAddress = req.walletAddress;

    const Model = isPost ? Post : Comment;
    const item = await Model.findById(id);

    if (!item) {
      return res.status(404).json({
        status: "error",
        message: isPost ? "Post not found" : "Comment not found",
      });
    }

    item.likes = item.likes.filter((address) => address !== userAddress);
    item.dislikes = item.dislikes.filter((address) => address !== userAddress);

    if (type === "like") {
      item.likes.push(userAddress);
    } else if (type === "dislike") {
      item.dislikes.push(userAddress);
    }

    await item.save();

    res.json({
      status: "success",
      likes: item.likes.length,
      dislikes: item.dislikes.length,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

module.exports = router;
