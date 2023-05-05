const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors"); /* for allowing cross platform request */
const fs = require("fs");
const path = require("path");
const loadSeedData = require("./utils/loadSeed")

// App Config
const app = express();
const port = process.env.PORT || 3000

//DATABASE FOR CONNECTION
const userRouter = require("./routes/user");
const postRouter = require("./routes/post");

// MiddleWare
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// FOR IMAGE UPLOADS TO THE DATABASE
fs.readdir("./uploads", { encoding: "utf8" }, (err) => {
  if (err) {
    fs.mkdirSync("./uploads", { encoding: "utf8" }, (err) => {
      if (err) {
        console.log("Could not create directory:" + err.message);
      } else {
        console.log("Directory created successfully");
      }
    });
  } else {
    console.log("Directory already exist");
  }
});
app.use(express.static(path.join(__dirname, "uploads")));

loadSeedData();

//Db Config
const connectToMongo = async () => {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("Connected to MongoDB");
};
connectToMongo();

//API Endpoints
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);

//Listener
app.listen(port, () => console.log(`Listening on localhost: ${port}`))