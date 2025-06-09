import React, { useEffect, useState } from "react";
import { auth } from "../firebase"; // Adjust path if needed
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useChatbot } from "../context/ChatbotContext"; // 🆕 Import chatbot context

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { openChatbot } = useChatbot(); //  openChatbot from context

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/signin");
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  return (
    <nav className="flex items-center justify-between px-8 py-6 bg-[#f7f4ee] text-black font-medium">
      <h1 className="text-xl font-bold tracking-wide">RECOMMENDO.</h1>

      <ul className="hidden md:flex gap-8 text-sm">
        <li className="cursor-pointer hover:underline">
          <a href="/">HOME</a>
        </li>
        <li className="cursor-pointer hover:underline">
          <a href="/products">PRODUCTS</a>
        </li>
        <li className="cursor-pointer hover:underline">
          <a href="/about">ABOUT</a>
        </li>
        <li className="cursor-pointer hover:underline">
          <a href="/deals">DEALS</a>
        </li>


        <li
          className="cursor-pointer hover:underline text-[#090909] font-semibold"
          onClick={openChatbot}
        >
          ASK CARTI 🤖
        </li>
      </ul>

      <div className="hidden md:flex items-center gap-4 text-sm">
        {user ? (
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition"
          >
            Logout
          </button>
        ) : (
          <>
            <button className="hover:underline">
              <a href="/signin">SIGNIN</a>
            </button>
            <button className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition">
              <a href="/signup">GET STARTED</a>
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
