const asyncHandler = require("express-async-handler");
const Announcement = require("../models/Announcement");

exports.create = asyncHandler(async (req, res) => {
  const { title, description, attachments = [] } = req.body;
  if (!title || !description) { res.status(400); throw new Error("Title & description required"); }
  const a = await Announcement.create({
    title, description, attachments, author: req.user._id,
  });
  res.status(201).json(await a.populate("author", "name photo role"));
});

exports.list = asyncHandler(async (_req, res) => {
  const items = await Announcement.find().sort({ createdAt: -1 })
    .populate("author", "name photo role");
  res.json(items);
});

exports.remove = asyncHandler(async (req, res) => {
  const a = await Announcement.findById(req.params.id);
  if (!a) { res.status(404); throw new Error("Not found"); }
  if (!["admin", "faculty", "alumni"].includes(req.user.role)) {
    res.status(403); throw new Error("Forbidden");
  }
  if (req.user.role !== "admin" && !a.author.equals(req.user._id)) {
    res.status(403); throw new Error("Forbidden");
  }
  await a.deleteOne();
  res.json({ message: "Deleted" });
});

exports.update = asyncHandler(async (req, res) => {
  const a = await Announcement.findById(req.params.id);
  if (!a) { res.status(404); throw new Error("Not found"); }
  if (!["admin", "faculty", "alumni"].includes(req.user.role)) {
    res.status(403); throw new Error("Forbidden");
  }
  if (req.user.role !== "admin" && !a.author.equals(req.user._id)) {
    res.status(403); throw new Error("Forbidden");
  }
  const { title, description, attachments } = req.body;
  if (title !== undefined) a.title = title;
  if (description !== undefined) a.description = description;
  if (attachments !== undefined) a.attachments = attachments;
  await a.save();
  res.json(await a.populate("author", "name photo role"));
});
