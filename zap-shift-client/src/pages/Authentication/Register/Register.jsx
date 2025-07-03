import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router";
import SocialLogIn from "../SocialLogin/SocialLogIn";
import axios from "axios";
import useAxios from "../../../hooks/useAxios";
import toast from "react-hot-toast";

const Register = () => {
  const { createUser, setUser, updateUserProfile } = useAuth();
  const [profilePic, setProfilePic] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const axiosInstance = useAxios();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onsubmit = (data) => {
    createUser(data.email, data.password)
      .then(async (result) => {
        // update profile in the database
        const userInfo = {
          email: data.email,
          role: "user",
          create_at: new Date().toISOString(),
          last_log_in: new Date().toISOString(),
        };

        const userRes = await axiosInstance.post(`/users`, userInfo);

        if (userRes.data.insertedId) {
          toast.success("Registration successful");
        }

        // update profile in the firebase
        const userProfile = {
          displayName: data.name,
          photoURL: profilePic,
        };
        updateUserProfile(userProfile)
          .then(() => {
            setUser(result.user);
            navigate(location.state || "/");
          })
          .catch(() => {});
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handelUploadImage = async (e) => {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append("image", image);

    const res = await axios.post(
      `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_imgb_apiKey}`,
      formData
    );
    setProfilePic(res.data.data.display_url);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onsubmit)}>
        <fieldset>
          <h1 className="text-3xl">Create an Account</h1>
          <p className="text-sm">Register with Profast</p>
          {/* name */}
          <div className="fieldset">
            <label className="label">Name</label>
            <input
              type="text"
              {...register("name", { required: true })}
              className="input w-full"
              placeholder="Name"
            />
            {errors.name?.type === "required" && (
              <p className="text-red-600">Name is required</p>
            )}
          </div>

          {/* email */}
          <div className="fieldset">
            <label className="label">Email</label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="input w-full"
              placeholder="Email"
            />
            {errors.email?.type === "required" && (
              <p className="text-red-600">Email is required</p>
            )}
          </div>

          {/* password */}
          <div className="fieldset">
            <label className="label">Password</label>
            <input
              type="password"
              {...register("password", { required: true, minLength: 6 })}
              className="input w-full"
              placeholder="Password"
            />
            {errors.password?.type === "required" && (
              <p className="text-red-600">Password is required</p>
            )}
            {errors.password?.type === "minLength" && (
              <p className="text-red-600">
                Password must be 6 character or longer
              </p>
            )}
          </div>

          {/* photo upload */}
          <div className="fieldset">
            <label className="label">Photo Upload</label>
            <input
              type="file"
              onChange={handelUploadImage}
              className="input w-full"
              placeholder="Upload your photo"
            />
          </div>

          <div className="fieldset">
            <button className="btn btn-neutral mt-4">Register</button>
          </div>
          <p className="text-sm">
            Already have an account?
            <Link className="btn btn-link" to="/login">
              Login
            </Link>
          </p>
        </fieldset>
      </form>
      <SocialLogIn />
    </div>
  );
};

export default Register;
