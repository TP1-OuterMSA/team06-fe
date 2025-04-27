import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { UserContext } from "../../context/UserContext";

function AccountManagementPage() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);

  const handleSave = () => {
    setUser({ ...user, username, email });
    alert("계정 정보가 업데이트되었습니다.");
    navigate("/mypage");
  };

  return (
    <div className="flex min-h-screen bg-[#f5f7fa] text-gray-800">
      <Sidebar />
      <main className="flex-1 p-5">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">계정 관리</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">사용자명</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">이메일</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button
            onClick={handleSave}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg"
          >
            저장
          </button>
        </div>
      </main>
    </div>
  );
}

export default AccountManagementPage;
