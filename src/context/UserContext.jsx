import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  // 앱 초기화 시: localStorage에 accessToken이 남아 있으면 axios 헤더 설정 후 /me 호출
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/api/team6/user/me`)
        .then((res) => setUser(res.data))
        .catch(() => {
          // 토큰이 만료됐거나 유효하지 않으면 초기화
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          delete axios.defaults.headers.common.Authorization;
        });
    }
  }, []);

  const login = ({ accessToken, refreshToken }) => {
    // 로그인 성공 시 호출
    localStorage.setItem("jwtToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    setUser({}); // userContext가 비어있으면 /me로 다시 fetch하게 해도 되고,
    // 위 빈 객체 대신 필요한 초기 user정보를 여기에 담아도 됩니다.
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    delete axios.defaults.headers.common.Authorization;
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}