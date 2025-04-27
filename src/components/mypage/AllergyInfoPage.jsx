import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

// 기본 알레르기 옵션
const defaultAllergies = [
  "알류", "우유", "메밀", "땅콩", "대두",
  "밀", "잣", "호두", "게", "새우",
  "오징어", "고등어", "조개류", "복숭아", "토마토",
  "닭고기", "돼지고기", "쇠고기", "아황산류"
];

function AllergyInfoPage() {
  const [allergyOptions, setAllergyOptions] = useState([]);
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [newAllergy, setNewAllergy] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("allergyOptions");
    if (stored) {
      setAllergyOptions(JSON.parse(stored));
    } else {
      setAllergyOptions(defaultAllergies);
      localStorage.setItem("allergyOptions", JSON.stringify(defaultAllergies));
    }

    // 초기 선택 항목 예시
    const initial = ["땅콩", "우유"];
    setSelectedAllergies(initial);
  }, []);

  const handleToggle = (opt) => {
    setSelectedAllergies(prev =>
      prev.includes(opt)
        ? prev.filter(a => a !== opt)
        : [...prev, opt]
    );
  };

  const handleSave = () => {
    alert(`알레르기가 저장되었습니다: ${selectedAllergies.join(", ")}`);
  };

  const handleAddAllergy = () => {
    const trimmed = newAllergy.trim();
    if (!trimmed) return;
    if (allergyOptions.includes(trimmed)) {
      alert("이미 존재하는 알레르기입니다.");
      return;
    }
    const updated = [...allergyOptions, trimmed];
    setAllergyOptions(updated);
    localStorage.setItem("allergyOptions", JSON.stringify(updated));
    setNewAllergy("");
    alert(`'${trimmed}' 알레르기가 추가되었습니다.`);
  };

  return (
    <div className="flex min-h-screen bg-[#f5f7fa] text-gray-800">
      <Sidebar />
      <main className="flex-1 p-5">
        <Header />

        {/* 등록 카드 */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <div className="text-lg font-semibold">
            등록된 알레르기: {selectedAllergies.length ? selectedAllergies.join(', ') : '없음'}
          </div>
        </div>

        {/* 수정 폼 */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <div className="text-lg font-semibold mb-4">알레르기 수정</div>
          <div className="grid grid-cols-3 gap-4">
            {allergyOptions.map(opt => (
              <label key={opt} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  checked={selectedAllergies.includes(opt)}
                  onChange={() => handleToggle(opt)}
                />
                <span className="text-sm">{opt}</span>
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

        {/* 새 옵션 추가 */}
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="text-lg font-semibold mb-4">새 알레르기 추가</div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newAllergy}
              onChange={e => setNewAllergy(e.target.value)}
              placeholder="알레르기 이름 입력"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleAddAllergy}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              추가
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AllergyInfoPage;