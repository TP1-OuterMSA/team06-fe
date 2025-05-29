import React, { useState, useEffect } from "react";
import axios from "axios";

function FavoritesSectionEditable() {
  const [favorites, setFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const getMealList = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/team6/meal/list`);
      const data = res.data;
      console.log("식단 목록:", data);

      // 카테고리별로 그룹화
      const grouped = data.reduce((acc, item) => {
        const category = item.category.toUpperCase();
        if (!acc[category]) {
          acc[category] = { category, allItems: [], selected: [] };
        }
        acc[category].allItems.push(item.name);
        return acc;
      }, {});

      const formatted = Object.values(grouped);
      setFavorites(formatted);
      setSelectedCategory(formatted[0]?.category || "");
    } catch (error) {
      console.error("식단 목록 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMealList();
  }, []);

  const toggleItem = (category, item) => {
    setFavorites((prev) =>
      prev.map((f) => {
        if (f.category !== category) return f;
        const isSelected = f.selected.includes(item);
        const updated = isSelected
          ? f.selected.filter((i) => i !== item)
          : [...f.selected, item];
        return { ...f, selected: updated };
      })
    );
  };

  const handleSave = () => {
    const result = favorites.reduce((acc, cur) => {
      acc[cur.category] = cur.selected;
      return acc;
    }, {});
    console.log("저장된 즐겨찾기:", result);
    alert("저장되었습니다.");
  };

  const currentGroup = favorites.find((f) => f.category === selectedCategory);

  if (loading) return <div>불러오는 중...</div>;
  if (!currentGroup) return <div>해당 카테고리의 메뉴가 없습니다.</div>;

  return (
    <div className="space-y-4 max-w-md">
      {/* 카테고리 선택 */}
       <div className="flex flex-nowrap text-base font-medium text-gray-400 gap-x-3">
        {favorites.map((group, idx) => (
          <span
            key={idx}
            onClick={() => setSelectedCategory(group.category)}
            className={`inline-block cursor-pointer transition ${
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

      {/* 항목 전체 리스트 (세로 스크롤) */}
      <div className="max-h-[32rem] overflow-y-auto border border-gray-200 rounded">
        <ul className="divide-y divide-gray-100">
          {currentGroup.allItems.map((item, idx) => {
            const isSelected = currentGroup.selected.includes(item);
            return (
              <li
                key={idx}
                className="flex items-center justify-between px-3 py-3"
              >
                <span className="text-sm text-gray-800 truncate max-w-[10rem]">
                  {item}
                </span>
                <button
                  onClick={() => toggleItem(currentGroup.category, item)}
                  className={`w-20 text-sm rounded text-center py-1 px-0 ${
                    isSelected
                      ? "bg-blue-100 text-blue-700 border border-blue-300"
                      : "bg-gray-100 text-gray-500 border border-gray-300"
                  }`}
                >
                  {isSelected ? "선택됨" : "추가"}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 선택된 항목 미리보기 */}
      <div className="py-4">
        <h4 className="text-base font-semibold mb-5 text-gray-700">메뉴 목록</h4>
        <div className="flex flex-wrap gap-2">
          {currentGroup.selected.map((item, idx) => (
            <span
              key={idx}
              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
            >
              #{item}
            </span>
          ))}
        </div>
      </div>

      <div className="text-right pt-4">
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-sky-500 text-sm"
        >
          저장하기
        </button>
      </div>
    </div>
  );
}

export default FavoritesSectionEditable;
