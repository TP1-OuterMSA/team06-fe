import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    
    if (token) {
      // 토큰이 있으면 마이페이지로 이동
      navigate('/mypage');
    } else {
      // 토큰이 없으면 로그인 페이지로 이동
      navigate('/login');
    }
  }, [navigate]);

  // 리다이렉트 중임을 보여주는 로딩 화면
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f7fa]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">페이지를 불러오는 중...</p>
      </div>
    </div>
  );
}