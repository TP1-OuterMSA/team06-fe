import React from "react";
import FavoriteItem from "./FavoriteItem";

function FavoritesSection() {
  const favorites = [
    {
      name: "치즈버거",
      price: "8,500원",
      status: "판매중",
      statusType: "available",
      image: "/cheesebuger.png",
    },
    {
      name: "페퍼로니 피자",
      price: "18,000원",
      status: "품절",
      statusType: "soldout",
      image: "/peper.jpg",
    },
  ];

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">즐겨찾기 메뉴</h3>
        <span className="text-sm text-gray-500 cursor-pointer">
          (클릭하여 메뉴 추가)
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {favorites.map((item, idx) => (
          <FavoriteItem key={idx} {...item} />
        ))}

        <div className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-6 text-gray-400 hover:bg-gray-50 cursor-pointer">
          <i className="text-2xl mb-2">+</i>
          <div>새로운 메뉴 추가</div>
        </div>
      </div>
    </div>
  );
}

export default FavoritesSection;
