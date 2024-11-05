import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setSelectedUser } from '@/redux/authSlice';
import { Button } from './ui/button';
import { MessageCircleCode, ChevronLeft } from 'lucide-react';
import Messages from './Messages';
import axios from 'axios';
import { setMessages } from '@/redux/chatSlice';

const ChatPage = () => {
  const [textMessage, setTextMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { user, suggestedUsers, selectedUser } = useSelector(store => store.auth);
  const { onlineUsers, messages } = useSelector(store => store.chat);
  const dispatch = useDispatch();

  const sendMessageHandler = async (receiverId) => {
    try {
      const res = await axios.post(
        `https://chat-appication-backend.onrender.com/api/v1/message/send/${receiverId}`,
        { textMessage },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage('');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUserSelect = (user) => {
    dispatch(setSelectedUser(user));
    setIsChatOpen(true);
  };

  const handleBack = () => {
    setIsChatOpen(false);
    dispatch(setSelectedUser(null));
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, []);

  return (
    <div className="flex w-full h-screen ml-[22%] max-md:ml-20">
      {/* User List Section */}
      <section
        className={`w-[25%] py-8 max-md:w-full ${
          isChatOpen ? 'hidden lg:block' : 'block'
        } bg-gray-50 pl-10  w-[50%]`}
      >
      <div className='flex items-center gap-2 pb-3'>
      <img src={user?.profilePicture} className='w-12 h-12 rounded-full ' alt="" />
      <h1 className="font-bold mb-4 px-3 text-xl">{user?.username}</h1>
      </div>
        <hr className="mb-4 border-gray-300" />
        <div className="overflow-y-auto h-[80vh]">
          {suggestedUsers.map((suggestedUser) => {
            const isOnline = onlineUsers.includes(suggestedUser?._id);
            return (
              <div
                key={suggestedUser._id}
                onClick={() => handleUserSelect(suggestedUser)}
                className="flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer"
              >
                <Avatar className="w-14 h-14">
                  <AvatarImage src={suggestedUser?.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{suggestedUser?.username}</span>
                  <span
                    className={`${
                      isOnline ? 'text-green-500' : 'text-red-500'
                    } font-bold text-xs`}
                  >
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Chat Section */}
      {selectedUser ? (
        <section
          className={`flex-1 border-l border-gray-300 flex flex-col h-full w-full p-10 ${
            isChatOpen ? 'block' : 'hidden md:flex'
          }`}
        >
          <div className="flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10">
            <button
              onClick={handleBack}
              className="lg:hidden bg-transparent border-none p-0 text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft size={24} />
            </button>
            <Avatar>
              <AvatarImage src={selectedUser?.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-bold">{selectedUser?.username}</span>
            </div>
          </div>
          <Messages selectedUser={selectedUser} />
          <div className="flex items-center p-4 border-t border-gray-300">
            <input
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              type="text"
              className="flex-1 mr-2 focus-visible:ring-transparent p-2"
              placeholder="Write your message..."
            />
            <Button className='bg-blue-500' onClick={() => sendMessageHandler(selectedUser?._id)}>
              Send
            </Button>
          </div>
        </section>
      ) : (
        // Placeholder message when no user is selected
        <div className="flex flex-col items-center justify-center mx-auto max-md:hidden">
          <MessageCircleCode className="w-32 h-32 my-4" />
          <h1 className="font-medium text-xl">Your messages</h1>
          <span className="mb-3">Send a message to start a chat...</span>
          <Button className="bg-blue-500 hover:bg-blue-600 ">Message</Button>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
