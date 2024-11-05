import {createSlice} from "@reduxjs/toolkit"

const authSlice = createSlice({
    name:"auth",
    initialState:{
        user:null,
        suggestedUsers:[],
        userProfile:null,
        selectedUser:null,
    },
    reducers:{
        // actions
        setAuthUser:(state,action) => {
            state.user = action.payload;
        },
        setSuggestedUsers:(state,action) => {
            state.suggestedUsers = action.payload;
        },
        setUserProfile:(state,action) => {
            state.userProfile = action.payload;
        },
        setSelectedUser:(state,action) => {
            state.selectedUser = action.payload;
        }, 
        toggleFollow: (state, action) => {
          const targetUserId = action.payload;
    
          // Toggle follow in the user’s following list
          if (state.user.following.includes(targetUserId)) {
            state.user.following = state.user.following.filter((id) => id !== targetUserId);
          } else {
            state.user.following.push(targetUserId);
          }
           // Update userProfile followers list if the current profile is the followed/unfollowed user
      if (state.userProfile && state.userProfile._id === targetUserId) {
        if (state.userProfile.followers.includes(state.user._id)) {
          state.userProfile.followers = state.userProfile.followers.filter(
            (id) => id !== state.user._id
          );
        } else {
          state.userProfile.followers.push(state.user._id);
        }
      }
    
          // Update the suggested users' followers count
          const targetUser = state.suggestedUsers.find((user) => user._id === targetUserId);
          if (targetUser) {
            if (targetUser.followers.includes(state.user._id)) {
              targetUser.followers = targetUser.followers.filter((id) => id !== state.user._id);
            } else {
              targetUser.followers.push(state.user._id);
            }
          }
        },
      
    },
   
});
export const {
    setAuthUser, 
    setSuggestedUsers, 
    setUserProfile,
    setSelectedUser,
    toggleFollow,
} = authSlice.actions;
export default authSlice.reducer;