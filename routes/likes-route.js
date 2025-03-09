const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/isAuthenticated");
const {
  addLike,
  deleteLike,
  getUserLikes,
  getLikesCount,
} = require("../controllers/likes-controller");

router.post("/posts/:postId/like", isAuthenticated, addLike);
router.delete("/posts/:postId/like", isAuthenticated, deleteLike);
router.get("/posts/:postId/likes-count", getLikesCount);
router.get("/user/liked-posts", isAuthenticated, getUserLikes);

module.exports = router;
