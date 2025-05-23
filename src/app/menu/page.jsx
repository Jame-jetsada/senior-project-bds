"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Sidebar from "../components/sidebar";
import Swal from "sweetalert2";
import { checkInspectionRound } from "../service/api.service";

function MenuPage() {
  const router = useRouter();

  const handleCheckInspection = async () => {
    try {
      const result = await checkInspectionRound();
      if (result.res_code === "000") {
        router.push("/amount");
      } else if (result.res_code === "E110") {
        Swal.fire({
          icon: 'error',   // ประเภทของ alert
          title: 'แจ้งเตือน',  // หัวข้อของ error
          text: 'อยู่นอกเวลาทำการนับสินค้า',  // ข้อความใน error
        });
      }
    } catch (error) {
      setError(error);
    }
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
          const time = now.toLocaleTimeString("th-TH", {            
            hour: "2-digit",
            minute: "2-digit",
            // second: "2-digit",
          });
          setCurrentDateTime({ date, time });
        };
    
        updateTime();
        const interval = setInterval(updateTime, 1000); // อัปเดตทุกวินาที
        return () => clearInterval(interval);
      }, []);

  return (
    <div>
      <nav className="bg-[#5ABCF5] text-white p-5">
        <div className="container mx-auto">
          <Sidebar />
          <div className="flex justify-center items-center text-lg">
            เลือกเมนู
          </div>
        </div>
        <div className="absolute top-1 right-1 text-sm text-right">
          <p>วันที่ : {currentDateTime.date}</p>
          <p>เวลา : {currentDateTime.time}</p>
        </div>
      </nav>

      <div className="flex flex-col items-center justify-center ">
        <button
          type="submit"
          className="w-60 mt-10 my-2 shadow-md bg-white text-[#5ABCF5] hover:text-white font-semibold py-3 rounded-xl hover:bg-[#5ABCF5] border-[3px] border-[#5ABCF5] duration-75 transition"
          onClick={handleCheckInspection}
        >
          นับสินค้า
        </button>

        <Link href="all_issue">
          <button
            type="submit"
            className="w-60 mt-2 shadow-md bg-white text-[#5ABCF5] hover:text-white font-semibold py-3 rounded-xl hover:bg-[#5ABCF5] border-[3px] border-[#5ABCF5] duration-75 transition"
          >
            แจ้งปัญหา
          </button>
        </Link>
      </div>
    </div>
  );
}

export default MenuPage;
