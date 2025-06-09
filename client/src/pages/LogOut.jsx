import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();

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
    <button
      onClick={handleLogout}
      className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
    >
      Logout
    </button>
  );
}

export default LogoutButton;
