import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";

import Comment from "./Comment";
import axios from "axios";
import { toast } from "react-toastify";
import { setPosts } from "@/redux/postSlice";

const CommentDialog = ({ open, setOpen }) => {
    const dispatch = useDispatch()
    const [text, setText]= useState("")
    
    const {selectedPost,posts}= useSelector(store=>store.post)
    const [comment, setComment]= useState([])


    useEffect(()=>{
      if(selectedPost){
        setComment(selectedPost.comments)
      }
    },[selectedPost]);

    const changeEventHandler=(e)=>{
        const inputText = e.target.value
        if(inputText.trim()){
            setText(inputText)
        }else{
            setText("")
        }
    }

   
    const sendMessageHandler = async () => {
      try {
        const res = await axios.post(
          `http://localhost:8000/api/v1/post/${selectedPost?._id}/comment`,
          { text },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        console.log(res.data);
        
        if (res.data.success) {
          const updatedComments = [...comment, res.data.comment];
          setComment(updatedComments);
          const updatedcommentData = posts.map((p) =>
            p._id === selectedPost?._id
              ? {
                  ...p,
                  comments: updatedComments,
                }
              : p
          );
          dispatch(setPosts(updatedcommentData));
          toast.success(res.data.message);
          setText("");
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
      }
    };

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-w-5xl h-[550px] p-0 flex flex-col"
      >
        <div className="flex flex-1">
          <div className="w-1/2">
            <img
              className="w-full h-[550px] object-cover rounded-l-lg"
              src={selectedPost?.image}
              alt=""
            />
          </div>
          <div className="w-1/2 flex flex-col justify-between m-3 ">
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar>
                    <AvatarImage src={selectedPost?.author?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold">{selectedPost?.author?.username}</Link>
                  {/* <span className='text-gray-600 text-sm'>bio here...</span> */}
                </div>
              </div>

                <Dialog>
                    <DialogTrigger asChild className="cursor-pointer">
                            <MoreHorizontal/>
                    </DialogTrigger>
                    <DialogContent className='flex flex-col items-center text-sm text-center '>
                        <div className="cursor-pointer w-full text-[#ED4956] font-bold ">
                            unfollow
                        </div>
                        <div  className="cursor-pointer w-full ">
                          Add to favourites
                        </div>
                        <div  className="cursor-pointer w-full ">
                            unfollow
                        </div>
                    </DialogContent>
                </Dialog>

            </div>
            <hr />
            <div className="flex-1 overflow-y-auto max-h-96 p-4">
            
            {
              comment?.map((comment)=> <Comment key={comment._id} comment={comment}/>)
            }
                  
            </div>
            <div className="p-4">
            <div className="flex gap-2 items-center">
                <input type="text" placeholder="Add a comment.." className="w-full outline-none border border-gray-300 p-2 rounded text-sm" value={text} onChange={changeEventHandler}/>
                <Button disabled={!text.trim()} onClick={sendMessageHandler} variant="outline">Send</Button>
            </div>

            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
