import React from "react";
import Sidebar from "./Sidebar";
import FavoritesSectionEditable from "./FavoritesSectionEditable";
import WeeklyMealSection from "./WeeklyMealSection";

function WeeklyMealPage() {
  return (
    <div className="flex min-h-screen bg-[#f5f7fa] text-gray-800">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2">주간 식단표</h2>
          <p className="text-sm text-gray-500 mb-6">
            이번 주 제공되는 <strong>조식, 중식, 석식</strong> 메뉴를 확인할 수 있어요.
            알레르기나 좋아하는 메뉴도 함께 확인해보세요!
          </p>
          <WeeklyMealSection/>
        </div>
      </main>
    </div>
  );
}

export default WeeklyMealPage;
