import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {isNavigating: boolean, isDark: boolean} = {isNavigating: false, isDark: false}

const appSlice = createSlice({
    initialState,
    name: "app",
    reducers: {
        setAppState: (state, action: PayloadAction<{field: "isNavigating" | "isDark", value: boolean}>)=>{
            state[action.payload.field] = action.payload.value
        }
    }
})

const appSliceReducer = appSlice.reducer

export const {setAppState} = appSlice.actions

export default appSliceReducer