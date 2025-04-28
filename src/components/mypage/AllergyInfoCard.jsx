import React from "react";

function AllergyInfoCard({allergies}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow mb-6">
      {allergies.length > 0 ? (
        <div className="text-lg font-semibold">
          등록된 알레르기:
          {allergies.map((allergy, index) => (
            <span key={index} className="ml-2">
              {allergy}{index !== allergies.length - 1 && ','}
            </span>
          ))}
        </div>
      ) : (
        <div className="text-lg font-semibold">등록된 알레르기가 없습니다.</div>
      )}
    </div>
  );
}

export default AllergyInfoCard;
