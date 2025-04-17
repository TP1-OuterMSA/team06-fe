import React from "react";

function Toggle({ checked }) {
  return (
    <label className="relative inline-block w-[50px] h-[26px]">
      <input type="checkbox" defaultChecked={checked} className="sr-only peer" />
      <span className="absolute inset-0 bg-gray-300 rounded-full peer-checked:bg-indigo-500 transition"></span>
      <span className="absolute h-5 w-5 left-[3px] bottom-[3px] bg-white rounded-full transition peer-checked:translate-x-6"></span>
    </label>
  );
}

function NotificationSettings() {
  const settings = [
    {
      title: "Sold out 알림",
      desc: "상품이 품절되었을 때 알림을 받습니다",
      checked: true,
    },
    {
      title: "좋아하는 메뉴 등록 알림",
      desc: "즐겨찾기에 메뉴의 상태 변경시 알림을 받습니다",
      checked: false,
    },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow mb-6">
      <div className="text-lg font-semibold mb-4">알림 설정</div>
      {settings.map((s, i) => (
        <div
          key={i}
          className="flex justify-between items-start border-b last:border-b-0 py-4"
        >
          <div>
            <div className="font-medium">{s.title}</div>
            <div className="text-sm text-gray-500 mt-1">{s.desc}</div>
          </div>
          <Toggle checked={s.checked} />
        </div>
      ))}
    </div>
  );
}

export default NotificationSettings;
