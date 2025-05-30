import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authService from '../services/authFeature';
import {toast} from 'react-toastify';
import Cookies from 'js-cookie'; 

const initialState = {
    user:JSON.parse(localStorage.getItem("user"))||null,
    users:[],
    income:null,
    isError :false,
    isSuccess:false,
    isLoading:false,
    message:"",
    isLoggedIn: false,

};

export const register = createAsyncThunk("auth/register", async (userData, thunkAPI) => {
  try {
    const response = await authService.register(userData);
    localStorage.setItem("user", JSON.stringify(response));
    return response;
  } catch (error) {
    const errorMessage = (error.response && error.response.data && error.response.message)
      || error.message
      || error.toString();
    return thunkAPI.rejectWithValue(errorMessage);
  }
});


export const login =createAsyncThunk("auth/login",async(userData,thunkAPI)=>{
    try{
        const response=await authService.login(userData);
         // ✅ Store token in cookies
    if (response.token) {
      Cookies.set('token', response.token, { expires: 1 }); // Store token for 1 day
    }
        localStorage.setItem("user",JSON.stringify(response));
      return response;
  } catch (error) {
    const errorMessage =(error.response && error.response.data &&error.response.message)||error.message||error.toString()||error;
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const logOut =createAsyncThunk("auth/logOut",async(_,thunkAPI)=>{
    try{
        await authService.logOut();
        localStorage.removeItem("user");
  } catch (error) {
    const errorMessage =(error.response && error.response.data &&error.response.message)||error.message||error.toString()||error;
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const getLogInstatus =createAsyncThunk("auth/status",async(_,thunkAPI)=>{
    try{
        return await authService.getLogInstatus();
  } catch (error) {
    const errorMessage =(error.response && error.response.data &&error.response.message)||error.message||error.toString()||error;
    return thunkAPI.rejectWithValue(errorMessage);
  }
});


export const getuserProfile =createAsyncThunk("auth/profile",async(_,thunkAPI)=>{
    try{
        return await authService.getuserProfile();
  } catch (error) {
    const errorMessage =(error.response && error.response.data && error.response.data.message)||error.message||error.toString()||error;
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const loginUserAsSeller =createAsyncThunk("auth/login-as-seller",async(userData,thunkAPI)=>{
    try{
        const response = await authService.loginUserAsSeller(userData);
        localStorage.setItem("user",JSON.stringify(response));
  } catch (error) {
    const errorMessage =(error.response && error.response.data &&error.response.message)||error.message||error.toString()||error;
    return thunkAPI.rejectWithValue(errorMessage);
  }
});


export const getUserIncome =createAsyncThunk("auth/get-income",async(_,thunkAPI)=>{
    try{ 
        return await authService.getUserIncome();
  } catch (error) {
    const errorMessage =(error.response && error.response.data && error.response.data.message)||error.message||error.toString()||error;
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const getIncome =createAsyncThunk("auth/get-income-of-admin",async(_,thunkAPI)=>{
  
    try{
        return await authService.getIncome();
  } catch (error) {
    const errorMessage =(error.response && error.response.data && error.response.data.message)||error.message||error.toString()||error;
    return thunkAPI.rejectWithValue(errorMessage);
  }
});


export const getAllUser =createAsyncThunk("auth/getallusers",async(_,thunkAPI)=>{
  
    try{
        return await authService.getAllUser();
  } catch (error) {
    const errorMessage =(error.response && error.response.data && error.response.data.message)||error.message||error.toString()||error;
    return thunkAPI.rejectWithValue(errorMessage);
  }
});



const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    RESET(state){
        state.isError=false;
        state.isLoading=false;
        state.isSuccess=false;
        state.message="";
    },
  },
  extraReducers:(builder)=>{
    builder
    .addCase(register.pending,(state)=>{
        state.isLoading=true
    })
    .addCase(register.fulfilled,(state,action)=>{
        state.isLoading=false;
        state.isSuccess=true;
        state.isLoggedIn=true;
        state.user=action.payload;

    })
    .addCase(register.rejected,(state,action)=>{
        state.isLoading=false;
        state.isError=true;
        state.message=action.payload;
        state.user=null;
        toast.error(action.payload);
    })

    


     .addCase(login.pending,(state)=>{
        state.isLoading=true
    })
    .addCase(login.fulfilled,(state,action)=>{
        state.isLoading=false;
        state.isSuccess=true;
        state.isLoggedIn=true;
        state.user=action.payload;

    })
    .addCase(login.rejected,(state,action)=>{
        state.isLoading=false;
        state.isError=true;
        state.message=action.payload;
        state.user=null;
        toast.error(action.payload);
    })



     .addCase(logOut.pending,(state)=>{
        state.isLoading=true
    })
    .addCase(logOut.fulfilled,(state,action)=>{
        state.isLoading=false;
        state.isSuccess=true;
        state.isLoggedIn=true;
        state.user=null;
        toast.success(action.payload);

    })
    .addCase(logOut.rejected,(state,action)=>{
        state.isLoading=false;
        state.isError=true;
        state.message=action.payload;
        toast.error(action.payload);
    })




    
     .addCase(getLogInstatus.pending,(state)=>{
        state.isLoading=true
    })
    .addCase(getLogInstatus.fulfilled,(state,action)=>{
        state.isLoading=false;
        state.isSuccess=true;
        state.isLoggedIn=action.payload;

    })
    .addCase(getLogInstatus.rejected,(state,action)=>{
        state.isLoading=false;
        state.isError=true;
        state.message=action.payload;
    })



    .addCase(getuserProfile.pending,(state)=>{
        state.isLoading=true
    })
    .addCase(getuserProfile.fulfilled,(state,action)=>{
        state.isLoading=false;
        state.isSuccess=true;
        state.isLoggedIn=true;
        state.user=action.payload;
        localStorage.setItem("user",JSON.stringify(action.payload));

    })
    .addCase(getuserProfile.rejected,(state,action)=>{
        state.isLoading=false;
        state.isError=true;
        state.message=action.payload;
        localStorage.removeItem("user");
        state.isLoggedIn=true;
    })


    
    .addCase(loginUserAsSeller.pending,(state)=>{
        state.isLoading=true
    })
    .addCase(loginUserAsSeller.fulfilled,(state,action)=>{
        state.isLoading=false;
        state.isSuccess=true;
        state.user=action.payload;
        state.isError=false;
        toast.success("You become a seller")
     

    })
    .addCase(loginUserAsSeller.rejected,(state,action)=>{
        state.isLoading=false;
        state.isError=true;
        state.message=action.payload;
        state.user=null;
        toast.error(action.payload)
    })



    .addCase(getUserIncome.pending,(state)=>{
        state.isLoading=true
    })
    .addCase(getUserIncome.fulfilled,(state,action)=>{
        state.isLoading=false;
        state.isSuccess=true;
        state.isLoggedIn=true;
        state.income=action.payload;

    })
    .addCase(getUserIncome.rejected,(state,action)=>{
        state.isLoading=false;
        state.isError=true;
        state.message=action.payload;
        state.isLoggedIn=true;
    })






    
    .addCase(getIncome.pending,(state)=>{
        state.isLoading=true
    })
    .addCase(getIncome.fulfilled,(state,action)=>{
        state.isLoading=false;
        state.isSuccess=true;
        state.isLoggedIn=true;
        state.income=action.payload;

    })
    .addCase(getIncome.rejected,(state,action)=>{
        state.isLoading=false;
        state.isError=true;
        state.message=action.payload;
        state.isLoggedIn=true;
    })



     .addCase(getAllUser.pending,(state)=>{
        state.isLoading=true
    })
    .addCase(getAllUser.fulfilled,(state,action)=>{
        state.isLoading=false;
        state.isSuccess=true;
        state.isLoggedIn=true;
        state.users=action.payload;
        state.totalUsers=action.payload?.length;

    })
    .addCase(getAllUser.rejected,(state,action)=>{
        state.isLoading=false;
        state.isError=true;
        state.message=action.payload;
        state.isLoggedIn=true;
    });
  },
});

export const {RESET} = authSlice.actions

export const selectIsLoggedIn =(state)=>state.auth.isLoggedIn|| false;
export const selectUser =(state)=>state.user.auth; 
export const selectIsSuccess =(state)=>state.user.isSuccess; 
export default authSlice.reducer