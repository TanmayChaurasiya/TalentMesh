const User = require("./user.model");
const Post = require("./posts.model");

const mongoose = require("mongoose");

const CommentSchemaModel=mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post',

    },
    body:{
         type:String,
        required:true,
    },


});

const CommentSchema =mongoose.model("CommentSchema",CommentSchemaModel);


module.exports=CommentSchema;

 