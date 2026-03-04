import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: LocationState = {
  latitude: null,
  longitude: null,
  isLoading: false,
  error: null,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocationLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setLocationSuccess: (
      state,
      action: PayloadAction<{ latitude: number; longitude: number }>,
    ) => {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
      state.isLoading = false;
      state.error = null;
    },
    setLocationError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearLocation: (state) => {
      state.latitude = null;
      state.longitude = null;
      state.error = null;
    },
  },
});

export const {
  setLocationLoading,
  setLocationSuccess,
  setLocationError,
  clearLocation,
} = locationSlice.actions;

export default locationSlice.reducer;
