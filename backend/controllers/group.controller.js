const asyncHandler = require("express-async-handler");
const Group = require("../models/Group");

const ALLOWED_ROLES = ["admin", "alumni", "faculty"];

exports.create = asyncHandler(async (req, res) => {
  const { name, description, avatar, members = [] } = req.body;
  if (!name) { res.status(400); throw new Error("Name required"); }
  const group = await Group.create({
    name, description, avatar,
    creator: req.user._id,
    admins: [req.user._id],
    members: Array.from(new Set([req.user._id.toString(), ...members])),
  });
  res.status(201).json(await group.populate("members admins", "name photo role"));
});

exports.myGroups = asyncHandler(async (req, res) => {
  const groups = await Group.find({ members: req.user._id })
    .populate("members admins", "name photo role");
  res.json(groups);
});

exports.getById = asyncHandler(async (req, res) => {
  const g = await Group.findById(req.params.id).populate("members admins creator", "name photo role");
  if (!g) { res.status(404); throw new Error("Not found"); }
  res.json(g);
});

const isGroupAdmin = (group, userId) =>
  group.admins.some((a) => a.equals(userId)) || group.creator.equals(userId);

exports.addMember = asyncHandler(async (req, res) => {
  const g = await Group.findById(req.params.id);
  if (!g) { res.status(404); throw new Error("Not found"); }
  if (!ALLOWED_ROLES.includes(req.user.role)) {
    res.status(403);
    throw new Error("Only admin/alumni/faculty can add members");
  }
  if (!isGroupAdmin(g, req.user._id)) { res.status(403); throw new Error("Group admin only"); }
  const { userId } = req.body;
  if (!g.members.some((m) => m.equals(userId))) g.members.push(userId);
  await g.save();
  res.json(await g.populate("members admins", "name photo role"));
});

exports.removeMember = asyncHandler(async (req, res) => {
  const g = await Group.findById(req.params.id);
  if (!g) { res.status(404); throw new Error("Not found"); }
  if (!isGroupAdmin(g, req.user._id)) { res.status(403); throw new Error("Group admin only"); }
  g.members = g.members.filter((m) => !m.equals(req.params.userId));
  g.admins = g.admins.filter((m) => !m.equals(req.params.userId));
  await g.save();
  res.json(g);
});

exports.promote = asyncHandler(async (req, res) => {
  const g = await Group.findById(req.params.id);
  if (!g) { res.status(404); throw new Error("Not found"); }
  if (!ALLOWED_ROLES.includes(req.user.role)) {
    res.status(403);
    throw new Error("Only admin/alumni/faculty can promote admins");
  }
  if (!isGroupAdmin(g, req.user._id)) { res.status(403); throw new Error("Group admin only"); }
  if (!g.admins.some((a) => a.equals(req.params.userId))) g.admins.push(req.params.userId);
  await g.save();
  res.json(g);
});
