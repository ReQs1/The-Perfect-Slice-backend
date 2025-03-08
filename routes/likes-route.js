const express = require("express");
const { isAuthenticated } = require("../middleware/isAuthenticated");
const {
  addLike,
  deleteLike,
  getUserLikes,
  getLikesCount,
} = require("../controllers/likes-controller");
const router = express.Router();

router.post("/posts/:postId/like", isAuthenticated, addLike);
router.delete("/posts/:postId/like", isAuthenticated, deleteLike);
router.get("/posts/:postId/likes-count", getLikesCount);
router.get("/user/liked-posts", isAuthenticated, getUserLikes);
