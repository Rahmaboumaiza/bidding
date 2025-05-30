import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFavoritesAPI, addFavoriteAPI, removeFavoriteAPI } from '../services/favoriteService';

const initialState = {
  items: [], // Changed from 'favorites' to 'items' for consistency
  status: 'idle',
  error: null
};

export const fetchFavorites = createAsyncThunk(
  'favorites/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await getFavoritesAPI();
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const addFavorite = createAsyncThunk(
  'favorites/add',
  async (productId, { rejectWithValue }) => {
    try {
      return await addFavoriteAPI(productId);
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const removeFavorite = createAsyncThunk(
  'favorites/remove',
  async (productId, { rejectWithValue }) => {
    try {
      await removeFavoriteAPI(productId);
      return { id: productId }; // Return just the ID for removal
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch cases
      .addCase(fetchFavorites.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Add cases
      .addCase(addFavorite.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Remove cases
      .addCase(removeFavorite.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = state.items.filter(item => item._id !== action.payload.id);
      })
      .addCase(removeFavorite.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export default favoritesSlice.reducer;