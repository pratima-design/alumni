const router = require("express").Router();
const { protect, authorize } = require("../middleware/auth.middleware");
const c = require("../controllers/user.controller");

router.get("/", protect, c.list);
router.get("/search", protect, authorize("admin", "faculty", "alumni"), c.searchMembers);
router.put("/me", protect, c.updateMe);
router.put("/me/photo", protect, c.updateMyPhoto);
router.post("/faculty/users", protect, authorize("faculty"), c.facultyCreateUser);
router.get("/:id", protect, c.getById);
router.put("/:id/role", protect, authorize("admin"), c.adminUpdateRole);
router.put("/:id/approve", protect, authorize("admin", "faculty"), c.approveUser);
router.delete("/faculty/users/:id", protect, authorize("faculty"), c.facultyDeleteUser);
router.delete("/:id", protect, authorize("admin"), c.adminDelete);

module.exports = router;
