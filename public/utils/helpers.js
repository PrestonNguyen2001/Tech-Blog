const Handlebars = require("handlebars");

module.exports = {
  format_date: (date) => {
    // Check if date is valid
    if (!date) return "";
    return new Date(date).toLocaleDateString();
  },
  format_username: (username) => {
    // Capitalize the first letter of the username
    if (typeof username !== "string") return "";
    return username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();
  },
  ifEquals: (arg1, arg2, options) => {
    return arg1 == arg2 ? options.fn(this) : options.inverse(this);
  },
  json: (context) => {
    return JSON.stringify(context, null, 2);
  },
};

// Register the ifEquals helper with Handlebars
Handlebars.registerHelper("ifEquals", (arg1, arg2, options) => {
  return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});
