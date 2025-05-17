import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const API = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("jwtToken");
  const navigate = useNavigate(); 

  const fetchRequests = async () => {
    try {
      const { data } = await axios.get(
        `${API}/api/team6/user/promotion/pending`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests(data);
    } catch (err) {
      console.error("승격 요청 목록 로드 실패:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, action) => {
    try {
      await axios.post(
        `${API}/api/team6/user/promotion/${action}/${id}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRequests();
    } catch (err) {
      console.error(`${action} 처리 실패:`, err);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f5f7fa] text-gray-800">
      <aside className="w-64 p-5 bg-white border-r">
        <h2 className="text-lg font-bold mb-4">Admin Dashboard</h2>

        {/* ✅ 마이페이지 이동 버튼 */}
        <button
          onClick={() => navigate("/mypage")}
          className="mt-4 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
        >
          마이페이지로 이동
        </button>
      </aside>

      <main className="flex-1 p-6">
        <h3 className="text-xl font-semibold mb-4">승격 요청 목록</h3>
        <table className="w-full bg-white rounded-lg shadow overflow-hidden">
  <thead className="bg-gray-100 text-left">
    <tr>
      <th className="p-3 text-sm font-medium text-gray-600">요청 ID</th>
      <th className="p-3 text-sm font-medium text-gray-600">사용자명</th>
      <th className="p-3 text-sm font-medium text-gray-600">요청 시간</th>
      <th className="p-3 text-sm font-medium text-gray-600">상태</th>
      <th className="p-3 text-sm font-medium text-gray-600">액션</th>
    </tr>
  </thead>
  <tbody className="text-sm">
    {requests.map((r) => (
      <tr key={r.id} className="border-t">
        <td className="p-3">{r.id}</td>
        <td className="p-3">{r.user.username}</td>
        <td className="p-3">{new Date(r.requestedAt).toLocaleString()}</td>
        <td className="p-3">{r.status}</td>
        <td className="p-3 space-x-2 whitespace-nowrap">
          <button
            onClick={() => handleAction(r.id, "approve")}
            className="px-3 py-1 bg-green-500 text-white rounded"
          >
            승인
          </button>
          <button
            onClick={() => handleAction(r.id, "reject")}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            거절
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
      </main>
    </div>
  );
}
