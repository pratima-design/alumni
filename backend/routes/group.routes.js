const router = require("express").Router();
const { protect, authorize } = require("../middleware/auth.middleware");
const c = require("../controllers/group.controller");

router.get("/me", protect, c.myGroups);
router.post("/", protect, authorize("admin", "alumni"), c.create);
router.get("/:id", protect, c.getById);
router.post("/:id/members", protect, c.addMember);
router.delete("/:id/members/:userId", protect, c.removeMember);
router.post("/:id/admins/:userId", protect, c.promote);

module.exports = router;
