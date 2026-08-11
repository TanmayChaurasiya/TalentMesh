import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { connection } from "next/server";

export const loginUser = createAsyncThunk(
  "user/login",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post("/login", {
        email: user.email,
        password: user.password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      } else {
        return thunkAPI.rejectWithValue({ message: "token not provided" });
      }

      return thunkAPI.fulfillWithValue(response.data.token);
    } catch (err) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const registerUser = createAsyncThunk(
  "user/register",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post("/register", {
        username: user.username,
        name: user.name,
        email: user.email,
        password: user.password,
      });

      return thunkAPI.fulfillWithValue("Registered Successfully,Please Login!");
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  },
);

export const getAboutUser = createAsyncThunk(
  "user/getAboutUser",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.get("/get_user_and_profile", {
        params: { token: user.token },
      });

      console.log(response.data);

      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  },
);

export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.get("/user/get_all_users");

      console.log(response.data);

      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  },
);

export const sendConnectionRequest = createAsyncThunk(
  "user/sendConnectionRequest",

  async (user, thunkAPI) => {
    console.log("respppp",user.token);
    try {
      console.log("connectionId:", user.user_id);
      const response = await clientServer.post(
        "/user/send_connection_request",
        {
          token: user.token, connectionId: user.user_id },
        
      );

      console.log(response.data);
      thunkAPI.dispatch(getConnectionsRequest({token:user.token}));

      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  },
);

export const getConnectionsRequest = createAsyncThunk(
  "user/getConnectionsRequest",
  async (user, thunkAPI) => {
    try {
      console.log("main",user.token);
      const response = await clientServer.get("/user/getConnectionRequests", {
        params: { token: user.token },
      });

      console.log(response.data);
      
      return thunkAPI.fulfillWithValue(response.data.connections);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  },
);

export const getMyConnectionRequest = createAsyncThunk(
  "user/getMyConnectionRequest",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.get("/user/user_connection_request", {
        params: { token: user.token },
      });

      console.log(response.data);

      return thunkAPI.fulfillWithValue(
        response.data
      );
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  },
);

export const AcceptConnection = createAsyncThunk(
  "user/AcceptConnection",
  async (user, thunkAPI) => {
     console.log("usersss",user.connectionId);
    try {
      const response = await clientServer.post(
        "/user/accept_connection_request",
        {
          
            token: user.token,
            requestId: user.connection_id,
            action_type: user.action,
          
        },
      );
     
      console.log(response.data);
      thunkAPI.dispatch(getConnectionsRequest({token:user.token}));
      thunkAPI.dispatch(getMyConnectionRequest({token:user.token}));
      return thunkAPI.fulfillWithValue(response.data.connections);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  },
);
