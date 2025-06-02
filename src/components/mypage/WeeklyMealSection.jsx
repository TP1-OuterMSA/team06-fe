import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

function WeeklyMealSection() {
  const [weeklyMeals, setWeeklyMeals] = useState([]);
  const [favoriteNames, setFavoriteNames] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const GT_PREFIX = import.meta.env.VITE_GT_SERVICE_PREFIX;
  
  const days = ["월", "화", "수", "목", "금"];
  const mealTypes = ["조식", "중식", "석식"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const [mealsRes, favoritesRes] = await Promise.all([
          axios.get(`${API_BASE}/api/team6/meal/schedule/week`),
          axios.get(`${API_BASE}${GT_PREFIX}/api/team6/user/meal/favorite`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setWeeklyMeals(mealsRes.data);
        setFavoriteNames(new Set(favoritesRes.data.map((meal) => meal.name)));
      } catch (error) {
        console.error("식단표 또는 좋아하는 메뉴 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const mealMatrix = useMemo(() => {
    const matrix = {};
    mealTypes.forEach((type) => {
      matrix[type] = {};
      days.forEach((day) => {
        matrix[type][day] = [];
      });
    });

    weeklyMeals.forEach(({ day, mealType, menus }) => {
      if (matrix[mealType]?.[day]) {
        matrix[mealType][day] = menus; // menus: string[]
      }
    });

    return matrix;
  }, [weeklyMeals]);

  if (loading) return <div>불러오는 중...</div>;

  return (
    <div className="overflow-x-auto mt-4">
      <table className="table-fixed w-full border-collapse text-sm text-center">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="border p-2 w-16">구분</th>
            {days.map((day) => (
              <th key={day} className="border p-2 w-[18%] truncate">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {mealTypes.map((type) => (
            <tr key={type}>
              <td className="border p-2 font-semibold bg-gray-50 text-gray-700">
                {type}
              </td>
              {days.map((day) => (
                <td key={day} className="border p-2 align-top">
                  <ul className="space-y-1">
                    {mealMatrix[type][day]?.length > 0 ? (
                      mealMatrix[type][day].map((name, idx) => (
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
                      ))
                    ) : (
                      <li className="text-gray-400">-</li>
                    )}
                  </ul>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default WeeklyMealSection;
