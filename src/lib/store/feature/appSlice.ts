// store/slices/categorySlice.ts
import { CategoriesState, Category } from "@/src/types/index.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: CategoriesState = {
  categories: [],
  isLoading: false,
  error: null,
  lastFetched: null,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategoriesLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setCategoriesSuccess: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
      state.isLoading = false;
      state.error = null;
      state.lastFetched = Date.now();
    },
    setCategoriesError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearCategories: (state) => {
      state.categories = [];
      state.error = null;
      state.lastFetched = null;
    },
  },
});

export const {
  setCategoriesLoading,
  setCategoriesSuccess,
  setCategoriesError,
  clearCategories,
} = categorySlice.actions;

export default categorySlice.reducer;
