const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
     type: String,
  },
  desc: {
     type: String,
   },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
  image: String,
},
  { timestamps: true }
);
const postModel = mongoose.model("Post", postSchema);
module.exports = postModel;