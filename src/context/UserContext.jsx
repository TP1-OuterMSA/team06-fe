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

  // const loadUser = useCallback(async () => {
  //   try {
  //     const { data } = await axios.get(
  //       `${import.meta.env.VITE_API_BASE_URL}/api/team6/user/me`
  //     );
  //     setUser(data);
  //   } catch (e) {
  //     setUser(null);
  //   } finally {
  //     setInitialized(true);
  //   }
  // }, []);
    
  // useEffect(() => {
  //   loadUser();
  // }, [loadUser]);
  // ─── (B) 앱 최초 마운트 시, localStorage에서 AT를 꺼내 헤더 설정 + /me 호출 ─────
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/api/team6/user/me`)
        .then(res => {
          setUser(res.data);
        })
        .catch(() => {
          // AT가 만료됐거나 유효하지 않으면 수동 로그아웃
          localStorage.removeItem("accessToken");
          delete axios.defaults.headers.common.Authorization;
        })
        .finally(() => {
          // 유저 정보를 가져왔든 실패했든 초기화 완료
          setInitialized(true);
        });
    } else {
      // 토큰 자체가 없으면 그냥 초기화 완료
      setInitialized(true);
    }
  }, []);
  // ───────────────────────────────────────────────────────────────────

  // ─── 인터셉터 로직 (401 발생 시 RT로 재발급 시도) ─────
  const logout = useCallback((redirectToLogin = false) => {
    setUser(null);
    localStorage.removeItem("accessToken");
    delete axios.defaults.headers.common.Authorization;

    if (redirectToLogin) {
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      res => res,
      err => {
        const originalRequest = err.config;
        if (err.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            }).then(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return axios(originalRequest);
            });
          }

          isRefreshing = true;
          return new Promise((resolve, reject) => {
            axios
              .post(
                `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_AUTH_SERVICE_PREFIX}/auth/user/refresh`
              )
              .then(({ data }) => {
                const newToken = data.accessToken;
                localStorage.setItem("accessToken", newToken);
                axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;
                processQueue(null, newToken);
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                resolve(axios(originalRequest));
              })
              .catch(refreshError => {
                processQueue(refreshError, null);
                if (refreshError.response?.status === 403) {
                  alert("사용자 정보 갱신에 실패했습니다. 다시 로그인해 주세요.");
                  logout(true);
                } else {
                  logout(true);
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

  // ─── 로그인 함수 (AT를 세팅하고 /me 호출) ─────
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