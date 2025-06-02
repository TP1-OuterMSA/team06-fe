import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function FavoritesSection() {
  const [favorites, setFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const GT_PREFIX = import.meta.env.VITE_GT_SERVICE_PREFIX;

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        //const userId = localStorage.getItem("userId");

        const res = await axios.get(
          `${API_BASE}${GT_PREFIX}/api/team6/user/meal/favorite`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              //userId: userId,
            },
          }
        );

        const data = res.data; // [{ id, name, category }]
        const grouped = data.reduce((acc, item) => {
          const category = item.category.toUpperCase();
          if (!acc[category]) {
            acc[category] = { category, items: [] };
          }
          acc[category].items.push({ name: item.name });
          return acc;
        }, {});

        const groupedList = Object.values(grouped);
        setFavorites(groupedList);
        setSelectedCategory(groupedList[0]?.category || "");
      } catch (err) {
        console.error("좋아하는 메뉴 불러오기 실패:", err);
      }
    };

    fetchFavorites();
  }, []);

  const currentItems =
    favorites.find((f) => f.category === selectedCategory)?.items || [];

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">좋아하는 메뉴</h3>
        <button
          onClick={() => navigate("/team6/mypage/favorites")}
          className="text-sm text-blue-500 hover:underline"
        >
          + 추가하러 가기
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-x-3 text-sm font-medium text-gray-400">
          {favorites.map((group, idx) => (
            <span
              key={idx}
              onClick={() => setSelectedCategory(group.category)}
              className={`cursor-pointer transition ${
                selectedCategory === group.category
                  ? "text-blue-600 font-semibold"
                  : "hover:text-gray-500"
              }`}
            >
              {group.category}
              {idx < favorites.length - 1 && (
                <span className="mx-2 text-gray-300 font-normal">|</span>
              )}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {currentItems.map((item, idx) => (
            <span
              key={idx}
              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
            >
              #{item.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FavoritesSection;
