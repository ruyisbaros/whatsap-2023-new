import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../../utils/validadion";
import CustomAuthInput from "../sidebar/CustomAuthInput";
import { useDispatch } from "react-redux";
import { PulseLoader } from "react-spinners";
import { Link } from "react-router-dom";
import axios from "../../axios";
import { toast } from "react-toastify";
import { reduxMakeTokenExpiredNone, reduxRegisterUser } from "../../redux/currentUserSlice";
import Picture from "./Picture";

const RegisterForm = () => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState(false);
  const [blobPicture, setBlobPicture] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });
  const handleRegister = async (value) => {
    try {
      setStatus(true);
      const { data } = await axios.post("/auth/register", {
        ...value,
        picture: blobPicture ? blobPicture : "",
      });
      if (data.user.id) {
        //console.log(data);
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
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* register form body */}
      <div className=" w-full max-w-md space-y-8 p-10 dark:bg-dark_bg_2 rounded-xl">
        {/* heading */}
        <div className="text-center dark:text-dark_text_1">
          <h2 className="mt-6 text-3xl font-bold">Welcome</h2>
          <p className="mt-2 text-sm">Register</p>
        </div>
        {/* Form */}
        <form
          onSubmit={handleSubmit(handleRegister)}
          className="mt-6 space-y-6"
        >
          <CustomAuthInput
            name="name"
            type="text"
            placeholder="Your Name"
            register={register}
            error={errors?.name?.message}
          />
          <CustomAuthInput
            name="email"
            type="email"
            placeholder="Your E-mail"
            register={register}
            error={errors?.email?.message}
          />
          <CustomAuthInput
            name="status"
            type="text"
            placeholder="Your Status (optional)"
            register={register}
            error={errors?.status?.message}
          />
          <CustomAuthInput
            name="password"
            type="password"
            placeholder="Your Password"
            register={register}
            error={errors?.password?.message}
          />
          {/* Picture */}
          <Picture blobPicture={blobPicture} setBlobPicture={setBlobPicture} />
          <button
            className="w-full flex justify-center bg-green_1 text-gray-100 p-4 rounded-full tracking-wide font-semibold focus:outline-none hover:bg-green_2 transition ease-in duration-300 shadow-lg cursor-pointer"
            type="submit"
          >
            {status ? <PulseLoader color="#fff" size={14} /> : "Register"}
          </button>
          {/* have an account */}
          <p className="flex items-center justify-center gap-2 mt-10 dark:text-dark_text_1 text-center text-md ">
            <span className="">Have an account already?</span>
            <Link
              to="/login"
              className="dark:text-dark_svg_1 hover:underline cursor-pointer transition ease-in duration-300"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
