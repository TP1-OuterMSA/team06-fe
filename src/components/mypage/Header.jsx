import React from "react";
import { UserContext } from "../../context/UserContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

function Header() {
  const { logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout= () => {
    logout();
    alert("로그아웃 되었습니다.");
    navigate("/login")
  }

  return (
    <div className="flex justify-between items-center mt-6 mb-6">
      <h2 className="text-xl font-semibold">내 정보</h2>
      <button className="bg-gray-800 text-white px-4 py-2 rounded-md" onClick={() => handleLogout()}>로그아웃</button>
    </div>
  );
}

export default Header;
