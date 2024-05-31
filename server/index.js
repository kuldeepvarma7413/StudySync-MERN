require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// middleware
const requireAuth = require("./middleware/auth");

// routers
const userRouter = require("./routes/authRouter");
const contentRouter = require("./routes/contentRouter");
const courseRouter = require("./routes/courseRouter");
const subscribeRouter = require("./routes/subscribeRouter");
const reportRouter = require("./routes/reportRouter");

const port = process.env.PORT || 5000;

// connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");

    const app = express();

    // middleware
    app.use(cors());

    // routes which handle file uploads
    
    app.use(express.json({ limit: "50mb"}));
    app.use(express.urlencoded({ limit: "50mb", extended: true }));
    
    app.use((req, res, next) => {
      console.log(req.method, req.path);
      console.log(`Request Size: ${req.headers['content-length']} bytes`)
      next();
    });
    
    // routes
    app.use("/auth", userRouter);
    app.use("/content", requireAuth, contentRouter);
    app.use("/courses", requireAuth, courseRouter);
    app.use("/subscribe", subscribeRouter);
    app.use("/report", requireAuth,reportRouter);


    app.get("/", (req, res) => {
      res.send("Hello from StudySync Server!");
    });

    app.listen(port, (err) => {
      if (err) throw err;
      console.log(`Server is running on port ${port}}`);
    });
  })
  .catch((err) => console.log(err));
