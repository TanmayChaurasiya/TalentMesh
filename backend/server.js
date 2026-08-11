const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const mainRouter = require("./routes/main.route");


dotenv.config();
const app=express();

app.use(cors());


app.use(express.json());


app.use(mainRouter);
app.use(express.static("uploads"));
 


const start=async()=>{
    const port=process.env.port;
    const connectDB=await mongoose.connect(process.env.mongodb);
    app.listen(port,()=>{
        console.log("server listening at : ",port);

    });
}


start();