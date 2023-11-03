const authRoutes = require("./authRoutes");
const healthRoutes = require("./healthRoutes");
const conversationRoutes = require("./conversationRoutes");
const messageRoutes = require("./messageRoutes");
const userRoutes = require("./usersRoute");
const statusRoutes = require("./statusRoutes");

const routes = {
  authRoutes,
  healthRoutes,
  conversationRoutes,
  messageRoutes,
  userRoutes,
  statusRoutes,
};

module.exports = routes;
