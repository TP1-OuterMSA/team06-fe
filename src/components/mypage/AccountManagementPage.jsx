import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { UserContext } from "../../context/UserContext";
import axios from "axios";

function AccountManagementPage() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [nickname, setNickname] = useState(user.nickname);
  const [email, setEmail] = useState(user.email);
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    setPreviewUrl(user.profileImageUrl); // 서버에서 불러온 기본 이미지
  }, []);
  
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f5f7fa] text-gray-800">
      <Sidebar />
      <main className="flex-1 p-5">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">계정 관리</h2>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <form onSubmit={handleSave} className="w-full p-4">
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">프로필 사진</label>
              <label className="relative inline-block w-40 h-40 p-3 group cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <img
                  src={previewUrl || "/default-profile.png"}
                  alt="프로필 사진"
                  className="w-40 h-40 object-cover border border-gray-300 transition duration-300 group-hover:brightness-75"
                />
                <div className="absolute inset-0 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition duration-300">
                  <span className="text-white text-sm font-semibold">클릭하여 변경</span>
                </div>
              </label>
            </div>
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
