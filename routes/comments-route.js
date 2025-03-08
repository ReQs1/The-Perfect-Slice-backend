const express = require("express");
const router = express.Router();
const {
  getComments,
  addComment,
  updateComment,
  deleteComment,
  getCommentsCount,
} = require("../controllers/comments-controller");
const { isAuthenticated } = require("../middleware/isAuthenticated");

router.get("/posts/:postId/comments", getComments);
router.post("/posts/:postId/comments", isAuthenticated, addComment);
router.patch("/comments/:commentId", isAuthenticated, updateComment);
router.delete("/comments/:commentId", isAuthenticated, deleteComment);
router.get("/posts/:postId/comments-count", getCommentsCount);

module.exports = router;
