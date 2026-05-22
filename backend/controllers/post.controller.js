const asyncHandler = require("express-async-handler");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

exports.create = asyncHandler(async (req, res) => {
  const { content, images = [], files = [] } = req.body;
  if (!content) { res.status(400); throw new Error("Content is required"); }
  const post = await Post.create({ author: req.user._id, content, images, files });
  res.status(201).json(await post.populate("author", "name photo role designation"));
});

exports.list = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const [items, total] = await Promise.all([
    Post.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit)
      .populate("author", "name photo role designation")
      .populate({
        path: "sharedPost",
        populate: { path: "author", select: "name photo role designation" },
      }),
    Post.countDocuments(),
  ]);
  res.json({ items, total, page, pages: Math.ceil(total / limit) });
});

exports.toggleLike = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) { res.status(404); throw new Error("Post not found"); }
  const idx = post.likes.findIndex((u) => u.equals(req.user._id));
  if (idx > -1) post.likes.splice(idx, 1); else post.likes.push(req.user._id);
  await post.save();
  res.json({ likes: post.likes.length, liked: idx === -1 });
});

exports.remove = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) { res.status(404); throw new Error("Not found"); }
  if (!["admin", "faculty", "alumni"].includes(req.user.role)) {
    res.status(403); throw new Error("Forbidden");
  }
  if (req.user.role !== "admin" && !post.author.equals(req.user._id)) {
    res.status(403); throw new Error("Forbidden");
  }
  await post.deleteOne();
  await Comment.deleteMany({ post: post._id });
  res.json({ message: "Deleted" });
});

exports.update = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) { res.status(404); throw new Error("Not found"); }
  if (!["admin", "faculty", "alumni"].includes(req.user.role)) {
    res.status(403); throw new Error("Forbidden");
  }
  if (req.user.role !== "admin" && !post.author.equals(req.user._id)) {
    res.status(403); throw new Error("Forbidden");
  }
  const { content, images, files } = req.body;
  if (content !== undefined) post.content = content;
  if (images !== undefined) post.images = images;
  if (files !== undefined) post.files = files;
  await post.save();
  res.json(await post.populate("author", "name photo role designation"));
});

exports.share = asyncHandler(async (req, res) => {
  if (!["admin", "faculty", "alumni"].includes(req.user.role)) {
    res.status(403);
    throw new Error("Forbidden");
  }
  const original = await Post.findById(req.params.id);
  if (!original) {
    res.status(404);
    throw new Error("Post not found");
  }
  const content = req.body.content || `Shared a post from ${original.author}`;
  const shared = await Post.create({
    author: req.user._id,
    content,
    sharedPost: original._id,
  });
  res.status(201).json(
    await shared.populate("author", "name photo role designation").populate({
      path: "sharedPost",
      populate: { path: "author", select: "name photo role designation" },
    })
  );
});
