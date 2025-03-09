const { sql } = require("../db/db");
const ExpressError = require("../utils/ExpressError");

exports.addLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.user;

    const existingLike = await sql(
      `SELECT * FROM likes WHERE post_id = $1 AND user_id = $2`,
      [postId, userId]
    );

    if (existingLike.length > 0) {
      return res.status(400).json({ error: "You already liked this post" });
    }

    const newLike = await sql(
      `INSERT INTO likes (post_id, user_id)
             VALUES ($1, $2)
             RETURNING id`,
      [postId, userId]
    );

    if (newLike.length === 0) {
      throw new ExpressError("Couldn't add like", 500);
    }

    res.status(201).json({
      message: "Post liked successfully",
    });
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
};

exports.deleteLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.user;

    const existingLike = await sql(
      `SELECT * FROM likes WHERE post_id = $1 AND user_id = $2`,
      [postId, userId]
    );

    if (existingLike.length === 0) {
      return res.status(400).json({ error: "You haven't liked this post" });
    }

    const removedLike = await sql(
      `DELETE FROM likes 
         WHERE post_id = $1 AND user_id = $2
         RETURNING id`,
      [postId, userId]
    );

    if (removedLike.length === 0) {
      throw new ExpressError("Couldn't remove like", 500);
    }

    res.status(200).json({
      message: "Like removed successfully",
    });
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ error: error.message });
    } else {
      console.error("Error removing like:", error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
};

exports.getUserLikes = async (req, res) => {
  try {
    const { userId } = req.user;

    const likedPostsQuery = await sql(
      `SELECT post_id FROM likes WHERE user_id = $1`,
      [userId]
    );

    res.status(200).json(likedPostsQuery);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch liked posts" });
  }
};

exports.getLikesCount = async (req, res) => {
  try {
    const { postId } = req.params;

    const likeCountQuery = await sql(
      `SELECT COUNT(*) AS like_count FROM likes WHERE post_id = $1`,
      [postId]
    );

    res.status(200).json({
      likesCount: parseInt(likeCountQuery[0].like_count),
    });
  } catch (error) {
    console.error("Error fetching likes count:", error);
    res.status(500).json({ error: "Failed to fetch likes count" });
  }
};
