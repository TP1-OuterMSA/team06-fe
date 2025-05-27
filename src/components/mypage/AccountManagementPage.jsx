import React, { useState, useContext, useEffect } from "react";
import Sidebar from "./Sidebar";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import ProfileImage from "../common/ProfileImage";

function AccountManagementPage() {
  const { user, setUser } = useContext(UserContext);
  const [nickname, setNickname] = useState(user.nickname);
  const [email, setEmail] = useState(user.email);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [promotionStatus, setPromotionStatus] = useState(null);
  const [loadingRequest, setLoadingRequest] = useState(false);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;

      const { data: updatedUser } = await axios.patch(
        `${API_BASE}/api/team6/user/update`,
        { nickname, email }
      );

      if (profileImageFile) {
        const form = new FormData();
        form.append("file", profileImageFile);

        await axios.post(
          `${API_BASE}/api/team6/user/profile-image`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setUser({
        ...updatedUser,
        nickname,
        email
      });

      alert("계정 정보가 업데이트되었습니다.");
    } catch (err) {
      console.error(err);
      alert("오류가 발생했습니다.");
    }
  };

  // 승격 상태 조회
  useEffect(() => {
    const fetchPromotionStatus = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const res = await axios.get(`${API_BASE}/api/team6/user/promotion/status`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPromotionStatus(res.data.status); // "NONE", "PENDING", "REJECTED"
      } catch (err) {
        console.error("승격 상태 조회 실패:", err);
      }
    };

    if (user?.role === "USER") {
      fetchPromotionStatus();
    }
  }, [user]);

  const handlePromotionRequest = async () => {
    try {
      setLoadingRequest(true);
      await axios.post(`${API_BASE}/api/team6/user/promotion/request`, null, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` }
      });
      alert("승격 요청이 전송되었습니다.");
      setPromotionStatus("PENDING");
    } catch (err) {
      console.error("승격 요청 실패:", err);
      alert("요청에 실패했습니다.");
    } finally {
      setLoadingRequest(false);
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
              <ProfileImage
                apiBaseUrl={API_BASE}
                token={localStorage.getItem("jwtToken")}
                className="w-40 h-40 rounded-full object-cover"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-2"
              />
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

{user?.role === "USER" && (
  <div className="mt-6 p-4 border border-indigo-600 rounded-lg bg-indigo-50 text-right">
    {promotionStatus === "NONE" && (
      <button
        onClick={handlePromotionRequest}
        disabled={loadingRequest}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm"
      >
        {loadingRequest ? "요청 중..." : "관리자 승격 요청하기"}
      </button>
    )}

    {promotionStatus === "PENDING" && (
      <p className="text-sm text-indigo-700">
        관리자 승격 요청이 <strong>접수</strong>되었습니다.
      </p>
    )}

    {promotionStatus === "REJECTED" && (
      <p className="text-sm text-red-600">
        이전 요청이 <strong>거절</strong>되었습니다.
      </p>
    )}
  </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AccountManagementPage;
