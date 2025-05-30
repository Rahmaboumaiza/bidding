import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import productService from '../services/productService';
import {toast} from 'react-toastify';

const initialState = {
    products:[],
    userproducts:[],
    wonproducts:[],
    product:null,
    isError :false,
    isSuccess:false,
    isLoading:false,
    message:"",

};

export const createProduct =createAsyncThunk("product/create",async(formData,thunkAPI)=>{
    try{
        return await productService.createProduct(formData);
  } catch (error) {
    const errorMessage =(error.response && error.response.data &&error.response.data.message)||error.message||error.toString()||error;
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const getAllProduct =createAsyncThunk("product/public/get-products",async(_,thunkAPI)=>{
    try{
        return await productService.getAllProduct();
  } catch (error) {
    const errorMessage =(error.response && error.response.data &&error.response.data.message)||error.message||error.toString()||error;
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const getProduct =createAsyncThunk("product/public/get-product",async(id,thunkAPI)=>{
    try{
        return await productService.getProduct(id);
  } catch (error) {
    const errorMessage =(error.response && error.response.data &&error.response.data.message)||error.message||error.toString()||error;
    return thunkAPI.rejectWithValue(errorMessage);
  }
});


export const getAllProductOfUser =createAsyncThunk("product/get-user-products",async(_,thunkAPI)=>{
    try{
        return await productService.getAllProductOfUser();
  } catch (error) {
    const errorMessage =(error.response && error.response.data &&error.response.data.message)||error.message||error.toString()||error;
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const getAllWonProductOfUser =createAsyncThunk("product/get-woned-user-products",async(_,thunkAPI)=>{
    try{
        return await productService.getAllWonProductOfUser();
  } catch (error) {
    const errorMessage =(error.response && error.response.data &&error.response.data.message)||error.message||error.toString()||error;
    return thunkAPI.rejectWithValue(errorMessage);
  }
});


export const deleteProduct =createAsyncThunk("product/delete",async(id,thunkAPI)=>{
    try{
        return await productService.deleteProduct(id);
  } catch (error) {
    const errorMessage =(error.response && error.response.data &&error.response.data.message)||error.message||error.toString()||error;
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const updateProduct =createAsyncThunk("product/user/update",async({id,formData},thunkAPI)=>{
    try{
        return await productService.updateProduct(id,formData);
  } catch (error) {
    const errorMessage =(error.response && error.response.data &&error.response.data.message)||error.message||error.toString()||error;
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const updateProductByAdmin =createAsyncThunk("product/admin/update",async({id,formData},thunkAPI)=>{
    try{
        return await productService.updateProductByAdmin(id,formData);
  } catch (error) {
    const errorMessage =(error.response && error.response.data &&error.response.data.message)||error.message||error.toString()||error;
    return thunkAPI.rejectWithValue(errorMessage);
  }
});


export const updateVerify = createAsyncThunk(
  "product/admin/updateVerify",
  async ({ id, formData }, thunkAPI) => {
    try {
      return await productService.updateVerify(id, formData);
    } catch (error) {
      const errorMessage =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        "Something went wrong";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);


export const expireProduct = createAsyncThunk(
  'products/expireProduct',
  async (productId, thunkAPI) => {
    try {
      return await productService.expireProduct(productId);
    } catch (error) {
    const errorMessage =(error.response && error.response.data &&error.response.data.message)||error.message||error.toString()||error;
    return thunkAPI.rejectWithValue(errorMessage);
  }
  }
);


const productSlice=createSlice({
    name:"product",
    initialState,
    reducers:{},
     extraReducers:(builder)=>{
            builder
            .addCase(createProduct.pending,(state)=>{
                state.isLoading=true
            })
            .addCase(createProduct.fulfilled,(state,action)=>{
                state.isLoading=false;
                state.isSuccess=true; 
                state.isError=false;
                state.products.push(action.payload);
                toast.success("Product has been created");
        
            })
            .addCase(createProduct.rejected,(state,action)=>{
                state.isLoading=false;
                state.isError=true;
                state.message=action.payload;
                toast.error(action.payload);
            })

              .addCase(getAllProduct.pending,(state)=>{
                state.isLoading=true
            })
            .addCase(getAllProduct.fulfilled,(state,action)=>{
                state.isLoading=false;
                state.isSuccess=true; 
                state.isError=false;
                state.products=action.payload;
        
            })
            .addCase(getAllProduct.rejected,(state,action)=>{
                state.isLoading=false;
                state.isError=true;
                state.message=action.payload;
            })

               .addCase(getProduct.pending,(state)=>{
                state.isLoading=true
            })
            .addCase(getProduct.fulfilled,(state,action)=>{
                state.isLoading=false;
                state.isSuccess=true; 
                state.isError=false;
                state.product=action.payload;
        
            })
            .addCase(getProduct.rejected,(state,action)=>{
                state.isLoading=false;
                state.isError=true;
                state.message=action.payload;
            })



             .addCase(getAllProductOfUser.pending,(state)=>{
                state.isLoading=true
            })
            .addCase(getAllProductOfUser.fulfilled,(state,action)=>{
                state.isLoading=false;
                state.isSuccess=true; 
                state.isError=false;
                state.userproducts=action.payload;
        
            })
            .addCase(getAllProductOfUser.rejected,(state,action)=>{
                state.isLoading=false;
                state.isError=true;
                state.message=action.payload;
            })

            
             .addCase(getAllWonProductOfUser.pending,(state)=>{
                state.isLoading=true
            })
            .addCase(getAllWonProductOfUser.fulfilled,(state,action)=>{
                state.isLoading=false;
                state.isSuccess=true; 
                state.isError=false;
                state.wonproducts=action.payload;
        
            })
            .addCase(getAllWonProductOfUser.rejected,(state,action)=>{
                state.isLoading=false;
                state.isError=true;
                state.message=action.payload;
            })


            .addCase(deleteProduct.pending,(state)=>{
                state.isLoading=true
            })
            .addCase(deleteProduct.fulfilled,(state,action)=>{
                state.isLoading=false;
                state.isSuccess=true; 
                state.isError=false;
                toast.success("Product deleted successfully")
        
            })
            .addCase(deleteProduct.rejected,(state,action)=>{
                state.isLoading=false;
                state.isError=true;
                state.message=action.payload;
                toast.error(action.payload);
            })



            .addCase(updateProduct.pending,(state)=>{
                state.isLoading=true
            })
            .addCase(updateProduct.fulfilled,(state,action)=>{
                state.isLoading=false;
                state.isSuccess=true; 
                state.isError=false;
                state.product = action.payload;
                toast.success("Product updated successfully")
        
            })
            .addCase(updateProduct.rejected,(state,action)=>{
                state.isLoading=false;
                state.isError=true;
                state.message=action.payload;
                toast.error(action.payload);
            })


             .addCase(updateProductByAdmin.pending,(state)=>{
                state.isLoading=true
            })
            .addCase(updateProductByAdmin.fulfilled,(state,action)=>{
                state.isLoading=false;
                state.isSuccess=true; 
                state.isError=false;
                state.message= action.payload;
                toast.success("Product updated successfully")
        
            })
            .addCase(updateProductByAdmin.rejected,(state,action)=>{
                state.isLoading=false;
                state.isError=true;
                state.message=action.payload;
                toast.error(action.payload);
            })
            

             .addCase(updateVerify.pending,(state)=>{
                state.isLoading=true
            })
            .addCase(updateVerify.fulfilled,(state,action)=>{
                state.isLoading=false;
                state.isSuccess=true; 
                state.isError=false;
                state.message = action.payload?.message || "Verification updated successfully";

                  // Optional: update the specific product in the state if you want instant UI update
                const updatedProduct = action.payload?.data;
                if (updatedProduct) {
                  state.products = state.products.map((product) =>
                 product._id === updatedProduct._id ? updatedProduct : product
               );
              }
               // toast.success("Verification updated successfully");
        
            })
            .addCase(updateVerify.rejected,(state,action)=>{
                state.isLoading=false;
                state.isError=true;
                state.message=action.payload;
                toast.error(action.payload);
            })

            .addCase(expireProduct.pending, (state) => {
                 state.isLoading=true
              })
            .addCase(expireProduct.fulfilled, (state, action) => {
                state.isLoading = false;

               // Update the expired flag in the product
               const index = state.products.findIndex(
               (product) => product._id === action.payload
               );
               if (index !== -1) {
                state.products[index].isExpired = true;
                }
               })
            .addCase(expireProduct.rejected, (state, action) => {
                state.isLoading= false;
                 state.isError= action.payload;
            });
  
    },
});


export const selectProduct =(state)=>state.product.product; 

export default productSlice.reducer;