import React from "react";
import Sidebar from "./Sidebar";
import FavoritesSectionEditable from "./FavoritesSectionEditable";

function FavoritesPage() {
  return (
    <div className="flex min-h-screen bg-[#f5f7fa] text-gray-800">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2">나의 좋아하는 메뉴</h2>
          <p className="text-sm text-gray-500 mb-6">
            자주 먹는 메뉴를 <strong>편집</strong>하고 추가할 수 있어요. 카테고리를 선택해보세요!
          </p>
          <FavoritesSectionEditable />
        </div>
      </main>
    </div>
  );
}

export default FavoritesPage;
