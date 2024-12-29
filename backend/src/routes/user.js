const express = require("express");
const router = express.Router();
const ethers = require("ethers");
const multer = require("multer");
const { create } = require("ipfs-http-client");
const User = require("../models/User");

// IPFS client setup
const ipfs = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

// Multer setup for file uploads
const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

// Middleware to verify wallet signature
const verifySignature = async (req, res, next) => {
  try {
    const { signature, message, walletAddress } = req.headers;
    const recoveredAddress = ethers.utils.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(401).json({ error: "Invalid signature" });
    }
    req.walletAddress = walletAddress.toLowerCase();
    next();
  } catch (error) {
    res.status(401).json({ error: "Authentication failed" });
  }
};

// Create or update user profile
router.post(
  "/profile",
  verifySignature,
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const { ensName, bio } = req.body;
      const walletAddress = req.walletAddress;

      // Upload profile picture to IPFS if provided
      let profilePictureHash = null;
      if (req.file) {
        const result = await ipfs.add(req.file.buffer);
        profilePictureHash = result.path;
      }

      // Update or create user profile
      const updateData = {
        ensName,
        bio,
        lastActive: new Date(),
        ...(profilePictureHash && { profilePicture: profilePictureHash }),
      };

      const user = await User.findOneAndUpdate({ walletAddress }, updateData, {
        new: true,
        upsert: true,
      });

      res.json(user);
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  }
);

// Get user profile
router.get("/profile/:walletAddress", async (req, res) => {
  try {
    const walletAddress = req.params.walletAddress.toLowerCase();
    const user = await User.findOne({ walletAddress });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// Get ENS name for wallet
router.get("/ens/:walletAddress", async (req, res) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.ETH_RPC_URL
    );
    const ensName = await provider.lookupAddress(req.params.walletAddress);
    res.json({ ensName });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch ENS name" });
  }
});

module.exports = router;
