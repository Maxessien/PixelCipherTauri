import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppSettings, AppSlice } from "../../types";
import { defaultSettings } from "../../utils/regHepers";

const initialState: AppSlice = {
  isNavigating: false,
  isDark: false,
  settings: defaultSettings,
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
    setSettings: (state, { payload }: PayloadAction<AppSettings>) => {
      state.settings = payload;
    },
  },
});

const appSliceReducer = appSlice.reducer;

export const { setAppState, setSettings } = appSlice.actions;

export default appSliceReducer;
