const router = require("express").Router();
const { protect } = require("../middleware/auth.middleware");
const c = require("../controllers/message.controller");

router.get("/inbox", protect, c.inbox);
router.post("/direct", protect, c.sendDirect);
router.get("/direct/:userId", protect, c.directThread);
router.post("/group", protect, c.sendGroup);
router.get("/group/:groupId", protect, c.groupThread);

module.exports = router;
