import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import Sidebar from './Sidebar';
import Header from './Header';
import AllergyInfoCard from './AllergyInfoCard';
import NotificationSettings from './NotificationSettings';
import FavoritesSection from './FavoritesSection';

function Mypage() {
  const { user } = useContext(UserContext);

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen bg-[#f5f7fa] text-gray-800">
      <Sidebar />
      <main className="flex-1 p-5">
        {/* 서버에서 받아온 사용자 정보로 Header에 전달 */}
        <Header username={user.username} email={user.email} />
        {/* 각 섹션에도 user.id를 prop으로 넘겨 데이터를 불러오도록 함 */}
        <AllergyInfoCard userId={user.id} />
        <NotificationSettings userId={user.id} />
        <FavoritesSection userId={user.id} />
      </main>
    </div>
  );
}

export default Mypage;