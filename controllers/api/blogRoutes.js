const router = require("express").Router();
const { Blog } = require("../../models");
const withAuth = require("../../public/utils/auth");

router.post("/", withAuth, async (req, res) => {
  try {
    const newBlog = await Blog.create({
      ...req.body,
      user_id: req.session.user_id,
    });
    console.log("new blog:" + newBlog);
    console.log("req body: " + req.body);
    res.status(200).json(newBlog);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete("/:id", withAuth, async (req, res) => {
  try {
    const blogData = await Blog.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!blogData) {
      res.status(404).json({ message: "404 Blog ID not found" });
      return;
    }

    res.status(200).json(blogData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/getblogs", withAuth, async (req, res) => {
  try {
    const userId = req.query.userId;
    const startIndex = parseInt(req.query.startIndex) || 0;

    const blogs = await Blog.findAll({
      where: { user_id: userId },
      limit: 9,
      offset: startIndex,
    });

    res.status(200).json({ posts: blogs });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
