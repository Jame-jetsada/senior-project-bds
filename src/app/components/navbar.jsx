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

  const [currentDateTime, setCurrentDateTime] = useState("");

  useEffect(() => {
      const updateTime = () => {
        const now = new Date();
        const formatted = now.toLocaleString("th-TH", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        setCurrentDateTime(formatted);
      };
  
      updateTime();
      const interval = setInterval(updateTime, 1000); // อัปเดตทุกวินาที
  
      return () => clearInterval(interval);
    }, []);
  

  return (
    <div>
      <nav className="bg-[#5ABCF5] text-lg text-white p-6 relative">
        <div className="container mx-auto flex justify-center relative">
          <div className="text-center">{title}</div>
        </div>

        {/* <div className="absolute top-4 right-3 text-sm">
          <p>วันที่ : {currentDateTime}</p>
        </div> */}

        <div className="absolute top-1 right-1 text-sm text-right">
          <p>วันที่ : {currentDateTime.split(" ")[0]} {currentDateTime.split(" ")[1]} {currentDateTime.split(" ")[2]}</p>
          <p>เวลา : {currentDateTime.split(" ")[4]}</p>
        </div>


        <div
            className="absolute text-white text-4xl top-3 left-5 cursor-pointer"
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
