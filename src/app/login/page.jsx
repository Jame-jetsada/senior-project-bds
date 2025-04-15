"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AuthService from "../service/auth.service";
import Image from "next/image";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    try {
        const res = await AuthService.login(trimmedUsername, trimmedPassword);
        if (res?.res_code === "000") {
            if (res?.datas?.emp_position?.toLowerCase() === "แอดมิน") {
                router.push("/admin/all_report"); 
            } else {
                router.push("/menu"); 
            }
        } else if (res?.res_code === "E101") {
            setError("Invalid username or password. Please try again.");
        }
    } catch (error) {
        console.error("Login Error:", error);
        setError("Invalid username or password");
    }
};

//   return (
//     <div className="h-screen flex ">
//       <div className="w-[40%] bg-[#5ABCF5] flex items-center justify-center ">
//         <div className="p-4 rounded-lg shadow-lg">
//           <Image
//             src="/images/loginlogo.png"
//             alt="logo"
//             width={400}
//             height={10}
//           />
//         </div>
//       </div>

//       <div className="w-[60%] bg-[#F7F8FA] flex items-center justify-center">
//         <div className="p-4 m-2 bg-white shadow-xl h-[40%] w-[30%] flex flex-col items-center">
//           <span className="text-3xl font-semibold text-[#50B0E9]">
//             กรุณาเข้าสู่ระบบ
//           </span>

//           <form className="flex flex-col w-full px-6" onSubmit={handleSubmit}>
//             {/* Username Input */}
//             <div className="relative w-full mt-4">
//               <input
//                 className="peer w-full bg-transparent text-lg outline-none border-b-2 border-gray-300 focus:border-[#50B0E9] focus:ring-0 transition duration-300 p-2 pt-7 pb-1"
//                 type="text"
//                 placeholder=" "
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//               />
//               <label className="absolute left-0  text-gray-400 text-lg transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-lg peer-focus:top-0 peer-focus:text-[#50B0E9] peer-focus:text-sm">
//                 ชื่อผู้ใช้
//               </label>
//             </div>

//             {/* Password Input */}
//             <div className="relative w-full mt-8">
//               <input
//                 className="peer w-full bg-transparent text-lg outline-none border-b-2 border-gray-300 focus:border-[#50B0E9] focus:ring-0 transition duration-300 p-2 pt-7 pb-1"
//                 type="password"
//                 placeholder=" "
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//               <label className="absolute left-0 top-2 text-gray-400 text-lg transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-lg peer-focus:top-2 peer-focus:text-[#50B0E9] peer-focus:text-sm">
//                 รหัสผ่าน
//               </label>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               className="w-full bg-[#5ABCF5] text-white py-3 mt-8 rounded-md hover:bg-[#5a90f5] shadow-lg hover:shadow-xl transition-all duration-500"
//             >
//               ลงชื่อเข้าใช้
//             </button>

//             {/* Error Message */}
//             {error && <p className="text-red-500 text-center mt-3">{error}</p>}
//           </form>

//         </div>
//       </div>
//     </div>
//   );
// }

return (
  <div className="min-h-screen flex flex-col md:flex-row">
    {/* Left Section - Logo */}
    <div className="md:w-[40%] bg-[#5ABCF5] flex items-center justify-center py-10 ">
      <div className="p-4 rounded-lg shadow-lg">
        <Image src="/images/loginlogo.png" alt="logo" width={300} height={80} />
      </div>
    </div>

    {/* Right Section - Login Form */}
    <div className="md:w-[60%] bg-white flex items-center justify-center p-6">
      <div className="bg-white border shadow-xl rounded-lg p-6 w-[400px]">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#50B0E9] text-center mb-6">
          กรุณาเข้าสู่ระบบ
        </h2>

        <form className="flex flex-col w-full" onSubmit={handleSubmit}>
          {/* Username Input */}
          <div className="relative w-full mb-6">
            <input
              className="peer w-full bg-transparent text-lg outline-none border-b-2 border-gray-300 focus:border-[#50B0E9] transition duration-300 p-2 pt-7"
              type="text"
              placeholder=" "
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label className="absolute left-0 top-2 text-gray-400 text-lg transition-all duration-300 peer-placeholder-shown:top-6 peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-[#50B0E9] peer-focus:text-sm">
              ชื่อผู้ใช้
            </label>
          </div>

          {/* Password Input */}
          <div className="relative w-full mb-6">
            <input
              className="peer w-full bg-transparent text-lg outline-none border-b-2 border-gray-300 focus:border-[#50B0E9] transition duration-300 p-2 pt-7"
              type="password"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label className="absolute left-0 top-2 text-gray-400 text-lg transition-all duration-300 peer-placeholder-shown:top-6 peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-[#50B0E9] peer-focus:text-sm">
              รหัสผ่าน
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#5ABCF5] text-white py-3 rounded-md hover:bg-[#5a90f5] shadow-lg transition-all duration-300"
          >
            ลงชื่อเข้าใช้
          </button>

          {/* Error Message */}
          {error && <p className="text-red-500 text-center mt-3">{error}</p>}
        </form>
      </div>
    </div>
  </div>
);
}

export default LoginPage;
