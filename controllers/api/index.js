const router = require("express").Router();
const userRoutes = require("./user-routes");
const blogRoutes = require("./blogRoutes");
const commentRoutes = require("./commentRoutes");
const articleRoutes = require("./articleRoutes");

router.use("/users", userRoutes);
router.use("/blogs", blogRoutes);
router.use("/comments", commentRoutes);
router.use("/articles", articleRoutes);


module.exports = router;
