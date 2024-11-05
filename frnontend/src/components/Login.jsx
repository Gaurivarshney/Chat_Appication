// Login.jsx
import React, { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';

const Login = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const {user}= useSelector(store=>store.auth)
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post('https://chat-appication-backend.onrender.com/api/v1/user/login', input, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      console.log(res.data)
      if (res.data.success) {
        console.log(res.data)
        dispatch(setAuthUser(res.data.user)); // Ensure correct data structure here
        navigate('/');
        toast.success(res.data.message);
        setInput({ email: "", password: "" });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    if(user){
      navigate('/')
    }
  },[])

  return (
    <div className="flex items-center w-screen h-screen justify-center m-auto">
      <form onSubmit={signupHandler} className="shadow-lg flex flex-col gap-5 p-8 rounded-lg">
        <h1>LOGO</h1>
        <p>Login to see photos & videos from your friends</p>
        
        <div>
          <span className="font-bold">Email</span>
          <Input
            type="text"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2"
          />
        </div>
        <div>
          <span className="font-bold">Password</span>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2"
          />
        </div>
        
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Login"}
        </Button>
        
        <span className="text-center">
          Create an account? <Link to="/signup" className="text-blue-600">Signup</Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
