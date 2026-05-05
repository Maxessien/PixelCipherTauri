import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Image, ImagesSort, ImagesState } from "../../types";

const initialState: ImagesState = {
    files: [],
    search: "",
    selected: null,
    sort: "alpha"
}

const imageSlice = createSlice({
    initialState,
    name: "images",
    reducers: {
        setFiles: (state, {payload}: PayloadAction<Image[]>)=>{
            state.files = payload
        },
        setSelected: (state, {payload}: PayloadAction<Image | null>)=>{
            state.selected = payload
        },
        setSearchQuery: (state, {payload}: PayloadAction<string>)=>{
            state.search = payload
        },
        setSort: (state, {payload}: PayloadAction<ImagesSort>)=>{
            state.sort = payload
        },
    }
})

const imagesReducer = imageSlice.reducer

export const {setFiles, setSearchQuery, setSelected, setSort} = imageSlice.actions
export default imagesReducer