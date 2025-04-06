import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import Axios from "axios";
import "../styles/MealCongestionGraph.css";

function MealCongestionGraph() {
  const [selectedMeal, setSelectedMeal] = useState("lunch"); // 기본 중식
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchData(selectedMeal);
  }, [selectedMeal]);

  const fetchData = async (meal) => {
    try {
      const response = await Axios.get(`http://localhost:8080/api/congestion/${meal}`);
      setChartData(response.data);
    } catch (error) {
      console.error("혼잡도 데이터 요청 실패:", error);
    }
  };

  return (
    <div className="meal-container">
      <h2 className="meal-title">혼잡도 차트</h2>
      <div className="meal-button-group">
        {["breakfast", "lunch", "dinner"].map((meal) => (
          <button
            key={meal}
            className={`meal-button ${selectedMeal === meal ? "active" : ""}`}
            onClick={() => setSelectedMeal(meal)}
          >
            {meal === "breakfast" ? "조식" : meal === "lunch" ? "중식" : "석식"}
          </button>
        ))}
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="visitTime" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="averageScore"
              stroke="#007bff"
              strokeWidth={3}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default MealCongestionGraph;
