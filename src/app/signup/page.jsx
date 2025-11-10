"use client";
import * as Yup from "yup";
import { useFormik } from "formik";
import React from "react";
import { IconCheck, IconLoader3 } from "@tabler/icons-react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Name is required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .required("Password is required")
    .matches(/[a-z]/, "Lowercase letter is required")
    .matches(/[A-Z]/, "Uppercase letter is required")
    .matches(/[0-9]/, "number is required")
    .matches(/\W/, "Special Character is required")
    .min(8, "Minimum 8 characters required"),
  confirmPassword: Yup.string()
    .required("Please Confirm Password")
    .oneOf([Yup.ref("password"), null], "Password must match"),
});

const Signup = () => {
  const router = useRouter();

  const signupForm = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: (values, { resetForm, setSubmitting }) => {
      axios
        .post("https://live-poll-backend-akq0.onrender.com/user/add", values)
        .then((result) => {
          toast.success("User Registered successfully");
          resetForm();
          router.push("/manage-room");
        })
        .catch((err) => {
          console.log(err);
          toast.error(err?.response?.data?.message || "Something went wrong");
          setSubmitting(false);
        });
    },
    validationSchema: SignupSchema,
  });

  return (
    <div className="flex flex-col md:flex-row bg-violet-300 min-h-screen">
      
      <div
        className="hidden md:block bg-cover bg-center  items-center justify-center w-full lg:m-20 md:w-1/2 md:h-auto"
        style={{ backgroundImage: "url('login-image.png')" }}
      ></div>

      
      <div className="flex justify-start items-center w-full lg:mr-28 md:w-1/2 px-4 py-10 md:py-0">
        <form
          onSubmit={signupForm.handleSubmit}
          className="w-full max-w-md sm:max-w-lg md:max-w-xl"
        >
          <div className="bg-white shadow-2xl px-6 sm:px-10 py-8 rounded-lg">
            <h1 className="text-4xl sm:text-3xl text-black font-bold text-center">
              Signup
            </h1>
            <p className="text-lg font-semibold text-violet-700 text-center mt-2">
              to your account
            </p>
            <div className="mt-6">
              {/* Name */}
              <label className="block font-bold">Name:</label>
              <input
                className="rounded-lg bg-gray-300 px-2 py-1 w-full"
                id="name"
                type="text"
                onChange={signupForm.handleChange}
                value={signupForm.values.name}
              />
              {signupForm.errors.name && signupForm.touched.name && (
                <p className="text-xs text-red-600 mt-2">
                  {signupForm.errors.name}
                </p>
              )}

              {/* Email */}
              <label className="block font-bold mt-4">Email:</label>
              <input
                className="rounded-lg bg-gray-300 px-2 py-1 w-full"
                id="email"
                type="email"
                onChange={signupForm.handleChange}
                value={signupForm.values.email}
              />
              {signupForm.errors.email && signupForm.touched.email && (
                <p className="text-xs text-red-600 mt-2">
                  {signupForm.errors.email}
                </p>
              )}

              {/* Password */}
              <label className="block font-bold mt-4">Password:</label>
              <input
                className="rounded-lg bg-gray-300 px-2 py-1 w-full"
                id="password"
                type="password"
                onChange={signupForm.handleChange}
                value={signupForm.values.password}
              />
              {signupForm.errors.password && signupForm.touched.password && (
                <p className="text-xs text-red-600 mt-2">
                  {signupForm.errors.password}
                </p>
              )}

              {/* Confirm Password */}
              <label className="block font-bold mt-4">Confirm Password:</label>
              <input
                className="rounded-lg bg-gray-300 px-2 py-1 w-full"
                id="confirmPassword"
                type="password"
                onChange={signupForm.handleChange}
                value={signupForm.values.confirmPassword}
              />
              {signupForm.errors.confirmPassword &&
                signupForm.touched.confirmPassword && (
                  <p className="text-xs text-red-600 mt-2">
                    {signupForm.errors.confirmPassword}
                  </p>
                )}

              {/* Submit Button */}
              <button
                className="w-full shadow-xl mt-8 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-black text-white hover:bg-violet-800 transition"
                type="submit"
                disabled={signupForm.isSubmitting}
              >
                {signupForm.isSubmitting ? (
                  <IconLoader3 className="animate-spin" />
                ) : (
                  <IconCheck />
                )}
                {signupForm.isSubmitting ? "Submitting..." : "Sign Up"}
              </button>

              {/* Login Link */}
              <p className="text-center mt-4">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-700">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
