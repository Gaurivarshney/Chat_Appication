import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "react-toastify";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
const SignUp = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    console.log(input);

    try {
      setLoading(true);
      const res = await axios.post(
        "https://chat-appication-backend.onrender.com/api/v1/user/register",
        input,
        {
          headers: {
            "content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        navigate("/");
        toast.success(res.data.message);
        setInput({
          username: "",
          email: "",
          password: "",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);
  return (
    <div className="flex items-center w-screen h-screen justify-center m-auto">
      <form
        onSubmit={signupHandler}
        action=""
        className="shadow-lg flex flex-col gap-5 p-8 rounded-lg"
      >
        <div className="my-1">
          <h1>LOGO</h1>
          <p>SignUp to see photos & videos from your friends</p>
        </div>
        <div>
          <span className="font-bold">Username</span>
          <Input
            type="text"
            className="focus-visible:ring-transparent my-2"
            name="username"
            value={input.username}
            onChange={changeEventHandler}
          />
        </div>
        <div>
          <span className="font-bold">Email</span>
          <Input
            type="text"
            className="focus-visible:ring-transparent my-2"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
          />
        </div>
        <div>
          <span className="font-bold">Password</span>
          <Input
            type="text"
            className="focus-visible:ring-transparent my-2"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
          />
        </div>
        {loading ? (
          <Button>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            please wait
          </Button>
        ) : (
          <Button type="submit">SignUp</Button>
        )}

        <span className="text-center">
          Already have anaccount?
          <Link to="/login" className="text-blue-600">
            {" "}
            Login
          </Link>
        </span>
      </form>
    </div>
  );
};

export default SignUp;
