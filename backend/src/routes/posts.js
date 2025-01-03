const express = require("express");
const router = express.Router();
const multer = require("multer");
const { ethers } = require("ethers");
const Post = require("../models/Post");

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    // Accept only audio files
    if (file.mimetype.startsWith("audio/")) {
      cb(null, true);
    } else {
      cb(new Error("Only audio files are allowed!"), false);
    }
  },
});

/**
 * @route POST /api/posts
 * @desc Upload content to IPFS and return hash
 * @access Private
 */
router.post("/", upload.single("voice"), async (req, res) => {
  try {
    const {
      type,
      author,
      content: textContent,
      postId,
      isAnonymous,
      timestamp,
      metadataHash,
    } = req.body;
    let content = {};

    // Handle TEXT posts
    if (type === "TEXT") {
      if (!textContent) {
        return res.status(400).json({
          status: "error",
          message: "Content is required for text posts",
        });
      }
      content.text = textContent;
    } else if (type === "VOICE") {
      if (!req.file) {
        return res.status(400).json({
          status: "error",
          message: "Voice file is required for voice posts",
        });
      }
      content.voice = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        fileName: req.file.originalname,
        fileSize: req.file.size,
      };
    }

    // Create post
    const post = new Post({
      content,
      contentHash: metadataHash,
      postType: type || "TEXT",
      creatorAddress: author,
      status: "ACTIVE",
      bountyAmount: "0",
      bountyToken: ethers.ZeroAddress,
      postId: postId, // You'll need to implement generateUniqueId
      isAnonymous: isAnonymous || false,
      timestamp: timestamp || Date.now(),
    });

    await post.save();

    res.json({
      contentHash: metadataHash,
      postId: post.postId,
      status: "success",
    });
  } catch (error) {
    console.error("IPFS upload error:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

/**
 * @route POST /api/posts/:postId/bounty
 * @desc Add bounty to post
 * @access Private
 */
router.post("/:postId/bounty", async (req, res) => {
  try {
    const { bountyAmount, bountyToken, metadataHash } = req.body;

    // Validate input
    if (!bountyAmount || !ethers.utils.isAddress(bountyToken)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid bounty amount or token address",
      });
    }

    // Find post in database
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({
        status: "error",
        message: "Post not found",
      });
    }

    // Update post with bounty information
    post.bountyAmount = bountyMetadata.bountyAmount;
    post.bountyToken = bountyToken;
    post.bountyMetadata = bountyMetadata;
    post.bountyContentHash = result.path;
    post.hasBounty = true;
    post.bountyStatus = "OPEN";

    await post.save();

    res.json({
      contentHash: metadataHash,
      status: "success",
      bountyMetadata,
    });
  } catch (error) {
    console.error("Bounty addition error:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

/**
 * @route PUT /api/posts/:postId/bounty-status
 * @desc Update bounty status
 * @access Private
 */
router.put("/:postId/bounty-status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["OPEN", "CLOSED"].includes(status)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid bounty status. Must be either OPEN or CLOSED",
      });
    }

    const post = await Post.findOne({ postId: req.params.postId });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (!post.hasBounty) {
      return res.status(400).json({ error: "Post does not have a bounty" });
    }

    if (post.creatorAddress !== req.walletAddress) {
      return res.status(403).json({ error: "Not authorized" });
    }

    post.bountyStatus = status;
    await post.save();

    res.json({
      success: true,
      message: `Bounty status updated to ${status}`,
      post,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /api/posts
 * @desc Get posts with filtering and pagination
 * @access Public
 */
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }); // Optional: keeps posts sorted by newest first

    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * @route GET /api/posts/:postId
 * @desc Get a single post by ID
 * @access Public
 */
router.get("/:postId", async (req, res) => {
  try {
    const post = await Post.findOne({ postId: req.params.postId });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route PUT /api/posts/:postId
 * @desc Update a post
 * @access Private
 */
router.put("/:postId", async (req, res) => {
  try {
    const post = await Post.findOne({ postId: req.params.postId });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.creatorAddress !== req.walletAddress) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const allowedUpdates = ["title", "description", "tags", "status"];
    const updates = Object.keys(req.body)
      .filter((key) => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    Object.assign(post, updates);
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route DELETE /api/posts/:postId
 * @desc Delete a post
 * @access Private
 */
router.delete("/:postId", async (req, res) => {
  try {
    const post = await Post.findOne({ postId: req.params.postId });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.creatorAddress !== req.walletAddress) {
      return res.status(403).json({ error: "Not authorized" });
    }

    if (post.hasBounty && post.bountyStatus === "OPEN") {
      return res.status(400).json({
        error: "Cannot delete post with active bounty",
      });
    }

    await post.remove();
    res.json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
