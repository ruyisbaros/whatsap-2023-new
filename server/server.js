require("dotenv").config();
const routes = require("./routes/index");
const express = require("express");
const fs = require("fs");
const cookieSession = require("cookie-session");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const { Server } = require("socket.io");
const { socketServer } = require("./SocketServer");

const app = express();

//Sockets
/* https://ineedsomething.herokuapp.com/ */
const key = fs.readFileSync("MyServer.key");
const cert = fs.readFileSync("MyServer.crt");
const options = {
  key,
  cert,
  requestCert: false,
  rejectUnauthorized: false,
};
const https = require("https").createServer(options, app);
const io = new Server(https, {
  pingTimeout: 6000,
  cors: {
    origin: `${process.env.FRONT_URL}`,
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  },
  pingInterval: 3000,
});

//file base middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static(__dirname + "/public"));
app.use(compression());
//Security middleware
app.use(mongoSanitize());
app.set("trust proxy", 1);
app.use(
  cookieSession({
    name: "session",
    //domain: "https://ineedsomething.org",
    keys: [`${process.env.KEY_ONE}`, `${process.env.KEY_TWO}`],
    maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
    //secure: true,
    secure: process.env.NODE_ENV === "production",
    //sameSite: "none", //use for production
  })
);
//app.use(cookieParser());
app.use(
  cors({
    origin: `${process.env.FRONT_URL}`,
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Origin",
      "X-Requested-Width",
      "Accept",
      "Authorization",
      "X-HTTP_Method-Override",
      "Access-Control-Allow-Origin",
    ],
    preflightContinue: false,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    optionsSuccessStatus: 200,
    maxAge: 600,
  })
);
app.use(helmet());

//DB connection
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("DB connection done");
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
mongoose.set("strictQuery", false);
mongoose.set("strictPopulate", false);

//Routes
app.use("", routes.healthRoutes);
app.use("/api/v1/auth", routes.authRoutes);
app.use("/api/v1/conversation", routes.conversationRoutes);
app.use("/api/v1/message", routes.messageRoutes);
app.use("/api/v1/users", routes.userRoutes);

//Socket functions
io.on("connection", (socket) => {
  socketServer(socket, io);
});

const port = process.env.PORT || 5000;

https.listen(port, () => {
  console.log(`Server runs at port: ${port}...`);
});
