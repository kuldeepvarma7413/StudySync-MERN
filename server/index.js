require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// middleware
const requireAuth = require("./middleware/auth");

// routers
const userRouter = require("./routes/authRouter");
const contentRouter = require("./routes/contentRouter");
const subscribeRouter = require("./routes/subscribeRouter");

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
    app.use((req, res, next)=>{
        console.log(req.method, req.path)
        next()
    })

    // routes
    app.use("/auth", userRouter);
    app.use("/content", requireAuth, contentRouter);
    app.use('/subscribe', subscribeRouter)

    app.get("/", (req, res) => {
      res.send("Hello from StudySync Server!");
    });

    app.listen(port, (err) => {
      if (err) throw err;
      console.log(`Server is running on port ${port}}`);
    });
  })
  .catch((err) => console.log(err));
