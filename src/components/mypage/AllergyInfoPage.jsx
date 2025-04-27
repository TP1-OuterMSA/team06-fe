import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

// 전체 알레르기 옵션
const allergyOptions = [
  "알류", "우유", "메밀", "땅콩", "대두",
  "밀", "잣", "호두", "게", "새우",
  "오징어", "고등어", "조개류", "복숭아", "토마토",
  "닭고기", "돼지고기", "쇠고기", "아황산류"
];

function AllergyInfoPage() {
  // 초기 선택된 알레르기 (예시: 서버에서 받아온 값으로 대체)
  const [selectedAllergies, setSelectedAllergies] = useState(["땅콩", "우유"]);

  // 체크박스 토글 핸들러
  const handleToggle = (allergy) => {
    setSelectedAllergies(prev =>
      prev.includes(allergy)
        ? prev.filter(a => a !== allergy)
        : [...prev, allergy]
    );
  };

  // 저장 버튼 핸들러 (예: API 호출)
  const handleSave = () => {
    // TODO: 서버로 선택된 알레르기 목록 전송
    console.log("저장된 알레르기:", selectedAllergies);
    alert(`알레르기가 저장되었습니다: ${selectedAllergies.join(", ")}`);
  };

  return (
    <div className="flex min-h-screen bg-[#f5f7fa] text-gray-800">
      <Sidebar />
      <main className="flex-1 p-5">
        {/* 헤더 */}
        <Header />

        {/* 현재 등록된 알레르기 카드 */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <div className="text-lg font-semibold">
            등록된 알레르기: {selectedAllergies.length > 0 ? selectedAllergies.join(", ") : "없음"}
          </div>
        </div>

        {/* 알레르기 수정 폼 */}
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="text-lg font-semibold mb-4">알레르기 수정</div>
          <div className="grid grid-cols-3 gap-4">
            {allergyOptions.map(option => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  checked={selectedAllergies.includes(option)}
                  onChange={() => handleToggle(option)}
                />
                <span className="text-sm">{option}</span>
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
      </main>
    </div>
  );
}

export default AllergyInfoPage;