const { sql } = require("../db/db");
const ExpressError = require("../utils/ExpressError");

module.exports.getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const commentsQuery = await sql(
      `SELECT c.id, c.body, c.created_at, u.name as author_name, u.picture as author_picture 
         FROM comments c
         JOIN users u ON c.user_id = u.id
         WHERE c.post_id = $1
         ORDER BY c.created_at DESC`,
      [postId]
    );
    res.status(200).json(commentsQuery);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { commentBody } = req.body;
    const { userId } = req.user;

    if (!commentBody || commentBody.trim() === "") {
      return res.status(400).json({ message: "Comment content is required" });
    }

    const MAX_COMMENT_LENGTH = 1000;
    if (commentBody.length > MAX_COMMENT_LENGTH) {
      return res.status(400).json({
        message: `Comment is too long. Maximum ${MAX_COMMENT_LENGTH} characters allowed.`,
      });
    }

    const newComment = await sql(
      `INSERT INTO comments (post_id, user_id, body)
         VALUES ($1, $2, $3)
         RETURNING id, body`,
      [postId, userId, commentBody]
    );

    if (newComment.length === 0)
      throw new ExpressError("Couldn't make a comment", 500);

    res.status(200).json({ message: "Successfully created comment" });
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { commentBody } = req.body;
    const { userId } = req.user;

    if (!commentBody || commentBody.trim() === "") {
      return res.status(400).json({ message: "Comment content is required" });
    }

    const MAX_COMMENT_LENGTH = 1000;
    if (commentBody.length > MAX_COMMENT_LENGTH) {
      return res.status(400).json({
        message: `Comment is too long. Maximum ${MAX_COMMENT_LENGTH} characters allowed.`,
      });
    }

    const commentQuery = await sql(`SELECT * FROM comments WHERE id = $1`, [
      commentId,
    ]);

    if (commentQuery.length === 0) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (commentQuery[0].user_id !== userId) {
      return res
        .status(403)
        .json({ error: "You can only edit your own comments" });
    }

    const updatedComment = await sql(
      `UPDATE comments 
      SET body = $1
      WHERE id = $2 
      RETURNING id, body`,
      [commentBody, commentId]
    );

    if (updatedComment.length === 0)
      throw new ExpressError("Couldn't update comment", 500);

    res.status(200).json({
      message: "Comment updated successfully",
    });
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ error: error.message });
    } else {
      console.error("Error updating comment:", error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId, isAdmin } = req.user;

    const commentQuery = await sql(`SELECT * FROM comments WHERE id = $1`, [
      commentId,
    ]);

    if (commentQuery.length === 0) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (commentQuery[0].user_id !== userId && !isAdmin) {
      return res
        .status(403)
        .json({ error: "You can only delete your own comments" });
    }

    const deletedComment = await sql(
      `DELETE FROM comments WHERE id = $1 RETURNING id`,
      [commentId]
    );

    if (deletedComment.length === 0)
      throw new ExpressError("Couldn't delete comment", 500);

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ error: error.message });
    } else {
      console.error("Error deleting comment:", error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
};

exports.getCommentsCount = async (req, res) => {
  try {
    const { postId } = req.params;

    const postQuery = await sql(`SELECT * FROM posts WHERE id = $1`, [postId]);

    if (postQuery.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    const commentCountQuery = await sql(
      `SELECT COUNT(*) AS comment_count FROM comments WHERE post_id = $1`,
      [postId]
    );

    res.status(200).json({
      commentsCount: parseInt(commentCountQuery[0].comment_count),
    });
  } catch (error) {
    console.error("Error fetching comments count:", error);
    res.status(500).json({ error: "Failed to fetch comments count" });
  }
};
