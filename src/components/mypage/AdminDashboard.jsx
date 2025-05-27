// src/components/mypage/AdminDashboard.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [promoReqs, setPromoReqs] = useState([]);
  const [allergyReqs, setAllergyReqs] = useState([]);
  const [notification, setNotification] = useState(null);
//알람 사라지게
    useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      setNotification(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [notification]);

  // 모달 상태
  const [isRejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectTarget, setRejectTarget] = useState({ type: "", id: null });
  const [rejectReason, setRejectReason] = useState("");

  const API = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  // 1) 데이터 로드
  const fetchPromo = async () => {
    const { data } = await axios.get(
      `${API}/api/team6/user/promotion/pending`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setPromoReqs(data);
  };
  const fetchAllergy = async () => {
    const { data } = await axios.get(
      `${API}/api/team6/user/allergy-request/pending`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setAllergyReqs(data);
  };
  useEffect(() => {
    fetchPromo();
    fetchAllergy();
  }, []);

  // 2) 승인
  const handleApprove = async (type, id) => {
    await axios.post(
      `${API}/api/team6/user/${type}-request/approve/${id}`,
      null,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setNotification("요청 승인이 완료되었습니다.")
    type === "promotion" ? fetchPromo() : fetchAllergy();
  };

  // 3) 거절 클릭 → 모달 띄우기
  const openRejectModal = (type, id) => {
    setRejectTarget({ type, id });
    setRejectReason("");
    setRejectModalOpen(true);
  };

  // 4) 모달 확인 → API 호출
const confirmReject = async () => {
  if (!rejectReason.trim()) {
    alert("거절 사유를 입력해주세요.");
    return;
  }
  try {
    const { type, id } = rejectTarget;

    const endpoint =
      type === "promotion"
        ? `/api/team6/user/promotion/reject/${id}`
        : `/api/team6/user/allergy-request/reject/${id}`;

    const url = `${API}${endpoint}`;
    console.log("거절 호출 URL:", url);

    await axios.post(
      url,
      { reason: rejectReason },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setNotification("요청을 거절하였습니다.");
    setRejectModalOpen(false);
    type === "promotion" ? fetchPromo() : fetchAllergy();
  } catch (err) {
    console.error("거절 처리 에러", err);
    alert("거절 처리에 실패했습니다.");
  }
};

  // 5) 모달 취소
  const cancelReject = () => {
    setRejectModalOpen(false);
  };

  // 공통 colgroup
  const colgroup = (
    <colgroup>
      <col className="w-1/12" />
      <col className="w-3/12" />
      <col className="w-4/12" />
      <col className="w-2/12" />
      <col className="w-2/12" />
    </colgroup>
  );

  return (
    <div className="flex min-h-screen bg-[#f5f7fa] text-gray-800">
    {/* 알림 배너 */}
    {notification && (
       <div className="fixed top-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded shadow-lg z-50">
         {notification}
       </div>
     )}
      
      {/* 사이드바 */}
      <aside className="w-64 p-5 bg-white border-r">
        <h2 className="text-lg font-bold mb-4">Admin Dashboard</h2>
        <button
          onClick={() => navigate("/mypage")}
          className="mt-4 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
        >
          마이페이지로 이동
        </button>
      </aside>

      {/* 메인 */}
      <main className="flex-1 p-6 space-y-8">
        {/* 승격 요청 */}
        <section className="bg-white p-6 rounded-xl shadow overflow-auto">
          <h3 className="text-xl font-semibold mb-4">승격 요청 목록</h3>
          <table className="w-full table-fixed text-sm">
            {colgroup}
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">사용자</th>
                <th className="p-3 text-left">요청 시간</th>
                <th className="p-3 text-left">상태</th>
                <th className="p-3 text-center">액션</th>
              </tr>
            </thead>
            <tbody>
              {promoReqs.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3">{r.id}</td>
                  <td className="p-3">{r.user.username}</td>
                  <td className="p-3">
                    {new Date(r.requestedAt).toLocaleString()}
                  </td>
                  <td className="p-3">{r.status}</td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => handleApprove("promotion", r.id)}
                      className="px-3 py-1 bg-green-500 text-white rounded"
                    >
                      승인
                    </button>
                    <button
                      onClick={() => openRejectModal("promotion", r.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      거절
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* 알레르기 추가 요청 */}
        <section className="bg-white p-6 rounded-xl shadow overflow-auto">
          <h3 className="text-xl font-semibold mb-4">
            알레르기 추가 요청 목록
          </h3>
          <table className="w-full table-fixed text-sm">
            {colgroup}
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">사용자</th>
                <th className="p-3 text-left">알레르기</th>
                <th className="p-3 text-left">요청 시간</th>
                <th className="p-3 text-center">액션</th>
              </tr>
            </thead>
            <tbody>
              {allergyReqs.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3">{r.id}</td>
                  <td className="p-3">{r.user.username}</td>
                  <td className="p-3">{r.allergyName}</td>
                  <td className="p-3">
                    {new Date(r.requestedAt).toLocaleString()}
                  </td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => handleApprove("allergy", r.id)}
                      className="px-3 py-1 bg-green-500 text-white rounded"
                    >
                      승인
                    </button>
                    <button
                      onClick={() => openRejectModal("allergy", r.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      거절
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      {/* 거절 사유 모달 */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h4 className="text-lg font-semibold mb-4">거절 사유 입력</h4>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none"
              placeholder="거절 사유를 입력하세요"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={cancelReject}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                취소
              </button>
              <button
                onClick={confirmReject}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
