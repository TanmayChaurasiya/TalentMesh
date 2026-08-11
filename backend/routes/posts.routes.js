const express =require("express");
const { activeChech, createPost,commentPost,deleteComment, getAllPosts ,deletePost,get_comments_by_post, implementLikes, decrementLikes} = require("../controller/posts.controller.js");
const multer=require("multer");
const postsRouters=express.Router();

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/')
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    },
});

const uploads=multer({storage:storage});

postsRouters.get("/",activeChech);
postsRouters.post("/createPosts",uploads.single('media'),createPost);
postsRouters.get("/posts",getAllPosts);
postsRouters.delete("/deletePost",deletePost);
postsRouters.get("/get_all_comments",get_comments_by_post);
postsRouters.post("/postComments",commentPost);
postsRouters.delete("/deleteComments",deleteComment);
postsRouters.post("/increment_likes",implementLikes);
postsRouters.post("/decrement_likes",decrementLikes);

module.exports= postsRouters;


// nsfw