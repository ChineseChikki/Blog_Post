const postModel = require("../models/Post");

//FNX THAT ALLOWS A USER TO BE ABLE TO CREATE A POST
exports.createPost = async (req, res) => {
  const newBlog = req.body;
  const user = res.locals.id;

  // Attaches the ID of the user to the new blog
  newBlog.user = user;
   if (req.file) {
    newBlog.image = req.protocol + "://" + req.hostname + "/" + req.file.filename;
  }
  try {
    const post = await postModel.create(newBlog);
    if (post) {
      return res.status(201).json({
        success: true,
        message: "Post created successfully",
        data: post,
      });
    } else {
      return res.status(400).json({ success: false, message: "Please upload a valid image" });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//FNX TO UPDATE OUR BLOG POST
exports.updatePostById = async (req, res) => {
  const id = req.params.postId;
  const postToUpdate = req.body;
    if (req.file) {
    postToUpdate.image = req.protocol + "://" + req.hostname + "/" + req.file.filename;
  }
  try {
    //find the post
    const foundPost = await postModel.findById(id);
    if (foundPost) {
      const updatedPost = await postModel.findByIdAndUpdate(
        id,
        { $set: postToUpdate },
        {new: true}
      );
       if (updatedPost) {
         return res.status(200).json({ success: true, message: "Post updated successfully", data: updatedPost, });
       } else {
         return res.status(404).json({ success: false, message: "Failed to Update Post" });
        }
    } else {
      return res.status(404).json({ success: false, message: "Post not found" });
    }
   
  }
  catch(error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    
  }
}

//THIS FNX GETS A SINGLE POST BY IT'S ID

exports.getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await postModel.findById(id).populate("user", "-password");
    if (post) {
      return res.json({
        success: true,
        message: "post retrieved successfully",
        data: post,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Post not Found",
      });
    }
  }
  catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//FNX TO GET ALL BLOG POSTS FROM OUR DB
exports.getPosts = async (req, res)=> {
  try {
    const posts = await postModel
      .find({})
      .sort({ updateAt: -1 })
      .populate("user", "-password");
    if (posts) {
      return res.status(200).json({
        success: true,
        message: "Posts retrieved successfully",
        data: posts,
      });
    } else {
      return res.status(404).json({success: false, message: "Failed to retrieve posts"})
    }
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error", error, }); 
  }
}

//FNX DELETES A POST FROM OUR DATABASE
exports.deletePostById = async (req, res) => {
  //gets the post id from req.params
  const id = req.params.id;
  try {
    //find and delete the post
    const deletePost = await postModel.findByIdAndDelete(id)
    //if deleted
    if (deletePost) {
      return res.status(200).json({ success: true, message: "Post deleted successfully" });
    } else {
      return res.status(404).json({ success: false, message: "Post not found", data: deletePost });
    } 
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}