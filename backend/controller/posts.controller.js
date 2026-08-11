const Profile = require("../models/profiles.model");
const User = require("../models/user.model");
const Post = require("../models/posts.model");
const bcrypt = require("bcrypt");
const CommentSchema = require("../models/comments.model");

const activeChech = (req, res) => {
  return res.status(200).json({ message: "Running" });
};

const createPost = async (req, res) => {
  try {
    console.log("Body:", req.body);
    console.log("File:", req.file);
    const { token } = req.body;

    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const post = new Post({
      userId: user._id,
      body: req.body.body,
      media: req.file != undefined ? req.file.filename : "",
      fileType: req.file != undefined ? req.file.mimetype.split("/")[1] : "",
    });

    await post.save();

    return res.status(200).json({ message: "Post is created" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const post = await Post.find().populate(
      "userId",
      "name username email profilePicture",
    );
    return res.json({ post });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const { token, post_id } = req.body;
    const user = await User.findOne({ token }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const post = await Post.findOne({ _id: post_id });
    if (!post) {
      return res.status(404).json({ message: "Post is not found" });
    }
    if (post.userId.toString() !== user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await Post.deleteOne({ _id: post_id });
    return res.json({ message: "Post is deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const commentPost = async (req, res) => {
  try {
    const { token, post_id,commentBody } = req.body;
    const user = await User.findOne({ token: token }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User not exits!" });
    }
    const post = await Post.findOne({ _id: post_id });
    if (!post) {
      return res.status(404).json({ message: "Post not exits!" });
    }

    const comments = new CommentSchema({
      userId: user._id,
      postId: post._id,
      body: commentBody,
    });

    await comments.save();
    return res.json({ message: "Comment Save" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const get_comments_by_post = async (req, res) => {
  try {
    const { post_id } = req.query;
    console.log(`postId =`,post_id);

    const comments = await CommentSchema.find({ postId: post_id }).populate("userId","username name");

    if (!comments) {
      return res.status(404).json({ message: "Comments not exits!" });
    }

    return res.json( comments.reverse());
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { token, comment_id } = req.body;
    console.log(comment_id);
    const user = await User.findOne({ token }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const comment = await CommentSchema.findOne({ _id: comment_id });
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

     if(comment.userId.toString() !== user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await CommentSchema.deleteOne({_id:comment_id});

    return res.json({message:"Comment is deleted"});

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const implementLikes=async(req,res)=>{
  const {post_id}=req.body;
  try{
    const post=await Post.findOne({_id:post_id});
    if(!post){
      return res.status(404).json({message:"Their is no post!"});
    }
    post.likes=post.likes + 1;

    await post.save();

    return res.json({message:"Likes Incremented"});


  }catch(err){
    return res.status(500).json({message:err.message});
  }
}

const decrementLikes=async(req,res)=>{
  const {post_id}=req.body;
  try{
    const post=await Post.findOne({_id:post_id});
    if(!post){
      return res.status(404).json({message:"Their is no post!"});
    }
    if(post.likes>0){
    post.likes=post.likes - 1;
  }
  else{
    return res.status(404).json({message:"The post is not liked by the users"});
  }
    await post.save();

    return res.json({message:"Likes decremented"});


  }catch(err){
    return res.status(500).json({message:err.message});
  }
}

module.exports = {
  activeChech,
  createPost,
  getAllPosts,
  deletePost,
  commentPost,
  get_comments_by_post,
  deleteComment,
  implementLikes,
  decrementLikes,
};
