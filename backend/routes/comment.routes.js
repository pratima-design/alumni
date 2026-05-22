const router = require("express").Router();
const { protect } = require("../middleware/auth.middleware");
const c = require("../controllers/comment.controller");

router.get("/post/:postId", protect, c.listForPost);
router.post("/post/:postId", protect, c.create);
router.delete("/:id", protect, c.remove);

module.exports = router;
