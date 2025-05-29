import React from "react";
import FavoriteItem from "./FavoriteItem";
import { useState } from "react";

function FavoritesSection() {
  const favorites = [
    {
      category: "MAIN",
      items: [{ name: "김치찌개" }, { name: "불고기" }],
    },
    {
      category: "DESSERT",
      items: [{ name: "케이크" }, { name: "빙수" }],
    },
    {
      category: "SIDE",
      items: [{ name: "샐러드" }, { name: "도토리묵무침" }],
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState(
    favorites[0].category
  );

  const currentItems =
    favorites.find((f) => f.category === selectedCategory)?.items || [];

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">좋아하는 메뉴</h3>
        <button
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

        {/* 내용 해시태그 */}
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
