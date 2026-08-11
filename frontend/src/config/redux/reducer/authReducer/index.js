import { createSlice } from "@reduxjs/toolkit";
import { getAboutUser, getAllUsers, getConnectionsRequest, getMyConnectionRequest, loginUser } from "../../action/authAction";
import { registerUser } from "../../action/authAction";


const initialState = {
  user: undefined,
  isError: false,
  isSuccess: false,
  isLoading: false,
  loggedIn: false,
  message: "",
  profileFetched: false,
  connections: [],
  connectionRequest: [],
  isTokenThere:false,
  all_user:[],
  all_profile_fetched:false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
    handleLoginUser: (state) => {
      state.message = "hello";
    },
    emptyMessage:(state)=>{
      state.message="",
      state.isError=false
    },
    setTokenIsThere:(state)=>{
      state.isTokenThere=true;
    },
    setTokenIsNotThere:(state)=>{
      state.isTokenThere=false;
    },
  },
  extraReducers: (builders) => {
    builders
      .addCase(loginUser.pending, (state, action) => {
        state.isLoading = true;
        state.message = "Knocking the door";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.loggedIn = true;
        state.message = "Login is Successfull";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || action.error.message;
      })
      .addCase(registerUser.pending, (state, action) => {
        state.isLoading = true;
        state.message = "Registering User......";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        //  
        state.message = "Registered is Successfull";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        console.log("Rejected Action:", action);
        state.message = action.payload ||  action.error.message;
      })
      .addCase(getAboutUser.fulfilled,(state,action)=>{
        state.isLoading=false;
        state.isError=false;
        state.profileFetched=true;
        state.user=action.payload.profile;
          })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.all_user = action.payload.profiles;
        state.all_profile_fetched=true;
        state.message = "Profile of all users are fetched Successfull";
      })
      .addCase(getConnectionsRequest.fulfilled,(state,action)=>{
        state.connections=action.payload
      })
      .addCase(getConnectionsRequest.rejected,(state,action)=>{
        state.message=action.payload
        //  console.log("payloadss",action.payload);
      })
      .addCase(getMyConnectionRequest.fulfilled,(state,action)=>{
        state.connectionRequest=action.payload
        // console.log("payloadsss",action.payload);
      })
      .addCase(getMyConnectionRequest.rejected,(state,action)=>{
        state.connectionRequest=action.payload
      });
      
  },
});

export const {reset,emptyMessage,setTokenIsNotThere,setTokenIsThere}=authSlice.actions;
export default authSlice.reducer;
