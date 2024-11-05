import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AvatarFallback, AvatarImage, Avatar } from "./ui/avatar";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { setAuthUser } from "@/redux/authSlice";
import { toast } from "react-toastify";

const EditProfile = () => {
  const imageRef = useRef();
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading]= useState(false);
  const [input, setInput]= useState({
    profilePhoto:user?.profilePicture,
    bio:user?.bio,
    gender:user?.gender
  })
const navigate = useNavigate()
const dispatch = useDispatch()

const fileChangeHandler = (e)=>{
  const file = e.target.files?.[0];
  if(file) setInput({...input , profilePhoto:file})
}
const selectChangeHandler =(value)=>{
  setInput({...input, gender:value})
}

  const editProfileHandler = async()=>{
    console.log(input);
    const formData = new FormData();
    formData.append("bio", input.bio);
    formData.append("gender", input.gender);
    if(input.profilePhoto){
      formData.append("profilePhoto",input.profilePhoto)
    }
    try {
      setLoading(true)
      const res= await axios.post('https://chat-appication-backend.onrender.com/api/v1/user/profile/edit', formData, {
        headers:{
          'Content-Type':'multipart/form-data'
        },
        withCredentials:true
      });
      if(res.data.success){
        const updatedUserData ={
          ...user,
          bio : res.data.user?.bio,
          profilePicture: res.data.user?.profilePicture,
          gender:res.data.user.gender
        };
        dispatch(setAuthUser(updatedUserData))
        navigate(`/profile/${user?._id}`);
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(res.response.data.message)
    } finally{
      setLoading(false)
    }
  }
  return (
    <div className="flex justify-center w-full mx-52 pl-72 pt-10">
      <section className="flex flex-col gap-6 w-full my-8">
        <h1 className="font-bold text-xl">Edit Profile</h1>
        <div className="flex items-center justify-between bg-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user?.profilePicture} alt="posy_image" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div>
              <h1 className="font-semibold text-sm">{user?.username}</h1>
              <span className="text-gray-600 text-sm">
                {user?.bio || "Bio here..."}
              </span>
            </div>
          </div>
          <input ref={imageRef} onChange={fileChangeHandler} type="file" className="hidden"/>
          <Button onClick={()=>imageRef?.current.click()} className='bg-[#0095F6] h-8 hover:bg-[#165986]'>Change Photo</Button>
        </div>

      <div>
        <h1 className="font-bold text-xl mb-2">Bio</h1>
        <textarea value={input.bio} onChange={(e)=>setInput({...input, bio:e.target.value})} name="bio" className="border rounded w-full focus-visible:ring-transparent" />
      </div>
         <div>
         <h1 className="font-bold text-xl mb-2">Gender</h1>
          <Select defaultValue={input.gender} onValueChange={selectChangeHandler}>
      <SelectTrigger className="w-full">
        <SelectValue/>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
         
          <SelectItem value="male">Male</SelectItem>
          <SelectItem value="female">Female</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
         </div>
         <div className="flex justify-end">
         {
          loading ? (
            <Button className='bg-[#0095F6] h-8 hover:bg-[#165986]'>
            <Loader2 className="w-4 h-4 mr-2 animate-spin"/>
              please wait
            </Button>
            
          ):(
            <Button onClick={editProfileHandler} className='bg-[#0095F6] h-8 hover:bg-[#165986]'>Save Info</Button>
           
          )
         }
         </div>
      </section>
    </div>
  );
};

export default EditProfile;
