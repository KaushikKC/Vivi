// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Vivi is Ownable {
    constructor() Ownable() {
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

    struct Comment {
        uint256 id;
        uint256 postId;
        address commenter;
        string contentHash;
        PostType commentType;
        bool isAnonymous;
        bool isActive;
    }

    // Mapping for posts
    mapping(uint256 => Post) public posts;
    mapping(uint256 => Comment) public comments;
    mapping(uint256 => uint256[]) public postComments;
    mapping(uint256 => address[]) public postLikes;
    mapping(uint256 => address[]) public commentLikes;
    mapping(address => mapping(uint256 => bool)) public hasLikedPost;
    mapping(address => mapping(uint256 => bool)) public hasLikedComment;

    uint256 public postCount;
    uint256 public commentCount;

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

    event CommentAdded(
        uint256 indexed postId,
        uint256 indexed commentId,
        address indexed commenter,
        bool isAnonymous,
        string contentHash,
        PostType commentType
    );

    event PostLiked(uint256 indexed postId, address indexed liker);
    event CommentLiked(uint256 indexed commentId, address indexed liker);
    event CommentEdited(uint256 indexed commentId, string newContentHash);
    event CommentDeleted(uint256 indexed commentId);

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

    function addComment(
        uint256 postId,
        string memory contentHash,
        PostType commentType,
        bool isAnonymous
    ) external {
        require(posts[postId].isActive, "Post is not active");
        require(bytes(contentHash).length > 0, "Content hash cannot be empty");

        commentCount++;
        comments[commentCount] = Comment({
            id: commentCount,
            postId: postId,
            commenter: isAnonymous ? address(0) : msg.sender,
            contentHash: contentHash,
            commentType: commentType,
            isAnonymous: isAnonymous,
            isActive: true
        });

        postComments[postId].push(commentCount);

        emit CommentAdded(
            postId,
            commentCount,
            msg.sender,
            isAnonymous,
            contentHash,
            commentType
        );
    }

    function likePost(uint256 postId) external {
        require(posts[postId].isActive, "Post is not active");
        require(
            !hasLikedPost[msg.sender][postId],
            "You already liked this post"
        );

        postLikes[postId].push(msg.sender);
        hasLikedPost[msg.sender][postId] = true;

        emit PostLiked(postId, msg.sender);
    }

    function likeComment(uint256 commentId) external {
        require(comments[commentId].isActive, "Comment is not active");
        require(
            !hasLikedComment[msg.sender][commentId],
            "You already liked this comment"
        );

        commentLikes[commentId].push(msg.sender);
        hasLikedComment[msg.sender][commentId] = true;

        emit CommentLiked(commentId, msg.sender);
    }

    function editComment(
        uint256 commentId,
        string memory newContentHash
    ) external {
        Comment storage comment = comments[commentId];
        require(comment.isActive, "Comment is not active");
        require(msg.sender == comment.commenter, "Only the commenter can edit");
        require(
            bytes(newContentHash).length > 0,
            "Content hash cannot be empty"
        );

        comment.contentHash = newContentHash;
        emit CommentEdited(commentId, newContentHash);
    }

    function deleteComment(uint256 commentId) external {
        Comment storage comment = comments[commentId];
        require(comment.isActive, "Comment is not active");
        require(
            msg.sender == comment.commenter,
            "Only the commenter can delete"
        );

        comment.isActive = false;
        emit CommentDeleted(commentId);
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
