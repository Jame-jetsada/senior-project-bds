"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function Navbar(props) {
  const router = useRouter();

  const { page, title } = props;

  const goToPage = (page) => {
    router.push(page);
  };

  const [currentDateTime, setCurrentDateTime] = useState({ date: "", time: "" });

  useEffect(() => {
      const updateTime = () => {
        const now = new Date();

        const date = now.toLocaleDateString("th-TH", {
          year: "2-digit",
          month: "short",
          day: "numeric",
        });

        const time = now.toLocaleTimeString("th-TH",{
          hour: "2-digit",
          minute: "2-digit",
          
        });
        setCurrentDateTime({ date, time });
      };
  
      updateTime();
      const interval = setInterval(updateTime, 1000); // อัปเดตทุกวินาที
      return () => clearInterval(interval);
  }, []);
  

  return (
    <div>
      <nav className="bg-[#5ABCF5] text-lg text-white p-5 relative">
        <div className="container mx-auto flex justify-center relative">
          <div className="text-center">{title}</div>
        </div>

        <div className="absolute top-1 right-1 text-sm text-right">
          <p>วันที่ : {currentDateTime.date}</p>
          <p>เวลา : {currentDateTime.time}</p>
        </div>


        <div
            className="absolute text-white text-4xl top-2 left-2 cursor-pointer"
            onClick={() => goToPage(page)} 
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              fill="currentColor"
              className="bi bi-caret-left-fill px-2 rounded-md"
              viewBox="0 0 16 16"
            >
              <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
            </svg>
          </div>
      </nav>
    </div>
  );
}

export default Navbar;
