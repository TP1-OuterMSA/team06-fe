import React from "react";

function FavoriteItem({ name, price, status, statusType, image }) {
  return (
    <div className="border rounded-xl p-4 text-center hover:shadow-md transition">
      <img
        src={image}
        alt={name}
        className="w-20 h-20 object-cover mx-auto rounded-lg"
      />
      <div className="font-semibold mt-2">{name}</div>
      <div className="text-sm text-gray-700">{price}</div>
      <div
        className={`inline-block mt-2 text-xs px-2 py-1 rounded ${
          statusType === "available"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-600"
        }`}
      >
        {status}
      </div>
    </div>
  );
}

export default FavoriteItem;
