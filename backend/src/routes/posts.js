const express = require("express");
const router = express.Router();
const multer = require("multer");
const { ethers } = require("ethers");
const Post = require("../models/Post");
const ipfs = require("../config/ipfs");
const { Configuration, OpenAIApi } = require("openai");
const authMiddleware = require("../middleware/auth");
const VoiceProcessingService = require("../services/voiceProcessing");

// Configure OpenAI
const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

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
 * @route POST /api/posts/voice
 * @desc Upload and process a voice note
 * @access Private
 */
router.post(
  "/voice",
  authMiddleware,
  upload.single("audio"),
  async (req, res) => {
    try {
      const {
        isAnonymous,
        bountyAmount,
        bountyToken,
        tags,
        title,
        description,
      } = req.body;

      if (!req.file) {
        return res.status(400).json({ error: "No audio file provided" });
      }

      // Process voice if anonymous
      let processedAudio = req.file.buffer;
      if (isAnonymous === "true") {
        processedAudio = await VoiceProcessingService.anonymizeVoice(
          processedAudio
        );
      }

      // Upload to IPFS
      const ipfsResult = await ipfs.add(processedAudio);
      const ipfsHash = ipfsResult.path;

      // Convert speech to text
      const audioStream = Buffer.from(processedAudio);
      const transcription = await openai.createTranscription({
        file: audioStream,
        model: "whisper-1",
        language: "en",
      });

      // Generate unique post ID
      const postId = ethers.utils.id(req.walletAddress + Date.now().toString());

      // Create post in database
      const post = new Post({
        postId,
        creatorAddress: req.walletAddress,
        ipfsHash,
        transcription: transcription.data.text,
        bountyAmount: parseFloat(bountyAmount) || 0,
        bountyToken,
        isAnonymous: isAnonymous === "true",
        status: "active",
        tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
        title,
        description,
        metadata: {
          originalFileName: req.file.originalname,
          mimeType: req.file.mimetype,
          size: req.file.size,
        },
      });

      await post.save();

      // If bounty attached, interact with smart contract
      if (bountyAmount > 0) {
        try {
          // Smart contract interaction logic here
          // This would be implemented based on your contract
          const provider = new ethers.providers.JsonRpcProvider(
            process.env.BLOCKCHAIN_RPC_URL
          );
          const contract = new ethers.Contract(
            process.env.CONTRACT_ADDRESS,
            CONTRACT_ABI,
            provider
          );

          // Emit event for frontend to handle contract interaction
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
          // If contract interaction fails, delete the post
          await Post.findByIdAndDelete(post._id);
          throw new Error(`Contract interaction failed: ${error.message}`);
        }
      } else {
        res.json({ success: true, post });
      }
    } catch (error) {
      console.error("Voice post creation error:", error);
      res.status(500).json({
        error: error.message,
        details: error.stack,
      });
    }
  }
);

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
