const router = require("express").Router();
const { Article } = require("../../models");
const withAuth = require("../../public/utils/auth");

router.post("/", withAuth, async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    const newArticle = await Article.create({
      ...req.body,
      user_id: req.session.user_id,
    });
    console.log("New Article:", newArticle);
    console.log("Request Body:", req.body);
    res.status(200).json(newArticle);
  } catch (err) {
    console.error("Error creating article:", err);
    res.status(400).json(err);
  }
});

router.delete("/:id", withAuth, async (req, res) => {
  try {
    const articleData = await Article.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!articleData) {
      res.status(404).json({ message: "404 Article ID not found" });
      return;
    }

    res.status(200).json(articleData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/getarticles", withAuth, async (req, res) => {
  try {
    const userId = req.query.userId;
    const startIndex = parseInt(req.query.startIndex) || 0;

    const articles = await Article.findAll({
      where: { user_id: userId },
      limit: 9,
      offset: startIndex,
    });

    res.status(200).json({ posts: articles });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
