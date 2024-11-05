import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";
import {useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { toggleFollow} from "@/redux/authSlice";

const SuggestedUsers = () => {
  const { suggestedUsers , user} = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const followOrUnfollowUser = async (targetUserId) => {
    try {
      const response = await axios.post(`http://localhost:8000/api/v1/user/followorunfollow/${targetUserId}`,{}, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
     
    }
  };

  const handleFollowToggle = async (targetUserId) => {
    try {
      const result = await followOrUnfollowUser(targetUserId);
      if (result.success) {
        dispatch(toggleFollow(targetUserId));

        
      }
    } catch (error) {
      console.error("Failed to follow/unfollow user:", error);
    }
  };

  return (
    <div className="my-6">
      <div className="flex items-center text-sm justify-between">
        <h1 className="font-semibold text-gray-600 ">Suggested for you</h1>
        <span className="text-[#3BADF8] text-sm font-bold cursor-pointer hover:text-[#4b9dd3]">See All</span>
      </div>
      <hr />
      {suggestedUsers?.map((users) => {
        const isFollowing = user.following.includes(users._id);
        return (
          <div key={users._id} className="flex items-center justify-between my-5">
            <div className="flex items-center gap-2">
              <Link to={`/profile/${users?._id}`}>
                <Avatar>
                  <AvatarImage className="max-w-12 rounded-full bg-gray-200 " src={users?.profilePicture} alt="post_image" />
                  <AvatarFallback  className="rounded-full bg-gray-200 w-12 h-12 p-2">CN</AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <h1 className="font-semibold text-sm">
                  <Link to={`/profile/${users?._id}`}>{users?.username}</Link>
                </h1>
                <span className="text-gray-600 text-sm">
                  {users?.bio || "Bio here..."}
                </span>
              </div>
            </div>
            <button
              onClick={() => handleFollowToggle(users._id)}
              className="text-[#3BADF8] text-sm font-bold cursor-pointer hover:text-[#4b9dd3]"
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default SuggestedUsers;
