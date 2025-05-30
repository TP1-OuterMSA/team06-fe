import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import ProfileImage from "../common/ProfileImage";

const menuItems = [
  { icon: "📢", label: "알레르기 정보", to: "/mypage/allergies" },
  { icon: "😎", label: "프로필",       to: "/mypage" },
  { icon: "🔔", label: "알림 설정",     to: "/mypage/notifications" },
  { icon: "♥️", label: "즐겨찾기",       to: "/mypage/favorites" },
  { icon: "⚙️", label: "계정 관리",     to: "/mypage/account" },
  { icon: "🛠️", label: "Admin 대시보드", to: "/admin", adminOnly: true }
];


function Sidebar() {
  const { user } = useContext(UserContext);
  const token = localStorage.getItem("accessToken");
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

console.log("Sidebar user context:", user);

  return (
    <aside className="w-[280px] bg-white p-5 border-r border-gray-200">
      <div className="flex flex-col items-center border-b border-gray-200 py-6">
        <ProfileImage
          apiBaseUrl={apiBaseUrl}
          token={token}
          className="w-32 h-32 rounded-full object-cover mb-4 border border-gray-300 block"
        />
        <div className="text-lg font-bold">
          {user ? user.nickname : "게스트"}
        </div>
        <div className="text-sm text-gray-500 mt-1">
          {user ? user.email : "로그인 해주세요"}
        </div>
      </div>

      <nav className="mt-6 space-y-2">
        {menuItems.map(({ icon, label, to, adminOnly }) => {
          if (adminOnly && user.role !== "ADMIN") return null;
          return (
            <NavLink
              key={to}
              to={to}
              end={to === "/mypage"}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-gray-100 transition
                 ${isActive ? "bg-indigo-50 font-medium" : "text-gray-700"}`
              }
            >
              <span>{icon}</span>
              <span className="text-sm">{label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;