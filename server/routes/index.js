const authRoutes = require("./authRoutes");
const healthRoutes = require("./healthRoutes");
const conversationRoutes = require("./conversationRoutes");
const messageRoutes = require("./messageRoutes");

const routes = {
  authRoutes,
  healthRoutes,
  conversationRoutes,
  messageRoutes,
};

module.exports = routes;
