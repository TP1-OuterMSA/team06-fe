import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

function WeeklyMealSection() {
  const [weeklyMeals, setWeeklyMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const days = ["월", "화", "수", "목", "금"];
  const mealTypes = ["조식", "중식", "석식"];

  useEffect(() => {
    const fetchWeeklyMeals = async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/api/team6/meal/schedule/week`
        );
        console.log(response.data);
        setWeeklyMeals(response.data);
      } catch (error) {
        console.error("주간 식단 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWeeklyMeals();
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
        matrix[mealType][day] = menus; // ✅ 여기 수정
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
            <th className="border p-2 w-20">구분</th>
            {days.map((day) => (
              <th key={day} className="border p-2 truncate">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {mealTypes.map((type) => (
            <tr key={type}>
              <td className="border p-2 font-semibold bg-gray-50 w-20 truncate">
                {type}
              </td>
              {days.map((day) => (
                <td key={day} className="border p-2 align-top">
                  <ul className="space-y-1">
                    {mealMatrix[type][day]?.length > 0 ? (
                      mealMatrix[type][day].map((item, idx) => (
                        <li key={idx}>{item}</li>
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
