const express = require("express");
const router = express.Router();

// Middlewares
const { protect } = require("../middlewares/authMiddleware");
const { validateBody } = require("../middlewares/validateBody");

// Validation schema
const { messageSchema } = require("../validation/schemas");

// Controller functions
const {
  sendMessage,
  getMessagesBetweenUsers,
  deleteMessageForUser
} = require("../controllers/messageController");

// @route   POST /api/messages/
// @desc    Send a message to another user
// @access  Private
router.post("/", protect, validateBody(messageSchema), sendMessage);

// @route   GET /api/messages/:withUserId
// @desc    Get all messages between current user and another user
// @access  Private
router.get("/:withUserId", protect, getMessagesBetweenUsers);

// @route   DELETE /api/messages/:id
// @desc    Delete a message (for current user only)
// @access  Private
router.delete("/:id", protect, deleteMessageForUser);

module.exports = router;
