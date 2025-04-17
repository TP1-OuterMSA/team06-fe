import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import AllergyInfoCard from "./AllergyInfoCard";
import NotificationSettings from "./NotificationSettings";
import FavoritesSection from "./FavoritesSection";

function Mypage() {
  return (
    <div className="flex min-h-screen bg-[#f5f7fa] text-gray-800">
      <Sidebar />
      <main className="flex-1 p-5">
        <Header />
        <AllergyInfoCard />
        <NotificationSettings />
        <FavoritesSection />
      </main>
    </div>
  );
}

export default Mypage;
