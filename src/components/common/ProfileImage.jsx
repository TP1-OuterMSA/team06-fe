import React, { useState, useEffect } from "react";
import axios from "axios";
import defaultImage from "../../../public/default-profile.png";

export default function ProfileImage({ apiBaseUrl, token, refresh, className }) {
  const [imgSrc, setImgSrc] = useState(null);

  useEffect(() => {
    let objectUrl;

    const fetchImage = async () => {
      try {
        const resp = await axios.get(
          `${apiBaseUrl}/api/team6/user/profile-image`,
          {
            headers: { Authorization: `Bearer ${token}` },
            responseType: "blob",
          }
        );
        objectUrl = URL.createObjectURL(resp.data);
        setImgSrc(objectUrl);
      } catch (err) {
        console.error("프로필 이미지 로드 실패", err);
        setImgSrc(null);
      }
    };

    if (token && apiBaseUrl) {
      fetchImage();
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [apiBaseUrl, token, refresh]);

  const placeholder = defaultImage;

  return (
    <img
      src={imgSrc || placeholder}
      alt="프로필"
      className={className || "w-32 h-32 rounded-full object-cover"}
    />
  );
}
