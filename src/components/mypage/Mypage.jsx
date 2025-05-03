import React, { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import Sidebar from './Sidebar';
import Header from './Header';
import AllergyInfoCard from './AllergyInfoCard';
import NotificationSettings from './NotificationSettings';
import FavoritesSection from './FavoritesSection';
import { useEffect } from 'react';
import { Axios } from 'axios';
import axios from 'axios';

function Mypage() {
  const { user } = useContext(UserContext);
  const [myInfo, setMyInfo] = useState();

  useEffect(() => {
    fetchUserInfo();
  }, []);
  
  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/team6/user/me?userId=${user.id}`);
      const data = response.data;
      setMyInfo(data);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };


  if (!user) return <Navigate to="/login" replace />;

  return (
      <div className="flex min-h-screen bg-[#f5f7fa] text-gray-800">
        <Sidebar />
        <main className="flex-1 p-5">
          {myInfo && (
            <>
              {/* 서버에서 받아온 사용자 정보로 Header에 전달 */}
              <Header nickname={myInfo.nickname} email={myInfo.email} />
              {/* 각 섹션에도 user.id를 prop으로 넘겨 데이터를 불러오도록 함 */}
              <AllergyInfoCard allergies={myInfo.allergies} />
              <NotificationSettings userId={user.id} />
              <FavoritesSection userId={user.id} />
            </>
          )}
        </main>
      </div>

  );
}

export default Mypage;