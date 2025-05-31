import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export default function ProtectedRoute() {
  const { user, initialized } = useContext(UserContext);
  const location = useLocation();
  console.log("확인중")
  // UserContext가 아직 초기화되지 않았다면 로딩 표시
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f7fa]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로그인 정보를 확인하는 중...</p>
        </div>
      </div>
    );
  }

  // localStorage에서 accessToken 확인
  const token = localStorage.getItem('accessToken');
  
  // 토큰이 없거나 사용자 정보가 없으면 로그인 페이지로 리다이렉트
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 토큰과 사용자 정보가 있으면 자식 컴포넌트 렌더링
  return <Outlet />;
}