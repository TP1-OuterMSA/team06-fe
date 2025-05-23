import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  // 앱 초기화 시: localStorage 에 토큰이 남아 있으면 axios 헤더에 설정하고
  // /me 로 유저 정보 가져와서 Context 채우기
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/api/team6/user/me`)
        .then((res) => setUser(res.data))
        .catch(() => {
          // 토큰이 만료됐거나 유효하지 않으면 초기화
          localStorage.removeItem("jwtToken");
          delete axios.defaults.headers.common.Authorization;
        });
    }
  }, []);

  const login = (userDto) => {
    // 로그인 성공 시 호출하는 유틸
    setUser(userDto);
    localStorage.setItem("jwtToken", userDto.jwtToken);
    axios.defaults.headers.common.Authorization = `Bearer ${userDto.jwtToken}`;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("jwtToken");
    delete axios.defaults.headers.common.Authorization;
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
