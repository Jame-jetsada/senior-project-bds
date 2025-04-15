"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Navigation from "../components/navigation";
import { getLocalStorageItem, statusColors } from "../utils/common";
import { getProblemHistoryBySiteId } from "../service/issue.service";
import { useRouter } from "next/navigation";
import { Card} from "antd";

function IssueHistoryPage() {
  const router = useRouter();
  const [probHistory, setProbHistory] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const site_id = getLocalStorageItem("site_id");
        if (!site_id) {
          console.warn("Site ID not found in localStorage");
          return;
        }

        const res = await getProblemHistoryBySiteId(site_id);
        setProbHistory(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const onRowClick = (issue_id) => {
    router.push(`/issue_detail/${issue_id}`);
  };

  return (
    <div>
      <Navbar page="/menu" title="ประวัติการแจ้งปัญหา" />

      <div className="flex justify-center mt-4">
        <Card
          style={{ width: "90%", maxWidth: "400px", overflow: "hidden" }}
          className="shadow-lg border"
        >
          <div className="max-h-[420px] overflow-y-auto p-2">
            {Array.isArray(probHistory) &&
              probHistory.map((prob) => (
                <div
                  key={prob._id}
                  className="mb-4 cursor-pointer"
                  onClick={() => onRowClick(prob._id)}
                >
                  <Card
                    hoverable
                    title={`เรื่อง : ${prob.prob_name || "-"}`}
                    style={{ border: "1px solid #ccc" }}
                    headStyle={{ 
                      borderBottom: "1px solid #ccc", // ทำให้เส้นแบ่งชัดขึ้น 
                    }}
                  >
                    <p>อุปกรณ์ : {prob.prob_item_name || "-"}</p>
                    <p>สถานะ : <span
                      className={`font-bold ${
                        statusColors[prob.prob_status] || "text-gray-500"
                      } pl-1`}
                    >
                      {prob.prob_status}
                    </span></p>
                    
                  </Card>
                </div>
              ))}
          </div>
        </Card>
      </div>

      <Navigation
        navi1="แจ้งปัญหา"
        navi2="ประวัติการแจ้งปัญหา"
        page1="/all_issue"
        page2="/issue_history"
        color2="bg-[#06A1FB] rounded-tr-2xl rounded-tl-2xl rounded-bl-2xl"
      />
    </div>
  );
}

export default IssueHistoryPage;
