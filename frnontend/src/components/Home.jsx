import React from "react";
import { Outlet } from "react-router-dom";
import Feed from "./Feed";
import RightSidebar from "./RightSidebar";
import useGetAllPosts from "@/hooks/useGetAllPost";
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers";

const Home = () => {
  useGetAllPosts();
  useGetSuggestedUsers();
  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 w-full max-sm:ml-16 ">
      <div className="flex-grow w-full lg:w-3/5">
        <Feed />
        <Outlet />
      </div>
      <RightSidebar />
    </div>
  );
};

export default Home;
