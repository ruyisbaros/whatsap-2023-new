import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomAuthInput from "../sidebar/CustomAuthInput";
import { loginSchema } from "../../utils/validadion";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import axios from "../../axios";
import { toast } from "react-toastify";
import {
  reduxMakeTokenExpiredNone,
  reduxRegisterUser,
} from "../../redux/currentUserSlice";

const LoginForm = () => {
  /* const navigate = useNavigate(); */
  const dispatch = useDispatch();
  const [status, setStatus] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });
  const handleLogin = async (values) => {
    try {
      setStatus(true);
      const { data } = await axios.post("/auth/login", { ...values });

      if (data.user.id) {
        console.log(data);
        setStatus(false);
        window.localStorage.setItem(
          "registeredUser",
          JSON.stringify(data.user)
        );
        await dispatch(reduxRegisterUser(data.user));
        dispatch(reduxMakeTokenExpiredNone());
        toast.success(data.message);
      } else {
        toast.error("Something went wrong! Please try again.");
      }
    } catch (error) {
      setStatus(false);
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Login form body */}
      <div className="w-full max-w-md space-y-8 p-10 dark:bg-dark_bg_2 rounded-xl">
        {/* heading */}
        <div className="text-center dark:text-dark_text_1">
          <h2 className="mt-6 text-3xl font-bold">Welcome Back</h2>
          <p className="mt-2 text-sm">Login</p>
        </div>
        {/* Form */}
        <form className="mt-6 space-y-6" onSubmit={handleSubmit(handleLogin)}>
          <CustomAuthInput
            name="email"
            type="email"
            placeholder="Your E-mail"
            register={register}
            error={errors?.email?.message}
          />
          <CustomAuthInput
            name="password"
            type="password"
            placeholder="Your Password"
            register={register}
            error={errors?.password?.message}
          />
          <button
            className="w-full flex justify-center bg-green_1 text-gray-100 p-4 rounded-full tracking-wide font-semibold focus:outline-none hover:bg-green_2 transition ease-in duration-300 shadow-lg cursor-pointer"
            type="submit"
          >
            {status ? <PulseLoader color="#fff" size={14} /> : "Login"}
          </button>
          {/* have an account */}
          <p className="flex items-center justify-center gap-2 mt-10 dark:text-dark_text_1 text-center text-md ">
            <span className="">Don't have an account?</span>
            <Link
              to="/register"
              className="dark:text-dark_svg_1 hover:underline cursor-pointer transition ease-in duration-300"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
