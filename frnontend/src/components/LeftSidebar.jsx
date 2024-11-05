import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Home, Search, TrendingUp, MessageCircle, Heart, PlusSquare, LogOut, Menu } from 'lucide-react'; // Import Menu icon
import logo2 from '../assets/logo2.png';
import { useSelector, useDispatch } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';
import CreatePost from './CreatePost';
import { setPosts, setSelectedPost } from '@/redux/postSlice';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';

const LeftSidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const { likeNotification } = useSelector(store => store.realTimeNotification);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // State for sidebar visibility

  const logOutHandler = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/v1/user/logout', { withCredentials: true });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        toast.success(res.data.message);
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src={user?.profilePicture} alt={user?.name} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "LogOut", onClick: logOutHandler },
  ];

  const createPostHandler = () => {
    setOpen(true);
  };

  const sidebarHandler = (textType) => {
    if (textType === "LogOut") {
      logOutHandler();
    } else if (textType === "Create") {
      createPostHandler();
    } else if (textType === 'Profile') {
      navigate(`/profile/${user._id}`);
    } else if (textType === 'Home') {
      navigate('/');
    } else if (textType === 'Messages') {
      navigate('/chat');
    }
  };

  return (
    <div>
      {/* Toggle Button for Smaller Screens */}
      <button
        className="fixed top-4 left-4 z-20 p-2 rounded-lg bg-gray-300 hover:bg-gray-400 sm:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu />
      </button>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 z-10 px-4 border-r border-gray-300 w-1/5 sm:w-1/4 lg:w-1/6 h-screen bg-white overflow-y-auto overflow-hidden transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0 max-sm:pt-20` }>
        <img className="max-sm:w-10 max-sm:h-10 justify-center items-center ml-2 h-20 w-20 m-4 mx-auto sm:mx-8" src={logo2} alt="Logo" />
        <div className="p-3 sm:p-5 pt-0">
          {sidebarItems.map((item, index) => (
            <div
              key={index}
              onClick={() => { sidebarHandler(item.text); }}
              className="flex items-center gap-3 hover:bg-gray-100 relative cursor-pointer rounded-lg p-2 sm:p-3 my-2 sm:my-3 text-gray-700 max-sm:w-32 sm:w-40"
            >
              {item.icon}
              <p className="hidden sm:block text-md font-semibold">{item.text}</p>
              {item.text === 'Notifications' && likeNotification.length > 0 && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button className="rounded-full h-5 w-5 absolute bottom-6 bg-red-600 text-white left-8" size="icon">
                      {likeNotification.length}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56">
                    <div className="p-2">
                      {likeNotification.length === 0 ? (
                        <p className="text-center text-sm">No new notifications</p>
                      ) : (
                        likeNotification.map((notification) => (
                          <div key={notification.userId} className="flex items-center gap-2 mb-2">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={notification.userDetails?.profilePicture} />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <p className="text-sm">
                              <span className="font-bold">{notification.userDetails?.username}</span> liked your post
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          ))}
        </div>
        <CreatePost open={open} setOpen={setOpen} />
      </div>
    </div>
  );
};

export default LeftSidebar;
