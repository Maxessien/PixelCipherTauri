import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Image, ImagesSort, ImagesState } from "../../types";

const initialState: ImagesState = {
    files: [],
    search: "",
    selected: null,
    sort: "alpha",
    pages: {current: 1, total: 1}
}

const imageSlice = createSlice({
    initialState,
    name: "images",
    reducers: {
        setFiles: (state, {payload}: PayloadAction<Image[]>)=>{
            state.files = payload.slice(0, 30)
            state.pages = {current: 1, total: 30}
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
        setPage: (state, {payload}: PayloadAction<{current: number, total: number, data: Image[]}>)=>{
            state.pages = payload
            const newF = payload.data.slice((payload.current - 1) * 30, payload.current * 30)
            state.files = newF
        }
    }
})

const imagesReducer = imageSlice.reducer

export const {setFiles, setSearchQuery, setSelected, setSort, setPage} = imageSlice.actions
export default imagesReducer