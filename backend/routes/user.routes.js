const express =require("express");
const {updateUserProfile, register, login, uploadProfilePicture, getUserAndProfile, updateProfileData, getAllUserProfile, downloadProfile, sendConnectionRequest, getMyConnectionRequest, whatAreMyConnection, acceptConnectionRequest, getUserProfileAndUserBasedOnUsername } = require("../controller/user.controller.js");
const multer=require("multer");
const userRouters=express.Router();

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/')
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    },
});

const uploads=multer({storage:storage});

userRouters.post("/update_profile_picture",uploads.single('profile_picture'),uploadProfilePicture);

userRouters.post("/register",register);

userRouters.post("/login",login);

userRouters.post("/update_profile",updateUserProfile);

userRouters.get("/get_user_and_profile",getUserAndProfile);

userRouters.post("/update_profile_date",updateProfileData);

userRouters.get("/user/get_all_users",getAllUserProfile);

userRouters.get("/user/download_resume",downloadProfile);

userRouters.post("/user/send_connection_request",sendConnectionRequest);

userRouters.get("/user/getConnectionRequests",getMyConnectionRequest);

userRouters.get("/user/user_connection_request",whatAreMyConnection);

userRouters.post("/user/accept_connection_request",acceptConnectionRequest);
 
userRouters.get("/user/get_user_profile_based_on_username",getUserProfileAndUserBasedOnUsername);

module.exports= userRouters;
