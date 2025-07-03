import React from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import SocialLogIn from "../SocialLogin/SocialLogIn";
import toast from "react-hot-toast";

const Login = () => {
  const { signInUser, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    signInUser(data.email, data.password)
      .then((result) => {
        setUser(result.user);
        toast.success("Logged in successful");
        navigate(location.state || "/");
      })
      .catch(() => {
        toast.error("Try again");
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset>
          <h1 className="text-3xl">Welcome Back</h1>
          <p className="text-sm">Login with Profast</p>
          {/* email */}
          <div className="fieldset">
            <label className="label">Email</label>
            <input
              type="email"
              {...register("email")}
              className="input w-full"
              placeholder="Email"
            />
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

          <div>
            <a className="link link-hover">Forgot password?</a>
          </div>

          <div className="fieldset">
            <button className="btn btn-neutral mt-4">Login</button>
          </div>
          <p className="text-sm">
            Don’t have any account?
            <Link className="btn btn-link" to="/register">
              Register
            </Link>
          </p>
        </fieldset>
      </form>
      <SocialLogIn />
    </div>
  );
};

export default Login;
