import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const username = e.target.userId.value;
    const password = e.target.password.value;
  
    try {
      const response = await axios.post("http://localhost:8080/api/team6/user/login", {
        username,
        password,
      });
  
      navigate("/mypage");
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("로그인 정보가 잘못되었습니다.");
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f7fa]">
      <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-md">
        <div className="text-2xl font-bold text-center mb-8">로그인</div>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="userId" className="block text-sm text-gray-700 mb-2">
              아이디
            </label>
            <input
              type="text"
              id="userId"
              name="userId"
              placeholder="이메일 또는 사용자명"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm text-gray-700 mb-2">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="비밀번호"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition"
          >
            로그인
          </button>
        </form>

        {/* 회원가입 링크 */}
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600">계정이 없으신가요? </span>
          <Link
            to="/register"
            className="text-sm font-semibold text-indigo-600 hover:underline"
          >
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
