const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vivi", function () {
  let Vivi;
  let vivi;
  let owner;
  let addr1;
  let addr2;
  let mockToken;

  beforeEach(async function () {
    try {
      // Get signers
      [owner, addr1, addr2] = await ethers.getSigners();

      // Deploy MockERC20
      const MockToken = await ethers.getContractFactory("MockERC20");
      mockToken = await MockToken.deploy("Mock Token", "MTK");

      // Deploy Vivi
      Vivi = await ethers.getContractFactory("Vivi");
      vivi = await Vivi.deploy();

      // Wait for deployments
      await Promise.all([
        mockToken.waitForDeployment(),
        vivi.waitForDeployment(),
      ]);

      // Get contract addresses
      const mockTokenAddress = await mockToken.getAddress();
      const viviAddress = await vivi.getAddress();

      // Mint tokens
      await mockToken.mint(addr1.address, ethers.parseEther("1000"));
      await mockToken.mint(addr2.address, ethers.parseEther("1000"));
    } catch (error) {
      console.error("Deployment Error:", error);
      throw error;
    }
  });

  describe("Post Creation and Management", function () {
    it("Should create a post correctly", async function () {
      const contentHash = "QmTest123";
      const postType = 0; // TEXT
      const bountyAmount = ethers.parseEther("100");
      const mockTokenAddress = await mockToken.getAddress();
      const viviAddress = await vivi.getAddress();

      await mockToken.connect(addr1).approve(viviAddress, bountyAmount);
      await vivi
        .connect(addr1)
        .createPost(contentHash, postType, bountyAmount, mockTokenAddress);

      const post = await vivi.posts(1);
      expect(post.creator).to.equal(addr1.address);
      expect(post.contentHash).to.equal(contentHash);
      expect(post.postType).to.equal(postType);
      expect(post.bountyAmount).to.equal(bountyAmount);
      expect(post.isActive).to.equal(true);
    });
  });

  describe("Comments", function () {
    beforeEach(async function () {
      await vivi
        .connect(addr1)
        .createPost("QmTest123", 0, 0, ethers.ZeroAddress);
    });

    it("Should add a comment to a post", async function () {
      await vivi.connect(addr2).addComment(1, "QmComment123", 0, false);

      const comment = await vivi.comments(1);
      expect(comment.commenter).to.equal(addr2.address);
      expect(comment.contentHash).to.equal("QmComment123");
      expect(comment.isAnonymous).to.equal(false);
    });

    it("Should handle anonymous comments", async function () {
      await vivi.connect(addr2).addComment(1, "QmComment123", 0, true);

      const comment = await vivi.comments(1);
      expect(comment.isAnonymous).to.equal(true);
      expect(comment.commenter).to.equal(ethers.ZeroAddress);
    });
  });

  describe("Likes", function () {
    beforeEach(async function () {
      await vivi
        .connect(addr1)
        .createPost("QmTest123", 0, 0, ethers.ZeroAddress);
    });

    it("Should allow liking a post", async function () {
      await vivi.connect(addr2).likePost(1);

      const hasLiked = await vivi.hasLikedPost(addr2.address, 1);
      expect(hasLiked).to.equal(true);
    });

    it("Should prevent liking a post twice", async function () {
      await vivi.connect(addr2).likePost(1);
      await expect(vivi.connect(addr2).likePost(1)).to.be.revertedWith(
        "You already liked this post"
      );
    });
  });

  describe("Bounty System", function () {
    beforeEach(async function () {
      const viviAddress = await vivi.getAddress();
      await mockToken
        .connect(addr1)
        .approve(viviAddress, ethers.parseEther("1000"));
    });

    it("Should add bounty to post", async function () {
      const mockTokenAddress = await mockToken.getAddress();
      const viviAddress = await vivi.getAddress();

      await vivi
        .connect(addr1)
        .createPost("QmTest123", 0, ethers.parseEther("100"), mockTokenAddress);

      await mockToken
        .connect(addr2)
        .approve(viviAddress, ethers.parseEther("50"));
      await vivi
        .connect(addr2)
        .addBountyToPost(1, ethers.parseEther("50"), mockTokenAddress);

      const post = await vivi.posts(1);
      expect(post.bountyAmount).to.equal(ethers.parseEther("150"));
    });
  });

  describe("Emergency Functions", function () {
    it("Should allow owner to recover stuck tokens", async function () {
      const mockTokenAddress = await mockToken.getAddress();
      const viviAddress = await vivi.getAddress();

      // Mint tokens to owner first
      await mockToken.mint(owner.address, ethers.parseEther("1000"));

      // Transfer tokens to contract
      await mockToken
        .connect(owner)
        .transfer(viviAddress, ethers.parseEther("100"));
      const initialBalance = await mockToken.balanceOf(owner.address);

      // Recover tokens
      await vivi.recoverToken(mockTokenAddress, ethers.parseEther("100"));

      // Check final balance
      const finalBalance = await mockToken.balanceOf(owner.address);
      expect(finalBalance).to.equal(initialBalance + ethers.parseEther("100"));
    });

    it("Should prevent non-owners from recovering tokens", async function () {
      const mockTokenAddress = await mockToken.getAddress();
      await expect(
        vivi
          .connect(addr1)
          .recoverToken(mockTokenAddress, ethers.parseEther("100"))
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
