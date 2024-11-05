import useGetUserProfile from "@/hooks/useGetUserProfile";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

import axios from "axios";
import { AtSign, Heart, MessageCircle } from "lucide-react";
import { toggleFollow, setUserProfile } from "@/redux/authSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const [activeTab, setActiveTab]= useState('posts')
  const { userProfile,user } = useSelector((store) => store.auth);
  console.log(userProfile)
  const isLoggedInuser = user?._id === userProfile?._id;
  const isFollowing = user?.following.includes(userProfile?._id);

  const handleTab =(tab)=>{
    setActiveTab(tab)
  }

  const displayedPost = activeTab ==='posts' ? userProfile?.posts : userProfile?.bookmarks;

  const handleFollowToggle = async () => {
    try {
      const response = await axios.post(`http://localhost:8000/api/v1/user/followorunfollow/${userProfile._id}`,{}, {withCredentials:true});
      if (response.data.success) {
        dispatch(toggleFollow(userProfile._id));
      }
    } catch (error) {
      console.error("Failed to follow/unfollow user:", error);
    }
  };

  return (
    <div className="flex justify-center max-w-5xl mx-auto pl-24 pt-10">
     <div className="flex flex-col gap-20 p-8">
     <div className="grid grid-cols-2">
        <section className="m-auto">
          <Avatar className="h-32 w-32">
            <AvatarImage src={userProfile?.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </section>
        <section>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">
                {userProfile?.username}
              </span>
              {isLoggedInuser ? (
                <>
                <Link to='/account/edit'>

                  <Button
                    variant="secondary"
                    className="hover:bg-gray-200 h-8 mr-4"
                  >
                    Edit Profile
                  </Button>
                </Link>
                  <Button
                    variant="secondary"
                    className="hover:bg-gray-200 h-8 mr-4"
                  >
                    View Archive
                  </Button>
                  <Button
                    variant="secondary"
                    className="hover:bg-gray-200 h-8 mr-4"
                  >
                    Ad Tools
                  </Button>
                </>
              ) :  (
                <Button
                    variant={isFollowing ? "secondary" : "primary"}
                    className={`h-8 ${isFollowing? " bg-gray-100 ":"bg-blue-500 text-white" }`}
                    onClick={handleFollowToggle}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>
              ) 
              }
            </div>
            <div className="flex items-center gap-5">
              <p>
                {" "}
                <span className="font-semibold text-sm">
                  {userProfile?.posts.length}
                </span>{" "}
                Posts
              </p>
              <p>
                <span className="font-semibold text-sm">
                  {userProfile?.followers.length}{" "}
                </span>{" "}
                Followers
              </p>
              <p>
                <span className="font-semibold text-sm">
                  {userProfile?.following.length}{" "}
                </span>{" "}
                Following
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-semibold">
                {userProfile?.bio || "Bio here.."}
              </span>
              <Badge className="w-fit" variant="secondary">
                <AtSign />
                <span className="pl-1">{userProfile?.username}</span>
              </Badge>
              <span>Learn Code with me 🤩🤩🤩</span>
              <span>Turning code into fun 😁😁</span>
              <span>code with caffeine 👨‍💻👨‍💻</span>
            </div>
          </div>
        </section>
     
      </div>
      
      <div className="border-t border-t-gray-200">
              <div className="flex items-center justify-center gap-10 text-sm">
              <span className={`py-3 cursor-pointer ${activeTab==='posts'? 'font-bold' : " "}`} onClick={()=>handleTab('posts')}>
                POSTS
              </span>
              <span className={`py-3 cursor-pointer ${activeTab==='saved'? 'font-bold' : " "}`}  onClick={()=>handleTab('saved')}>
                SAVED
              </span>
              <span className="py-3 cursor-pointer">
                REELS
              </span>
              <span className="py-3 cursor-pointer">
                TAGS
              </span>
              </div>

              <div className="grid grid-cols-3 gap-1">
                {
                  displayedPost?.map((post)=>{
                    return (
                      <div key={post._id} className="relative group cursor-pointer">
                        <img src={post.image} alt="" className="rounded-sm my-2 w-full aspect-square object-cover"/>
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex items-center text-white gap-2 hover:text-gray-300">
                            <button className='flex items-center gap-2 hover:text-gray-300'>
                              <Heart/>
                              <span>{post?.likes.length}</span>
                            </button>
                            <button className='flex items-center gap-2 hover:text-gray-300'>
                              <MessageCircle/>
                              <span>{post?.comments.length}</span>
                            </button>
                        </div>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
      </div>

     </div>

      
    </div>
  );
};

export default Profile;
