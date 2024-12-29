// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Vivi is Ownable {
    constructor() Ownable(msg.sender) {
        // Initialize with msg.sender as the initial owner
    }

    // Enum to differentiate post types
    enum PostType {
        TEXT,
        VOICE
    }

    // Struct to store post details
    struct Post {
        uint256 id;
        address creator;
        string contentHash;
        PostType postType;
        uint256 bountyAmount;
        address bountyToken;
        bool isActive;
    }

    // Mapping for posts
    mapping(uint256 => Post) public posts;
    uint256 public postCount;

    // Events
    event PostCreated(
        uint256 indexed postId,
        address indexed creator,
        string contentHash,
        PostType postType,
        uint256 bountyAmount,
        address bountyToken
    );

    event BountyAdded(
        uint256 indexed postId,
        address indexed sender,
        uint256 bountyAmount,
        address bountyToken
    );

    event BountyAwarded(uint256 indexed postId, address indexed winner);

    event PostCancelled(uint256 indexed postId, address indexed creator);

    event EmergencyTokenRecovered(address indexed token, uint256 amount);

    // Create a new post
    function createPost(
        string memory contentHash,
        PostType postType,
        uint256 bountyAmount,
        address bountyToken
    ) external payable {
        require(bytes(contentHash).length > 0, "Content hash cannot be empty");

        if (bountyAmount > 0) {
            require(bountyToken != address(0), "Invalid bounty token address");
            IERC20(bountyToken).transferFrom(
                msg.sender,
                address(this),
                bountyAmount
            );
        }

        postCount++;
        posts[postCount] = Post({
            id: postCount,
            creator: msg.sender,
            contentHash: contentHash,
            postType: postType,
            bountyAmount: bountyAmount,
            bountyToken: bountyToken,
            isActive: true
        });

        emit PostCreated(
            postCount,
            msg.sender,
            contentHash,
            postType,
            bountyAmount,
            bountyToken
        );
    }

    // Add bounty to an existing post
    function addBountyToPost(
        uint256 postId,
        uint256 bountyAmount,
        address bountyToken
    ) external {
        Post storage post = posts[postId];
        require(post.isActive, "Post is not active");
        require(post.id == postId, "Post does not exist");
        require(bountyAmount > 0, "Bounty amount must be greater than zero");

        IERC20(bountyToken).transferFrom(
            msg.sender,
            address(this),
            bountyAmount
        );
        post.bountyAmount += bountyAmount;

        emit BountyAdded(postId, msg.sender, bountyAmount, bountyToken);
    }

    // Award bounty to a winner
    function awardBounty(uint256 postId, address winner) external {
        Post storage post = posts[postId];
        require(
            msg.sender == post.creator,
            "Only the creator can award the bounty"
        );
        require(post.isActive, "Post is not active");
        require(post.bountyAmount > 0, "No bounty available for this post");

        IERC20(post.bountyToken).transfer(winner, post.bountyAmount);
        post.bountyAmount = 0;
        post.isActive = false;

        emit BountyAwarded(postId, winner);
    }

    // Cancel post and refund bounty
    function cancelPost(uint256 postId) external {
        Post storage post = posts[postId];
        require(
            msg.sender == post.creator,
            "Only the creator can cancel the post"
        );
        require(post.isActive, "Post is not active");

        if (post.bountyAmount > 0) {
            IERC20(post.bountyToken).transfer(post.creator, post.bountyAmount);
        }

        post.isActive = false;

        emit PostCancelled(postId, msg.sender);
    }

    // Emergency recovery of stuck tokens
    function recoverToken(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(owner(), amount);
        emit EmergencyTokenRecovered(token, amount);
    }

    // Fallback function to prevent accidental ETH deposits
    fallback() external payable {
        revert("ETH not accepted");
    }

    receive() external payable {
        revert("ETH not accepted");
    }
}
