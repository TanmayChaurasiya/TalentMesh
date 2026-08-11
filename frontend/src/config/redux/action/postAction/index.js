import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Renamed from loginUser to getAllPosts to match your Slice import
export const getAllPosts = createAsyncThunk(
  "post/getAllPosts",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("/posts");
      console.log("API Response:", response.data);
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      // Safely access the error response
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const createPost = createAsyncThunk(
  "post/createPost",
  async (userData, thunkAPI) => {
    const { file, body } = userData;

    try {
      const formData = new FormData();
      formData.append("token", localStorage.getItem("token"));
      formData.append("body", body);
      formData.append("media", file);

      const response = await clientServer.post("/createPosts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        return thunkAPI.fulfillWithValue("Post Uploaded");
      } else {
        return thunkAPI.fulfillWithValue("Post Not Uploaded");
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (post_id, thunkAPI) => {
    try {
      const response = await clientServer.delete("/deletePost", {
        data: {
          token: localStorage.getItem("token"),
          post_id: post_id.post_id,
        },
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const deleteComment = createAsyncThunk(
  "post/deleteComment",
  async (comment_id, thunkAPI) => {
    try {
      console.log("commentId=",comment_id)
      const response = await clientServer.delete("/deleteComments", {
        data: {
          token: localStorage.getItem("token"),
          comment_id: comment_id.comment_id,
        },
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const incrementLike = createAsyncThunk(
  "post/incrementLike",
  async (post_id, thunkAPI) => {
    try {
      const response = await clientServer.post("/increment_likes", {
        post_id: post_id.post_id,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const getAllComment = createAsyncThunk(
  "post/getAllComment",
  async (postData, thunkAPI) => {
    try {
      const response = await clientServer.get("/get_all_comments", {
        params: {
          post_id: postData.post_id,
        },
      });
      console.log("response", response.data);
      return thunkAPI.fulfillWithValue({
        comments: response.data,
        post_id: postData.post_id,
      });
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const postComment = createAsyncThunk(
  "post/postComment",
  async (commentData, thunkAPI) => {
    try {
      console.log({
        post_id: commentData.post_id,
        body: commentData.body,
      });

      const response = await clientServer.post("/postComments", {
        token: localStorage.getItem("token"),
        post_id: commentData.post_id,
        commentBody: commentData.body,
      });

      return response.thunkAPI.fulfillWithValue(response.data);

    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  },
);
