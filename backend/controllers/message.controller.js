const asyncHandler = require("express-async-handler");
const Message = require("../models/Message");
const Group = require("../models/Group");

exports.sendDirect = asyncHandler(async (req, res) => {
  const { recipient, text } = req.body;
  if (!recipient || !text) { res.status(400); throw new Error("Recipient and text required"); }
  const msg = await Message.create({ sender: req.user._id, recipient, text });
  res.status(201).json(await msg.populate("sender", "name photo"));
});

exports.directThread = asyncHandler(async (req, res) => {
  const other = req.params.userId;
  const items = await Message.find({
    $or: [
      { sender: req.user._id, recipient: other },
      { sender: other, recipient: req.user._id },
    ],
  }).sort({ createdAt: 1 }).populate("sender", "name photo");
  res.json(items);
});

exports.sendGroup = asyncHandler(async (req, res) => {
  const { groupId, text } = req.body;
  const group = await Group.findById(groupId);
  if (!group) { res.status(404); throw new Error("Group not found"); }
  if (!group.members.some((m) => m.equals(req.user._id))) {
    res.status(403); throw new Error("Not a member");
  }
  const msg = await Message.create({ sender: req.user._id, group: groupId, text });
  res.status(201).json(await msg.populate("sender", "name photo"));
});

exports.groupThread = asyncHandler(async (req, res) => {
  const items = await Message.find({ group: req.params.groupId })
    .sort({ createdAt: 1 }).populate("sender", "name photo");
  res.json(items);
});

exports.inbox = asyncHandler(async (req, res) => {
  // distinct DM conversation partners
  const msgs = await Message.find({
    $or: [{ sender: req.user._id }, { recipient: req.user._id }],
    group: { $exists: false },
  }).sort({ createdAt: -1 }).populate("sender recipient", "name photo");
  const seen = new Set();
  const threads = [];
  msgs.forEach((m) => {
    const otherId = m.sender._id.equals(req.user._id) ? m.recipient?._id?.toString() : m.sender._id.toString();
    if (otherId && !seen.has(otherId)) {
      seen.add(otherId);
      threads.push({ user: m.sender._id.equals(req.user._id) ? m.recipient : m.sender, lastMessage: m });
    }
  });
  res.json(threads);
});
