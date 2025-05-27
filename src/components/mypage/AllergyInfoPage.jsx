// src/components/mypage/AllergyInfoPage.jsx

import React, { useState, useEffect, useContext } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import axios from "axios";
import { UserContext } from "../../context/UserContext";

function AllergyInfoPage() {
  const { user } = useContext(UserContext);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  // 전체 알레르기 목록 (서버에서 받아옴)
  const [allergies, setAllergies] = useState([]);

  // 사용자가 현재 등록한 알레르기
  const [selectedAllergies, setSelectedAllergies] = useState([]);

  // 새 알레르기 이름 입력값
  const [newAllergy, setNewAllergy] = useState("");

  // 1) 전체 알레르기 옵션 조회
  const fetchAllergies = async () => {
    try {
      const { data } = await axios.get(
        `${API_BASE}/api/team6/allergy/all`
      );
      setAllergies(data);
    } catch (err) {
      console.error("전체 알레르기 조회 실패:", err);
    }
  };

  // 2) 내 알레르기 조회
  const fetchMyAllergies = async () => {
    try {
      const { data } = await axios.get(
        `${API_BASE}/api/team6/userAllergy/${user.id}`
      );
      setSelectedAllergies(data.allergies);
    } catch (err) {
      console.error("내 알레르기 조회 실패:", err);
    }
  };

  useEffect(() => {
    // 컴포넌트 마운트 시 한 번만 로드
    fetchAllergies();
    fetchMyAllergies();
  }, []);

  // 3) 체크박스 토글
  const handleToggle = (allergy) => {
    setSelectedAllergies((prev) =>
      prev.some((a) => a.id === allergy.id)
        ? prev.filter((a) => a.id !== allergy.id)
        : [...prev, allergy]
    );
  };

  // 4) 변경된 알레르기 저장
  const handleSave = async () => {
    try {
      await axios.put(
        `${API_BASE}/api/team6/userAllergy/update`,
        {
          userId: user.id,
          allergies: selectedAllergies.map((a) => a.id),
        }
      );
      alert("알레르기가 저장되었습니다.");
    } catch (err) {
      console.error("알레르기 저장 실패:", err);
      alert("저장에 실패했습니다.");
    }
  };

  // 5) 새 알레르기 추가 요청 API 연동
  const handleAddAllergy = async () => {
    const name = newAllergy.trim();
    if (!name) {
      alert("추가할 알레르기 이름을 입력해주세요.");
      return;
    }

    try {
      await axios.post(
        `${API_BASE}/api/team6/user/allergy-request`,
        { allergyName: name },
        // { headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` } }
      );
      alert(`'${name}' 알레르기 추가 요청이 전송되었습니다.`);
      setNewAllergy("");
    } catch (err) {
      console.error("알레르기 요청 실패:", err);
      alert("요청에 실패했습니다.");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f5f7fa] text-gray-800">
      <Sidebar />
      <main className="flex-1 p-5">
        <Header />

        {/* 내 알레르기 카드 */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <div className="text-lg font-semibold">
            등록된 알레르기:{" "}
            {selectedAllergies.length > 0
              ? selectedAllergies.map((a) => a.name).join(", ")
              : "없음"}
          </div>
        </div>

        {/* 알레르기 수정 폼 */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <div className="text-lg font-semibold mb-4">알레르기 수정</div>
          <div className="grid grid-cols-3 gap-4">
            {allergies.map((allergy) => (
              <label key={allergy.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  checked={selectedAllergies.some((a) => a.id === allergy.id)}
                  onChange={() => handleToggle(allergy)}
                />
                <span className="text-sm">{allergy.name}</span>
              </label>
            ))}
          </div>
          <button
            onClick={handleSave}
            className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
          >
            저장
          </button>
        </div>

        {/* 새 알레르기 추가 요청 */}
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="text-lg font-semibold mb-4">새 알레르기 추가 요청</div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newAllergy}
              onChange={(e) => setNewAllergy(e.target.value)}
              placeholder="추가할 알레르기 이름 입력"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleAddAllergy}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              요청하기
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AllergyInfoPage;
