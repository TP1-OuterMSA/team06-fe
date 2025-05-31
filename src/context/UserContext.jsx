import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

// Allow sending HttpOnly cookies
axios.defaults.withCredentials = true;

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false);
  let isRefreshing = false;
  let failedQueue = [];

  const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
      if (error) prom.reject(error);
      else      prom.resolve(token);
    });
    failedQueue = [];
  };

  const loadUser = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/team6/user/me`
      );
      setUser(data);
    } catch (e) {
      setUser(null);
    } finally {
      setInitialized(true);
    }
  }, []);
    
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Logout helper with optional redirect
  const logout = useCallback((redirectToLogin = false) => {
    setUser(null);
    localStorage.removeItem("accessToken");
    delete axios.defaults.headers.common.Authorization;
    
    // 새로고침
    if (redirectToLogin) {
      window.location.reload();
    }
  }, []);

  // Interceptor: on 401, try refreshing access token using HttpOnly refresh token
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      res => res,
      err => {
        const originalRequest = err.config;
        if (err.response?.status === 401 && !originalRequest._retry) {
          // 첫 번째 401이면
          originalRequest._retry = true;

          if (isRefreshing) {
            // 이미 리프레시 중이라면 큐에 넣고 기다렸다 재시도
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            }).then(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return axios(originalRequest);
            });
          }

          // 아직 리프레시 시도를 안 했다면
          isRefreshing = true;
          return new Promise((resolve, reject) => {
            axios.post(
              `${import.meta.env.VITE_API_BASE_URL}/api/auth/user/refresh`
            )
              .then(({ data }) => {
                const newToken = data.accessToken;
                localStorage.setItem("accessToken", newToken);
                axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;
                processQueue(null, newToken);
                // 원래 요청도 토큰 갱신 후 재시도
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                resolve(axios(originalRequest));
              })
              .catch(refreshError => {
                processQueue(refreshError, null);
                
                // 403 에러인 경우 로그아웃 후 로그인 페이지로 리다이렉트
                if (refreshError.response?.status === 403 && originalRequest._retry === false) { // 
                  console.log('Refresh token expired or invalid. Redirecting to login...');
                  
                  logout(); // 로그인 페이지로 리다이렉트
                } else {
                  alert("사용자 정보 갱신에 실패했습니다. 다시 로그인해 주세요.");
                  logout(); // 일반 로그아웃
                }
                
                reject(refreshError);
              })
              .finally(() => {
                isRefreshing = false;
              });
          });
        }
        return Promise.reject(err);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, [logout]);

  // On app init: load AT from storage and fetch user profile
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/api/team6/user/me`)
        .then(res => setUser(res.data))
        .catch(() => {
          // Clear invalid token
          localStorage.removeItem("accessToken");
          delete axios.defaults.headers.common.Authorization;
        });
    }
  }, []);

  // Login: store AT and fetch profile
  const login = async ({ accessToken }) => {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/team6/user/me`
        );
        setUser(res.data);
      } catch {
        logout();
      }
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout, initialized }}>
      {children}
    </UserContext.Provider>
  );
}