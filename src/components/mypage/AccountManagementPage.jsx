import React, { useState, useContext, useEffect } from "react";
import Sidebar from "./Sidebar";
import { UserContext } from "../../context/UserContext";
import axios from "axios";

function AccountManagementPage() {
  const { user, setUser } = useContext(UserContext);
  const [nickname, setNickname] = useState(user.nickname);
  const [email, setEmail] = useState(user.email);
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(
    user.profileImageUrl
      ? `${import.meta.env.VITE_API_BASE_URL}${user.profileImageUrl}`
      : "/profile.png"
  );

  // user.profileImageUrl이 바뀔 때마다 previewUrl도 갱신
  useEffect(() => {
    setPreviewUrl(
      user.profileImageUrl
        ? `${import.meta.env.VITE_API_BASE_URL}${user.profileImageUrl}`
        : "/profile.png"
    );
  }, [user.profileImageUrl]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // 1) 닉네임·이메일 업데이트
      const { data: userAfterInfo } = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/team6/user/update/${user.id}`,
        { nickname, email }
      );
      let updatedUser = userAfterInfo;

      // 2) 프로필 이미지가 선택된 경우만 업로드
      if (profileImage) {
        const form = new FormData();
        form.append("file", profileImage);
        const { data: userAfterImage } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/team6/user/${user.id}/profile-image`,
          form,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        updatedUser = userAfterImage;
      }
         const bustedPath = updatedUser.profileImageUrl
           ? `${updatedUser.profileImageUrl}?t=${Date.now()}`
           : null;
         // Context에 저장할 때도 bustedPath 반영
         setUser({
           ...updatedUser,
           profileImageUrl: bustedPath
         });

           const bustedUrl = bustedPath
              ? `${import.meta.env.VITE_API_BASE_URL}${bustedPath}`
              : "/default-profile.jpg";
            setPreviewUrl(bustedUrl);

      alert("계정 정보가 업데이트되었습니다.");
    } catch (err) {
      console.error(err);
      alert("오류가 발생했습니다.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f5f7fa] text-gray-800">
      <Sidebar />
      <main className="flex-1 p-5">
        <h2 className="text-xl font-semibold mb-6">계정 관리</h2>
        <div className="bg-white p-6 rounded-xl shadow">
          <form onSubmit={handleSave} className="w-full p-4">
            {/* 프로필 사진 */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">
                프로필 사진
              </label>
              <label className="relative inline-block w-40 h-40 p-3 group cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <img
                  src={previewUrl}
                  alt="프로필 사진"
                  className="w-40 h-40 object-cover border border-gray-300 transition duration-300 group-hover:brightness-75"
                />
                <div className="absolute inset-0 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition duration-300">
                  <span className="text-white text-sm font-semibold">
                    클릭하여 변경
                  </span>
                </div>
              </label>
            </div>

            {/* 아이디 (읽기 전용) */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">아이디</label>
              <div className="w-full p-3 text-xl bg-gray-50 rounded">
                {user.username}
              </div>
            </div>

            {/* 닉네임 */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">닉네임</label>
              <input
                type="text"
                value={nickname}
                required
                onChange={(e) => setNickname(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* 이메일 */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">이메일</label>
              <input
                type="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
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
