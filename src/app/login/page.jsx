"use client";
import * as Yup from "yup";
import { useFormik } from "formik";
import React from "react";
import { IconCheck, IconLoader3 } from "@tabler/icons-react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .required("Password must be correct")
    .matches(/[a-z]/, "Lowercase letter is required")
    .matches(/[A-Z]/, "Uppercase letter is required")
    .matches(/[0-9]/, "Number is required")
    .matches(/\W/, "Special character is required")
    .min(8, "Minimum 8 characters required"),
});

const Login = () => {
  const router = useRouter();

  const loginForm = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values, { resetForm, setSubmitting }) => {
      axios
        .get("https://live-poll-backend-akq0.onrender.com/user/getall", values)
        .then(() => {
          toast.success("Login successfully");
          resetForm();
          router.push("/manage-room");
        })
        .catch((err) => {
          console.log(err);
          toast.error(err?.response?.data?.message || "Something went wrong");
          setSubmitting(false);
        });
    },
    validationSchema: LoginSchema,
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-violet-300">
      
      <div
        className="hidden md:block w-full lg:m-20 md:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('login-image.png')" }}
      ></div>

      {/* Form section */}
      <div className="flex justify-start lg:mr-28 items-center w-full md:w-1/2 p-4">
        <form
          onSubmit={loginForm.handleSubmit}
          className="w-full max-w-md bg-white shadow-2xl px-8 py-10 rounded-lg"
        >
          <h1 className="text-4xl font-bold text-center text-black">Login</h1>
          <p className="text-lg font-semibold text-violet-700 text-center mt-2">
            to your account
          </p>

          {/* Email */}
          <div className="mt-6">
            <label className="block font-bold">Email:</label>
            <input
              className="rounded-full bg-gray-300 px-4 py-2 w-full"
              id="email"
              type="email"
              onChange={loginForm.handleChange}
              value={loginForm.values.email}
            />
            {loginForm.errors.email && loginForm.touched.email && (
              <p className="text-xs text-red-600 mt-1">{loginForm.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="mt-4">
            <label className="block font-bold">Password:</label>
            <input
              className="rounded-full bg-gray-300 px-4 py-2 w-full"
              id="password"
              type="password"
              onChange={loginForm.handleChange}
              value={loginForm.values.password}
            />
            {loginForm.errors.password && loginForm.touched.password && (
              <p className="text-xs text-red-600 mt-1">{loginForm.errors.password}</p>
            )}
          </div>

          {/* Forgot password link */}
          <div className="text-right mt-2">
            <Link
              className="text-sm text-blue-600 hover:underline"
              href="/forgetPassword"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit button */}
          <button
            className="w-full mt-6 shadow-xl rounded-lg font-semibold px-4 py-2 flex justify-center items-center gap-x-2 bg-black text-white hover:bg-violet-800 transition"
            type="submit"
            disabled={loginForm.isSubmitting}
          >
            {loginForm.isSubmitting ? (
              <IconLoader3 className="animate-spin" />
            ) : (
              <IconCheck />
            )}
            {loginForm.isSubmitting ? "Submitting..." : "Log In"}
          </button>

          {/* Sign up link */}
          <p className="text-center mt-4 text-sm">
            Not yet registered?{" "}
            <Link href="/signup" className="text-blue-700 hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
