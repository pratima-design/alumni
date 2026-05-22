const asyncHandler = require("express-async-handler");
const Comment = require("../models/Comment");

exports.create = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text) { res.status(400); throw new Error("Text required"); }
  const c = await Comment.create({
    post: req.params.postId, author: req.user._id, text,
  });
  res.status(201).json(await c.populate("author", "name photo role"));
});

exports.listForPost = asyncHandler(async (req, res) => {
  const items = await Comment.find({ post: req.params.postId })
    .sort({ createdAt: 1 })
    .populate("author", "name photo role");
  res.json(items);
});

exports.remove = asyncHandler(async (req, res) => {
  const c = await Comment.findById(req.params.id);
  if (!c) { res.status(404); throw new Error("Not found"); }
  if (req.user.role !== "admin" && !c.author.equals(req.user._id)) {
    res.status(403); throw new Error("Forbidden");
  }
  await c.deleteOne();
  res.json({ message: "Deleted" });
});
