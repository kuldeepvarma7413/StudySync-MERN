require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// middleware
const requireAuth = require("./middleware/auth");

// routers
const userRouter = require("./routes/authRouter");
const contentRouter = require("./routes/contentRouter");

const port = process.env.PORT || 5000;

// connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");

    const app = express();

    // middleware
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // routes
    app.use("/auth", userRouter);
    app.use("/content", requireAuth, contentRouter);

    app.get("/", (req, res) => {
      res.send("Hello from StudySync Server!");
    });
    app.listen(port, (err) => {
      if (err) throw err;
      console.log(`Server is running on port ${port}}`);
    });
  })
  .catch((err) => console.log(err));
