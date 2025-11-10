import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div className="bg-violet-300 p-4">
      {/* ========== HEADER ========== */}
      <header className="bg-white w-full max-w-6xl text-violet-800 rounded-xl mx-auto">
        <nav className="flex flex-col md:flex-row items-center justify-between px-4 py-3">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <Link className="flex gap-x-2 text-2xl font-bold" href="/">
              <img
                src="/icon.png"
                width={55}
                alt="Icon"
                className="bg-violet-600 rounded-full p-1"
              />
            </Link>
            <h1 className="text-xl font-bold">CloudStream</h1>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-2 md:gap-4 mt-3 md:mt-0">
            {/* Home - Hidden on mobile */}
            <Link
              href="/"
              className="hidden md:inline-block px-3 py-2 text-lg text-violet-800 hover:text-neutral-500"
            >
              Home
            </Link>

            {/* Manage Room - Hidden on mobile */}
            <Link
              href="/manage-room"
              className="hidden md:inline-block px-3 py-2 text-lg text-violet-800 hover:text-neutral-500"
            >
              Manage Room
            </Link>

            {/* Sign Up */}
            <Link
              href="/signup"
              className="px-3 py-2 text-lg text-violet-800 hover:text-neutral-500"
            >
              Sign Up
            </Link>

            {/* Login */}
            <Link
              href="/login"
              className="px-3 py-2 text-lg text-violet-800 hover:text-neutral-500"
            >
              Login
            </Link>

            {/* Contact Us Button */}
            <Link
              href="/contact"
              className="bg-violet-800 text-white px-4 py-2 text-lg rounded-full hover:bg-violet-700 transition"
            >
              Contact Us
            </Link>
          </div>
        </nav>
      </header>
      {/* ========== END HEADER ========== */}
    </div>
  );
};

export default Navbar;
