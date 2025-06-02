import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

function TodayMealSection() {
  const [dailyMeals, setDailyMeals] = useState([]);
  const [favoriteNames, setFavoriteNames] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const mealTypes = ["조식", "중식", "석식"];
  const getTodayInKorean = () => {
    const daysKor = ["일", "월", "화", "수", "목", "금", "토"];
    return daysKor[new Date().getDay()];
  };
  const today = getTodayInKorean();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const [mealsRes, favoritesRes] = await Promise.all([
          axios.get(`${API_BASE}/api/team6/meal/schedule/day`, {
            params: { day: today },
          }),
          axios.get(`${API_BASE}${import.meta.env.VITE_GT_SERVICE_PREFIX}/api/team6/user/meal/favorite`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setDailyMeals(mealsRes.data);
        setFavoriteNames(new Set(favoritesRes.data.map((meal) => meal.name)));
      } catch (error) {
        console.error("오늘 식단 또는 좋아하는 메뉴 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [today]);

  const mealMap = useMemo(() => {
    const map = { 조식: [], 중식: [], 석식: [] };
    dailyMeals.forEach(({ mealType, menus }) => {
      map[mealType] = menus || [];
    });
    return map;
  }, [dailyMeals]);

  if (loading) return <div>불러오는 중...</div>;

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-6">오늘의 식단</h3>
      <div className="flex flex-wrap justify-start gap-4">
        {mealTypes.map((type) => (
          <div
            key={type}
            className="bg-white rounded-lg shadow p-3 w-64 text-center"
          >
            <h4 className="text-base font-semibold text-blue-600 mb-2">
              {type}
            </h4>
            {mealMap[type]?.length > 0 ? (
              <ul className="space-y-1">
                {mealMap[type].map((name, idx) => (
                  <li key={idx}>
                    <span
                      className={
                        favoriteNames.has(name)
                          ? "bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-semibold"
                          : "text-gray-700 text-sm"
                      }
                    >
                      {name}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-sm">-</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TodayMealSection;
