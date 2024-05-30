const User = require("./User");
const Blog = require("./Blog");
const Article = require("./Article");
const Comment = require("./Comment");

// Define associations here
User.hasMany(Blog, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});

Blog.belongsTo(User, {
  foreignKey: "user_id",
});

User.hasMany(Article, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});

Article.belongsTo(User, {
  foreignKey: "user_id",
});

Blog.hasMany(Comment, {
  foreignKey: "blog_id",
  onDelete: "CASCADE",
});

Comment.belongsTo(Blog, {
  foreignKey: "blog_id",
});

Article.hasMany(Comment, {
  foreignKey: "article_id",
  onDelete: "CASCADE",
});

Comment.belongsTo(Article, {
  foreignKey: "article_id",
});

Comment.belongsTo(User, {
  foreignKey: "user_id",
});

User.hasMany(Comment, {
  foreignKey: "user_id",
});

module.exports = {
  User,
  Blog,
  Article,
  Comment,
};
