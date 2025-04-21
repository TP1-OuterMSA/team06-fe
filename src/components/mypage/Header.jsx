import React from "react";

function Header() {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold">나의 알레르기 정보</h2>
      <button className="bg-gray-800 text-white px-4 py-2 rounded-md">로그아웃</button>
    </div>
  );
}

export default Header;
