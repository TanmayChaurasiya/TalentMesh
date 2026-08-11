/*
*
*Steps for State Management
*Submit Action
*Handle Action in it's reducer
*Register Here->Reducer
*
*/

import authReducer from "./reducer/authReducer";
import postReducer from "./reducer/postReducer";
import { configureStore } from "@reduxjs/toolkit";

export const store=configureStore({
    reducer:{
        auth : authReducer,
        posts:postReducer
    }
})