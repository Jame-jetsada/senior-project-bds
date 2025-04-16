"use client";

import React, { useState ,useEffect} from "react";
import Image from "next/image";

function Navbar() {
  const [userData, setUserData] = useState({
    user_name: "",
    site_name : "",
    
  });
  useEffect(() => {
    const firstName = localStorage.getItem("firstname") || "ผู้ใช้"; // Fallback ถ้าไม่มีค่า
    const siteName = localStorage.getItem("site_name") || "สาขา";
    setUserData({ user_name: firstName, site_name: siteName });
  }, []);

  return (
    <div className="flex items-center justify-between p-4 bg-[#50B0E9] ">
      {/* home icon */}
      <div className="flex items-center gap-6 justify-end w-full">
        <div className="flex flex-col text-white text-[14px] leading-4 font-medium">
          <span>ชื่อ : {userData.user_name}</span>
          <span>ตำแหน่ง : Admin</span>
          <span>สาขา : {userData.site_name}</span>
        </div>
      </div>
    </div>

  );
}

export default Navbar;
