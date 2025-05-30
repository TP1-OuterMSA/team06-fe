import React, { useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import Sidebar from "./Sidebar";
import Header from "./Header";
import AllergyInfoCard from "./AllergyInfoCard";
import NotificationSettings from "./NotificationSettings";
import FavoritesSection from "./FavoritesSection";
import ProfileImage from "../common/ProfileImage";
import axios from "axios";

function Mypage() {
  const { user } = useContext(UserContext);
  const [myInfo, setMyInfo] = useState(null);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;

        const { data } = await axios.get(
          `${API_BASE}/api/team6/user/me`
        );
        setMyInfo(data);
      } catch (err) {
        console.error('유저 정보 로드 실패', err);
      }
    };
    fetchData();
  }, []);

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen bg-[#f5f7fa] text-gray-800">
      <Sidebar />
      <main className="flex-1 p-5">
        {myInfo && (
          <>
            <ProfileImage
              apiBaseUrl={API_BASE}
              token={localStorage.getItem('accessToken')}
            />
            <Header
              nickname={myInfo.nickname}
              email={myInfo.email}
            />
            <AllergyInfoCard allergies={myInfo.allergies} />
            {/* <TodayMealCard/> */}
            <NotificationSettings />
            <FavoritesSection />
          </>
        )}
      </main>
    </div>
  );
}

export default Mypage;