"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../components/navbar";
import Navigation from "../components/navigation";
import { getProblemBySite } from "../service/issue.service";
import { statusColors} from "../utils/common";
import { getStatus } from "../service/api.service";
import { Card } from "antd";
import { FloatButton } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { formatDateInThai } from "../utils/date";

function AllIssuePage() {
const router = useRouter();
const [allProb, setAllProb] = useState([]);

useEffect(() => {
  const fetchProblemBySite = async () => {
    try {
      const site_id = localStorage.getItem("site_id");
      const res = await getProblemBySite(site_id);
      setAllProb(res.data);
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  fetchProblemBySite();
}, []);

useEffect(() => {
  const pollingStatus = async () => {
    try {
      const site_id = localStorage.getItem("site_id");
      const res = await getStatus(null,null,site_id);
      if (res && res.res_code === "000") {
        setAllProb((prevIssues) => {
          if (!Array.isArray(prevIssues)) return []; 
          return prevIssues.map((allProb) => {
            const updatedItem = res.data.find((item) => item._id === allProb.id);
            return updatedItem ? { ...allProb, prob_status: updatedItem.prob_status } : allProb;
          });
        });
      } else {
        message.error(res.res_msg);
      }
    } catch (error) {
      console.error("Polling Error:", error);
    }
  };

  pollingStatus(); 
  const interval = setInterval(() => {
    pollingStatus();
  }, 5000); 

  return () => clearInterval(interval); 
}, []);

useEffect(() => {
}, [allProb]);

const onRowClick = (issue_id) => {
  router.push(`/issue_detail/${issue_id}`);
}
  return (
    <div className="flex flex-col h-screen">
    <Navbar page="/menu" title="แจ้งปัญหา" />
  
    <div className="flex justify-center mt-4">
        <Card
          style={{ width: "90%", maxWidth: "400px", overflow: "hidden" }}
          className="shadow-lg border"
        >
          <div className="max-h-[420px] overflow-y-auto p-2">
            {Array.isArray(allProb) &&
              allProb.map((prob) => (
                <div
                  key={prob.id}
                  className="mb-4 cursor-pointer"
                  onClick={() => onRowClick(prob.id)}
                >
                  <Card
                    hoverable
                    title={`ชื่อปัญหา : ${prob.prob_name}`}
                    style={{ border: "1px solid #ccc" }}
                    headStyle={{
                      borderBottom: "1px solid #ccc", // ทำให้เส้นแบ่งชัดขึ้น
                    }}
                  >
                    <p>อุปกรณ์ : {prob.prob_item_name}</p>
                    <b>
                      สถานะ :
                      <span
                        className={`font-bold ${
                          statusColors[prob.prob_status] || "text-gray-500"
                        } pl-1`}
                      >
                        {prob.prob_status}
                      </span>
                    </b>
                    <p>วันและเวลาที่แจ้ง : {formatDateInThai(prob.create_date)}</p>
                  </Card>
                </div>
              ))}
          </div>
        </Card>
      </div>
  
    <div className="">
        <Link href="/add_issue">
          <FloatButton
            tooltip={<div>แจ้งปัญหา</div>}
            icon={<PlusCircleOutlined />}
            type="primary"
            style={{
              insetInlineEnd: 25,
              bottom: 80,
              width: "50px", // ปรับขนาดปุ่มใหญ่ขึ้น
              height: "50px",
            }}
          />
          ;
        </Link>
      </div>
  
    <Navigation
      navi1="แจ้งปัญหา"
      navi2="ประวัติการแจ้งปัญหา"
      page1="/all_issue"
      page2="/issue_history"
      color1="bg-[#06A1FB] rounded-tr-2xl rounded-tl-2xl rounded-br-2xl"
    />
  </div>
  
  );
}

export default AllIssuePage;
