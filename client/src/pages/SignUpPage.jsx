import React, { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase"; 
import { useNavigate } from "react-router-dom";

function SignUpPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success | error

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    const { name, email, password, confirmPassword } = form;

    if (!name || !email || !password || !confirmPassword) {
      setMessage("Please fill in all fields.");
      setMessageType("error");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return;
    }

    // Firebase sign up
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Update profile with name
        updateProfile(userCredential.user, { displayName: name })
          .then(() => {
            // Get and log Firebase ID Token
            userCredential.user.getIdToken().then((token) => {
              console.log("Firebase ID Token:", token);
            });

            setMessage("Account created successfully!");
            setMessageType("success");
            setForm({ name: "", email: "", password: "", confirmPassword: "" });

            // Redirect after showing success message
            setTimeout(() => {
              navigate("/products"); 
            }, 1500);
          })
          .catch((error) => {
            setMessage(error.message);
            setMessageType("error");
          });
      })
      .catch((error) => {
        setMessage(error.message);
        setMessageType("error");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f4ee] px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 tracking-tight">
          Create an Account
        </h2>
        <p className="text-center text-sm text-gray-500">Sign up to get started</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium mb-1"
            >
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`text-sm rounded-md p-3 ${
                messageType === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-gray-900 hover:bg-gray-700 text-white font-semibold transition duration-150 ease-in-out"
          >
            Sign Up
          </button>
        </form>

        {/* Already have an account */}
        <div className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/signin" className="text-gray-600 hover:text-gray-500 font-medium">
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
