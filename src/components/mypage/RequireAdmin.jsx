import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

export default function RequireAdmin({ children }) {
  const { user } = useContext(UserContext);

  if (!user) {
    // 로그인 안 됐으면 로그인 페이지로
    return <Navigate to="/login" replace />;
  }
  if (user.role !== "ADMIN") {
    // 관리자가 아니면 내 페이지로
    return <Navigate to="/mypage" replace />;
  }
  return children;
}
