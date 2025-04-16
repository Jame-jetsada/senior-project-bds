"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import AuthService from "../service/auth.service";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false); // สร้าง state สำหรับเปิด/ปิด Sidebar

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // เปลี่ยนสถานะเมื่อกดที่ไอคอน
  };

  const router = useRouter();

  const logout = async () => {
    try {
      await AuthService.logout();
      router.push("/login");
    } catch (error) {
      setError("Invalid username or password");
    }
  };
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    siteName: "",
  });

  useEffect(() => {
    const storedFirstName = localStorage.getItem("firstname");
    const storedLastName = localStorage.getItem("lastname");
    const storedSiteName = localStorage.getItem("site_name");

    setUserData({
      firstName: storedFirstName || "",
      lastName: storedLastName || "",
      siteName: storedSiteName || "",
    });
  }, []);

  return (
    <div>
      <span
        className="absolute text-white text-4xl top-2 left-2 cursor-pointer"
        onClick={toggleSidebar}
      >

        {/* list icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          fill="currentColor"
          className="bi bi-list px-2 rounded-md"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
          />
        </svg>
      </span>

      <div
        className={`fixed z-50 flex flex-col top-0 bottom-0 lg:left-0 left-0 p-2 w-[300px] overflow-y-auto bg-white rounded-tr-2xl rounded-br-2xl shadow-xl transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300`}
      >
        <div className="text-gray-100 text-xl">
          <div className="p-2.5 mt-1 flex items-center">

        <img src="/images/loginlogo.png" alt="" className=" w-auto h-16 "/>

            {/* exit icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              stroke="currentColor"
              className="bi bi-x-lg ml-auto cursor-pointer text-gray-700 z-50"
              viewBox="0 0 16 16"
              onClick={toggleSidebar}
            >
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
            </svg>
          </div>
          <hr className="my-2 border-2 shadow border-gray-400" />
        </div>

        {/* profile icon */}
        <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              fill="currentColor"
              className="bi bi-person-circle rounded-md mt-3 ml-3 text-gray-500 "
              viewBox="0 0 16 16"
            >
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
              <path
                fillRule="evenodd"
                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
              />
            </svg>

        <span className="text-gray-400 font-light p-4">
          Profile
        </span>

        <div className="ml-4 mt-1 text-start text-gray-500">
          <p>
            ชื่อ : {userData.firstName} {userData.lastName}
          </p>
          <p>สาขา : {userData.siteName}</p>
        </div>

        <span className="text-gray-400 font-light p-4 mt-4">
          Other
        </span>

        <div onClick={logout}>
          <div className="p-2.5 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-slate-200 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              fill="currentColor"
              className="bi bi-box-arrow-right text-black"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"
              />
              <path
                fillRule="evenodd"
                d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
              />
            </svg>
            <span className="text-[15px] ml-4 text-gray-500">ออกจากระบบ</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
