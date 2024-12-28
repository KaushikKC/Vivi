const express = require("express");
const router = express.Router();
const multer = require("multer");
const { ethers } = require("ethers");
const Post = require("../models/Post");
const ipfs = require("../config/ipfs");
const authMiddleware = require("../middleware/auth");
const VoiceProcessingService = require("../services/voiceProcessing");

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
 * @desc Create a new post (text, voice, or anonymous voice)
 * @access Private
 */
router.post("/", authMiddleware, upload.single("audio"), async (req, res) => {
  try {
    const {
      postType, // 'text', 'voice', 'anonymousVoice'
      content, // text content if type is 'text'
      needsTranscription, // boolean for voice posts
      bountyAmount,
      bountyToken,
      tags,
      title,
      description,
    } = req.body;

    // Generate unique post ID
    const postId = ethers.utils.id(req.walletAddress + Date.now().toString());

    let postData = {
      postId,
      creatorAddress: req.walletAddress,
      bountyAmount: parseFloat(bountyAmount) || 0,
      bountyToken,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      title,
      description,
      status: "active",
      postType,
    };

    // Handle different post types
    switch (postType) {
      case "text":
        if (!content) {
          return res
            .status(400)
            .json({ error: "Content is required for text posts" });
        }
        postData.content = content;
        break;

      case "voice":
      case "anonymousVoice":
        if (!req.file) {
          return res
            .status(400)
            .json({ error: "Audio file is required for voice posts" });
        }

        let processedAudio = req.file.buffer;

        // Process voice if anonymous
        if (postType === "anonymousVoice") {
          processedAudio = await VoiceProcessingService.anonymizeVoice(
            processedAudio
          );
        }

        // Upload to IPFS
        const ipfsResult = await ipfs.add(processedAudio);
        postData.ipfsHash = ipfsResult.path;

        // Handle transcription if needed
        if (needsTranscription === "true") {
          const transcription = await VoiceProcessingService.transcribeAudio(
            processedAudio
          );
          postData.transcription = transcription;
        }

        // Add audio metadata
        postData.audioMetadata = {
          originalFileName: req.file.originalname,
          mimeType: req.file.mimetype,
          size: req.file.size,
          duration: await VoiceProcessingService.getAudioDuration(
            processedAudio
          ),
        };
        break;

      default:
        return res.status(400).json({ error: "Invalid post type" });
    }

    // Create post in database
    const post = new Post(postData);
    await post.save();

    // Handle bounty if present
    if (bountyAmount > 0) {
      try {
        // Smart contract interaction logic here
        const provider = new ethers.providers.JsonRpcProvider(
          process.env.BLOCKCHAIN_RPC_URL
        );
        const contract = new ethers.Contract(
          process.env.CONTRACT_ADDRESS,
          CONTRACT_ABI,
          provider
        );

        res.json({
          success: true,
          post,
          contractDetails: {
            address: process.env.CONTRACT_ADDRESS,
            postId,
            bountyAmount,
            bountyToken,
          },
        });
      } catch (error) {
        await Post.findByIdAndDelete(post._id);
        throw new Error(`Contract interaction failed: ${error.message}`);
      }
    } else {
      res.json({ success: true, post });
    }
  } catch (error) {
    console.error("Post creation error:", error);
    res.status(500).json({
      error: error.message,
      details: error.stack,
    });
  }
});

/**
 * @route GET /api/posts
 * @desc Get posts with filtering and pagination
 * @access Public
 */
router.get("/", async (req, res) => {
  try {
    const {
      tag,
      hasBounty,
      creatorAddress,
      isAnonymous,
      status,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build query
    let query = {};
    if (tag) query.tags = tag;
    if (hasBounty === "true") query.bountyAmount = { $gt: 0 };
    if (creatorAddress) query.creatorAddress = creatorAddress;
    if (isAnonymous) query.isAnonymous = isAnonymous === "true";
    if (status) query.status = status;

    // Build sort
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Execute query with pagination
    const posts = await Post.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select("-__v");

    // Get total count for pagination
    const total = await Post.countDocuments(query);

    res.json({
      posts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    console.error("Get posts error:", error);
    res.status(500).json({ error: error.message });
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
router.put("/:postId", authMiddleware, async (req, res) => {
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
router.delete("/:postId", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findOne({ postId: req.params.postId });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.creatorAddress !== req.walletAddress) {
      return res.status(403).json({ error: "Not authorized" });
    }

    if (post.bountyAmount > 0) {
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
