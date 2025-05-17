import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';

function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = e.target.userId.value;
    const password = e.target.password.value;

    try {
      // 서버가 UserDto 객체를 반환
      const { data: userDto } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/team6/user/login`,
        { username, password }
      );

      // Context와 localStorage에 사용자 정보 저장
      setUser(userDto);
      localStorage.setItem('jwtToken', userDto.jwtToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${userDto.jwtToken}`;
      
      // 마이페이지 메인으로 이동
      navigate('/mypage');
    } catch (error) {
      console.error('로그인 실패:', error);
      alert('로그인 정보가 잘못되었습니다.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f7fa]">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-8">로그인</h2>
        <div className="mb-5">
          <label htmlFor="userId" className="block text-sm text-gray-700 mb-2">아이디</label>
          <input id="userId" name="userId" required className="w-full p-3 border rounded-lg" />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm text-gray-700 mb-2">비밀번호</label>
          <input type="password" id="password" name="password" required className="w-full p-3 border rounded-lg" />
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg">로그인</button>
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600">계정이 없으신가요? </span>
          <Link to="/register" className="text-sm font-semibold text-indigo-600">회원가입</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
