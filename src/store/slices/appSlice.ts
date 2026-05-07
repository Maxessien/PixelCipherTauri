import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppSettings, AppSlice } from "../../types";

const initialState: AppSlice = {
  isNavigating: false,
  isDark: false,
  settings: {
    autoCopyDecoded: true,
    confirmBeforeClearing: true,
    language: "English",
    saveEncodingHistory: true,
    theme: "system",
  },
};

const appSlice = createSlice({
  initialState,
  name: "app",
  reducers: {
    setAppState: (
      state,
      action: PayloadAction<{
        field: "isNavigating" | "isDark";
        value: boolean;
      }>,
    ) => {
      state[action.payload.field] = action.payload.value;
    },
    setSettings: (state, {payload}: PayloadAction<AppSettings>)=>{
        state.settings = payload
    }
  },
});

const appSliceReducer = appSlice.reducer;

export const { setAppState, setSettings } = appSlice.actions;

export default appSliceReducer;
