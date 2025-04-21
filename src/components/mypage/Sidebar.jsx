import React from "react";

function Sidebar() {
  return (
    <aside className="w-[280px] bg-white p-5 border-r border-gray-200">
      <div className="text-center border-b border-gray-200 py-6">
        <div className="text-lg font-bold">김민수</div>
        <div className="text-sm text-gray-500 mt-1">minsu.kim@example.com</div>
      </div>

      <nav className="mt-6 space-y-2">
        {["📢 알레르기 정보", "😎 프로필", "🔔 알림 설정", "♥️ 즐겨찾기", "⚙️ 계정 관리"].map(
          (item, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-100 ${
                item.includes("프로필") ? "bg-indigo-50" : ""
              }`}
            >
              <span>{item.split(" ")[0]}</span>
              <span className="text-sm">{item.split(" ")[1]}</span>
            </div>
          )
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;
