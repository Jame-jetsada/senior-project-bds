"use client";

import React, { useEffect ,useState} from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import Navbar from "../../components/navbar";
import { getProblemById, updateStatusClose ,cancelProblem} from "../../service/issue.service";
import { formatDateInThai } from "../../utils/date";
import { statusColors} from "../../utils/common";
import { useRouter } from "next/navigation";
import { Image } from "antd";

function IssueDetailPage( {params}) {
  const router = useRouter(); 
  const [problem, setProblem] = useState([]);
  const { issue_id } = params; 

  useEffect(() => {
    const fetchProblemById = async () => {
      try {
        const res = await getProblemById(issue_id);
        setProblem(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchProblemById();
  }, [params, issue_id]);


const handleConfirm = async () => {
  try {
    const result = await Swal.fire({
      icon: "question",
      title: "แจ้งเตือน",
      text: "กรุณากดปุ่มยืนยันเพื่อจบงาน",
      showCancelButton: true,
      confirmButtonText: "จบงาน",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    });

    if (result.isConfirmed) {
      const body = {
        id: issue_id,
        name: localStorage.getItem("firstname"),
      };
      const res = await updateStatusClose(body);

      if (res && res.res_code === "000") {
        Swal.fire({
          icon: "success",
          title: "สำเร็จ!",
          text: "งานถูกปิดเรียบร้อยแล้ว",
        });
        router.push("/issue_history");
      } else {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: res.res_msg || "ไม่สามารถปิดงานได้",
        });
      }
    }
  } catch (error) {
    console.error("Error:", error);
    Swal.fire({
      icon: "error",
      title: "เกิดข้อผิดพลาด",
      text: "กรุณาลองใหม่อีกครั้ง",
    });
  }
};


  const handleCancel = async () => {
    try {
      const result = await Swal.fire({
        icon: "question",
        title: "แจ้งเตือน",
        text: "กรุณากดปุ่มยืนยันเพื่อยกเลิก",
        confirmButtonText: "ยืนยัน",
        showCancelButton: true,
        cancelButtonText: "ยกเลิก",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      });


      if (result.isConfirmed) {
        const res = await cancelProblem(issue_id);

        if (res && res.res_code === "000") {
          Swal.fire({
            icon: "success",
            title: "สำเร็จ!",
            text: "งานถูกปิดเรียบร้อยแล้ว",
          });
          router.push("/all_issue");
        } else {
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: res.res_msg || "ไม่สามารถปิดงานได้",
          });
        }
      }

    } catch (error) {
      console.error("Error", error);
    }
  };

  return (
    <div>
      <Navbar page="/all_issue" title="รายละเอียดการแจ้งปัญหา" />

      <div className="mx-auto mt-4 p-5 bg-gray-300 rounded-md w-80">
        <div className="items-start space-y-2">
          <b>ชื่อปัญหา:</b>
          <p className="px-4"> {problem.prob_name}</p>

          <b>ประเภท:</b>
          <p className="px-4"> {problem.prob_type_name}</p>

          <b>อุปกรณ์:</b>
          <p className="px-4"> {problem.prob_item_name}</p>

          <b>รายละเอียด:</b>
          <p className="px-4"> {problem.prob_detail}</p>

          <b>รูปและวิดีโอ: </b>
           <div className="px-4 flex items-center space-x-4">
              {Array.isArray(problem.prob_image) && problem.prob_image.length > 0 ? (
                problem.prob_image.map((image, index) => (
                  <Image 
                    key={index}
                    src={image}
                    alt={`Uploaded image ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                ))
              ) : (
                <p className="text-gray-500">ไม่มีรูปภาพ</p> 
                )}
              </div>

              <b>วันและเวลาที่แจ้ง</b>
              <p className="px-4"> {formatDateInThai(problem.create_date)}</p>

              <b>สถานะ : </b>
              <p className={`font-bold ${statusColors[problem.prob_status] || "text-gray-500"}`}>
               {problem.prob_status}
              </p>
              </div>

            {/* <Link href=""> */}

        <button
          type="submit"
          onClick={handleConfirm}
          className={`w-full text-white mt-4 py-2 rounded-md transition ${
            problem?.prob_status === "ซ่อมสำเร็จ รอการยืนยัน"
              ? "bg-[#5ABCF5] hover:bg-[#5a90f5]"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled = {problem?.prob_status !== "ซ่อมสำเร็จ รอการยืนยัน"}
        >
          จบงาน
        </button>
        {/* </Link> */}
        <button
          type="submit"
          onClick={handleCancel}
          className={`w-full text-white mt-4 py-2 rounded-md transition ${
            problem?.prob_status === "รอรับเรื่อง"
              ? "bg-red-600 hover:bg-red-800"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={problem?.prob_status !== "รอรับเรื่อง"} 
        >
          ยกเลิกงาน
        </button>

      </div>
    </div>
  );
}

export default IssueDetailPage;
