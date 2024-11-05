import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
    name: "post",
    initialState: {
        posts: [], // Ensure posts is an array initially
        selectedPost:null,
        bookmarks: [],
        following:[],
        followers:[],
    },
    reducers: {
        setPosts: (state, action) => {
            state.posts = action.payload;
        },
        setSelectedPost:(state,action)=>{
            state.selectedPost=action.payload;
        },
        setUserBookmarks: (state, action) => {
            state.bookmarks = action.payload; // Set bookmarks
          },
        setFollowing: (state,action)=>{
            state.following = action.payload;
        },
        setFollowers: (state, action)=>{
            state.followers= action.payload;
        }
    },
});

export const { setPosts,setSelectedPost,setUserBookmarks  } = postSlice.actions;
export default postSlice.reducer;
