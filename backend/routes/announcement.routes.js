const router = require("express").Router();
const { protect, authorize } = require("../middleware/auth.middleware");
const c = require("../controllers/announcement.controller");

router.get("/", protect, c.list);
router.post("/", protect, authorize("admin", "faculty", "alumni"), c.create);
router.put("/:id", protect, authorize("admin", "faculty", "alumni"), c.update);
router.delete("/:id", protect, c.remove);

module.exports = router;
