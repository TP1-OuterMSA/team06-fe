import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { UserContext } from "../../context/UserContext";
import axios from "axios";

function AccountManagementPage() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [nickname, setNickname] = useState(user.nickname);
  const [email, setEmail] = useState(user.email);

  const handleSave = () => {
    // setUser({ ...user, username, email });
    saveUserInfo();
    alert("계정 정보가 업데이트되었습니다.");
    // navigate("/mypage");
  };

  const saveUserInfo = async () => {
    try {
      const response = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/api/team6/user/update/${user.id}`, {
        nickname: nickname,
        email: email
      });
      const data = response.data;
      setUser(data);
      console.log(data);
    } catch (error) {
      console.error('Error updating user info:', error);
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f5f7fa] text-gray-800">
      <Sidebar />
      <main className="flex-1 p-5">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">계정 관리</h2>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <form onSubmit={handleSave} className="w-full p-4">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">아이디</label>
              <div className="w-full p-3 text-xl">
                {user.username}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">닉네임</label>
              <input
                type="text"
                value={nickname}
                required
                onChange={e => setNickname(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">이메일</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg"
            >
              저장
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default AccountManagementPage;
