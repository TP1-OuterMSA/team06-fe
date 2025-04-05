import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import '../styles/MealCongestionGraph.css';

const MealCongestionGraph = () => {
  const breakfastData = [
    { visitTime: '08:00', averageScore: 40 },
    { visitTime: '08:15', averageScore: 60 },
    { visitTime: '08:30', averageScore: 70 },
    { visitTime: '08:45', averageScore: 50 },
    { visitTime: '09:00', averageScore: 30 },
  ];

  const lunchData = [
    { visitTime: '11:30', averageScore: 55 },
    { visitTime: '11:45', averageScore: 75 },
    { visitTime: '12:00', averageScore: 90 },
    { visitTime: '12:15', averageScore: 95 },
    { visitTime: '12:30', averageScore: 80 },
    { visitTime: '12:45', averageScore: 70 },
    { visitTime: '13:00', averageScore: 60 },
    { visitTime: '13:15', averageScore: 40 },
    { visitTime: '13:30', averageScore: 30 },
    { visitTime: '13:45', averageScore: 20 },
    { visitTime: '14:00', averageScore: 10 },
  ];

  const dinnerData = [
    { visitTime: '17:00', averageScore: 30 },
    { visitTime: '17:15', averageScore: 40 },
    { visitTime: '17:30', averageScore: 55 },
    { visitTime: '17:45', averageScore: 60 },
    { visitTime: '18:00', averageScore: 45 },
    { visitTime: '18:15', averageScore: 35 },
    { visitTime: '18:30', averageScore: 20 },
  ];

  const [selected, setSelected] = useState('breakfast');

  const dataMap = {
    breakfast: breakfastData,
    lunch: lunchData,
    dinner: dinnerData,
  };

  const colors = {
    breakfast: '#8884d8',
    lunch: '#82ca9d',
    dinner: '#ffc658',
  };

  const labelMap = {
    breakfast: '조식',
    lunch: '중식',
    dinner: '석식',
  };

  return (
    <div className="meal-container">
      <div className='meal-title'>식사 시간 혼잡도 예측</div>
      <div className="meal-button-group">
        {['breakfast', 'lunch', 'dinner'].map((meal) => (
          <button
            key={meal}
            onClick={() => setSelected(meal)}
            className={`meal-button ${selected === meal ? 'active' : ''}`}
          >
            {labelMap[meal]}
          </button>
        ))}
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={dataMap[selected]}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="visitTime" />
            <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <Tooltip formatter={(value) => `${value}%`} />
            <Legend />
            <Line
              type="monotone"
              dataKey="averageScore"
              name={`${labelMap[selected]} 혼잡도`}
              stroke={colors[selected]}
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MealCongestionGraph;
