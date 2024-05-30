const router = require("express").Router();
const { User, Blog, Article, Comment } = require("../models");
const withAuth = require("../public/utils/auth");
const { Op } = require("sequelize");

// Route for displaying the homepage with blogs and articles
router.get("/", async (req, res) => {
  try {
    const blogData = await Blog.findAll({
      include: [
        {
          model: User,
          attributes: ["username"],
        },
      ],
    });

    const articleData = await Article.findAll({
      include: [
        {
          model: User,
          attributes: ["username"],
        },
      ],
    });

    const blogs = blogData.map((blog) =>
      blog.get({
        plain: true,
      })
    );

    const articles = articleData.map((article) =>
      article.get({
        plain: true,
      })
    );

    res.render("homepage", {
      blogs,
      articles,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route for displaying the dashboard with user blogs and articles
router.get("/dashboard", withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ["password"] },
      include: [{ model: Blog }, { model: Article }],
    });
    const user = userData.get({ plain: true });

    res.render("dashboard", {
      ...user,
      logged_in: true,
      isDashboard: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route for displaying the login page
router.get("/login", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/dashboard");
    return;
  }
  res.render("login");
});

// Route for displaying the sign-up page
router.get("/signUp", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/dashboard");
    return;
  }
  res.render("signUp");
});

// Route for displaying all blogs
router.get("/blog", async (req, res) => {
  try {
    const blogData = await Blog.findAll({
      include: [
        {
          model: User,
          attributes: ["username"],
        },
      ],
    });

    const blogs = blogData.map((blog) =>
      blog.get({
        plain: true,
      })
    );

    res.render("all-blogs", {
      blogs,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route for displaying all articles
router.get("/articles", async (req, res) => {
  try {
    const articleData = await Article.findAll({
      include: [
        {
          model: User,
          attributes: ["username"],
        },
      ],
    });

    const articles = articleData.map((article) =>
      article.get({
        plain: true,
      })
    );

    res.render("all-articles", {
      articles,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route for displaying all comments along with the parent posts
router.get("/comments", async (req, res) => {
  try {
    const commentData = await Comment.findAll({
      include: [
        {
          model: User,
          attributes: ["username"],
        },
        {
          model: Blog,
          include: [
            {
              model: User,
              attributes: ["username"],
            },
          ],
        },
        {
          model: Article,
          include: [
            {
              model: User,
              attributes: ["username"],
            },
          ],
        },
      ],
    });

    const comments = commentData.map((comment) => comment.get({ plain: true }));

    console.log(comments);

    res.render("all-comments", {
      comments,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route for displaying a single blog post by ID
router.get("/blog/:id", withAuth, async (req, res) => {
  try {
    const blogData = await Blog.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["username"],
        },
        {
          model: Comment,
          include: [User],
        },
      ],
    });

    const blog = blogData.get({
      plain: true,
    });

    res.render("blog", {
      ...blog,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route for displaying a single article by ID
router.get("/article/:id", withAuth, async (req, res) => {
  try {
    const articleData = await Article.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["username"],
        },
        {
          model: Comment,
          include: [User],
        },
      ],
    });

    if (!articleData) {
      res.status(404).json({ message: "No article found with this id!" });
      return;
    }

    const article = articleData.get({
      plain: true,
    });

    res.render("article", {
      ...article,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Fetch recent users
router.get("/api/user/getusers", withAuth, async (req, res) => {
  try {
    const users = await User.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
    });

    const totalUsers = await User.count();
    const lastMonthUsers = await User.count({
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });

    res.status(200).json({ users, totalUsers, lastMonthUsers });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Fetch recent posts
router.get("/api/post/getposts", withAuth, async (req, res) => {
  try {
    const posts = await Blog.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
    });

    const totalPosts = await Blog.count();
    const lastMonthPosts = await Blog.count({
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });

    res.status(200).json({ posts, totalPosts, lastMonthPosts });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Fetch recent comments
router.get("/api/comment/getcomments", withAuth, async (req, res) => {
  try {
    const comments = await Comment.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
    });

    const totalComments = await Comment.count();
    const lastMonthComments = await Comment.count({
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });

    res.status(200).json({ comments, totalComments, lastMonthComments });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route for displaying the new blog creation page
router.get("/dashboard/new-blog", withAuth, async (req, res) => {
  try {
    res.render("new-blog", {
      logged_in: req.session.logged_in,
      isDashboard: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route for displaying the new article creation page
router.get("/dashboard/new-article", withAuth, async (req, res) => {
  try {
    res.render("new-article", {
      logged_in: req.session.logged_in,
      isDashboard: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route for displaying blogs posted by the current user
router.get("/dashboard/blogs", withAuth, async (req, res) => {
  try {
    const userBlogsData = await Blog.findAll({
      where: { user_id: req.session.user_id },
      include: [{ model: User, attributes: ["username"] }],
    });

    const blogs = userBlogsData.map((blog) => blog.get({ plain: true }));

    res.render("my-blogs", {
      blogs,
      logged_in: true,
      isDashboard: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route for displaying articles posted by the current user
router.get("/dashboard/articles", withAuth, async (req, res) => {
  try {
    const userArticlesData = await Article.findAll({
      where: { user_id: req.session.user_id },
      include: [{ model: User, attributes: ["username"] }],
    });

    const articles = userArticlesData.map((article) =>
      article.get({ plain: true })
    );

    res.render("my-articles", {
      articles,
      logged_in: true,
      isDashboard: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route for displaying comments posted by the current user
router.get("/dashboard/comments", withAuth, async (req, res) => {
  try {
    const userCommentsData = await Comment.findAll({
      where: { user_id: req.session.user_id },
      include: [
        { model: User, attributes: ["username"] },
        { model: Blog, attributes: ["title"] },
        { model: Article, attributes: ["title"] },
      ],
    });

    const comments = userCommentsData.map((comment) =>
      comment.get({ plain: true })
    );

    res.render("my-comments", {
      comments,
      logged_in: true,
      isDashboard: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route for search results
router.get("/search", async (req, res) => {
  const { query, type } = req.query;

  try {
    let results = [];

    if (type === "blogs") {
      const blogData = await Blog.findAll({
        where: {
          [Op.or]: [
            { title: { [Op.like]: `%${query}%` } },
            { description: { [Op.like]: `%${query}%` } },
            { "$user.username$": { [Op.like]: `%${query}%` } },
          ],
        },
        include: [{ model: User, attributes: ["username"] }],
      });
      results = blogData.map((blog) => blog.get({ plain: true }));
    } else if (type === "articles") {
      const articleData = await Article.findAll({
        where: {
          [Op.or]: [
            { title: { [Op.like]: `%${query}%` } },
            { description: { [Op.like]: `%${query}%` } },
            { "$user.username$": { [Op.like]: `%${query}%` } },
          ],
        },
        include: [{ model: User, attributes: ["username"] }],
      });
      results = articleData.map((article) => article.get({ plain: true }));
    }

    res.render("search-results", {
      results,
      logged_in: req.session.logged_in,
      type,
      query,
    });
  } catch (err) {
    console.error("Error during search:", err);
    res.status(500).json(err);
  }
});

module.exports = router;
