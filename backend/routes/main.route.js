const express = require("express");
const postsRoutes=require("./posts.routes");
const userRouters = require("./user.routes");




const mainRouter=express.Router();

mainRouter.use(postsRoutes);
mainRouter.use(userRouters);


module.exports= mainRouter;