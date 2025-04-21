"use client";

import React, { useEffect, useState } from "react";
import Menubar from "../admin_components/menubar";
import Navbar from "../admin_components/navbar";
import Link from "next/link";
import Image from "next/image";
import { exportCSV } from "../../utils/common";
import { getSiteAll ,getInspectionRoundAll,exportInspectionRound,getDashboardCountProduct} from "../../service/api.service";
import { Select ,Table,message} from "antd";

function Dashboard() {
  const [siteData, setSiteData] = useState([]);
  const [roundInspection, setRoundInspection] = useState([]);
  const [selectedSite, setSelectedSite] = useState("");
  const [selectedRound, setSelectedRound] = useState();
  const [dashboardData, setDashboardData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [displayText, setDisplayText] = useState("");

  const filterData = [
    {value: "", label: "ทั้งหมด"},
    {value: "ขาด", label: "ขาด"},
    {value: "ครบ", label: "ครบ"},
    {value: "เกิน", label: "เกิน"},
  ]
  const columns = [
    {
      title: "รหัสสินค้า",
      dataIndex: "item_id",
      key: "item_id",
    },
    {
      title: "ชื่อสินค้า",
      dataIndex: "item_desc1",
      key: "item_desc1",
    },
    {
      title: "จำนวนที่นับได้",
      dataIndex: "item_qty",
      key: "item_qty",
    },
    {
      title: "จำนวนในระบบ",
      dataIndex: "onhand_balance_qty",
      key: "onhand_balance_qty",
    },
    {
      title: "ส่วนต่าง",
      dataIndex: "difference_count",
      key: "difference_count",
    },
    {
      title: "ชื่อผู้ตรวจ",
      render: (text, record) => `${record.firstname} ${record.lastname}`,
      key: "inspector_name",
    },
    {
      title: "วันที่อัปเดต",
      dataIndex: "update_date",
      key: "update_date",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "ประเภทแผน",
      dataIndex: "site_Plan_Type",
      key: "site_Plan_Type",
    },
    {
      title: "สาขา",
      dataIndex: "site_desc",
      key: "site_desc",
    },
  ];
  useEffect(() => {
    const getSiteData = async () => {
      try {
        const response = await getSiteAll()
        console.log("Site data:", response);
        setSiteData(response);
      } catch (error) {
        console.error("Error fetching site data:", error);
      }
    }

    getSiteData();
  }, []);

  useEffect(() => {
    const getInspectionRound = async () => {
      try {
        const response = await getInspectionRoundAll();
        setRoundInspection(response);
      } catch (error) {
        console.error("Error fetching site data:", error);
      }
    };

    getInspectionRound();
  }, [])

  useEffect(() => {
    const getDashBoard = async () => {
      try {
        const body = {
            inspection_code: selectedRound,
            site_id: selectedSite?.toString() || "",
            filters: filter ? filter : "",
        };
        const response = await getDashboardCountProduct(body);
        setDashboardData(response.data);
        setDisplayText(response.text);

      } catch (error) {
        console.error("Error fetching site data:", error);
      }
    };

    getDashBoard();

  }, [selectedSite, selectedRound ,filter]);
  
  const onStatusChange = (value) => {
    setSelectedSite(value);
  }
  const onRoundChange = (value) => {
    setSelectedRound(value);
  }
  const onFilterChange = (value) => {
    setFilter(value);
  }
  const handleDownload = async () => {
    if (!selectedSite || !selectedRound) {
      const msg = [
        !selectedSite ? "สาขา" : null,
        !selectedRound ? "รอบ" : null,
      ]
        .filter(Boolean)
        .join(" และ ");
    
      message.error(`กรุณาเลือก${msg}`);
      return;
    }
    
    try {
      const response = await exportInspectionRound(selectedRound, selectedSite);
  
      const text = await response.data.text();
      const parsed = text.split("\n").map((row) => row.split(","));
  
      exportCSV(parsed, response, "export.csv");
    } catch (err) {
      console.error("Download failed:", err);
    }
  };
  
  
  
  return (
    <div className="h-screen flex">
      <div className="w-[14%] p-4">
        <Link href="" className="flex items-center justify-center gap-2">
          <div className="bg-[#50B0E9] p-4 rounded-md">
            <Image src="/images/homelogo.png" alt="logo" width={150} height={20} />
          </div>
        </Link>
        <Menubar />
      </div>
      <div className="w-[86%] bg-[#F7F8FA]">
        <Navbar title="" />
        <div className="p-4 m-2 bg-white shadow rounded-lg">
          <span className="text-[#50B0E9]">export สินค้าที่นับ</span>
        </div>
        <div className="p-6 m-2 bg-white shadow rounded-lg flex items-end gap-4">
          <div className="flex flex-col w-1/4">
            <span className="text-[#50B0E9] mb-1">เลือกสาขา</span>
            <Select
              className="w-full h-[42px]"
              onChange={(value) => onStatusChange(value)}
              placeholder="เลือกสาขา"
              loading={siteData.length === 0}
              value={selectedSite}
              allowClear
              status={!selectedSite ? "error" : ""}
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {siteData.map((site) => (
                <Select.Option key={site.Site_ID} value={site.Site_ID}>
                  {site.Site_Desc}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col w-1/4">
            <span className="text-[#50B0E9] mb-1">เลือกรอบ</span>
            <Select
              className="w-full h-[42px]"
              onChange={(value) => onRoundChange(value)}
              placeholder="เลือกรอบ"
              status={!selectedRound ? "error" : ""}
              showSearch
              allowClear
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {roundInspection &&
                roundInspection.map((round) => (
                  <Select.Option
                    key={round.inspection_code}
                    value={round.inspection_code}
                  >
                    {round.inspection_name}
                  </Select.Option>
                ))}
            </Select>
          </div>
          <div className="flex flex-col w-1/4">
            <span className="text-[#50B0E9] mb-1">เลือกกรอง</span>
            <Select
              className="w-full h-[42px]"
              onChange={(value) => onFilterChange(value)}
              placeholder="เลือกกรอง"
              showSearch
              allowClear
            >
              {filterData &&
                filterData.map((e) => (
                  <Select.Option key={e.value} value={e.value}>
                    {e.label}
                  </Select.Option>
                ))}
            </Select>
          </div>
          <div className="ml-auto">
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-[#50B0E9] text-white rounded-lg shadow hover:bg-[#50B0E9]"
            >
              Export
            </button>
          </div>
        </div>
        {displayText && (
          <div className="p-4 m-2 bg-white shadow rounded-lg">
            <span className="text-[#50B0E9]">
              {`สาขา: ${displayText.site_name}`}
              <br />
              {`รอบ: ${displayText.round}`}
              <br />
              {`จำนวนที่นับได้: ${displayText.totalCountCounted}`}
              <br />
              {`ทั้งหมด: ${displayText.total_count}`}
            </span>
          </div>
        )}
        <Table
          bordered
          rowKey={(record) => record._id}
          columns={columns}
          dataSource={dashboardData}
          pagination={false}
        />
      </div>
    </div>
  );
}

export default Dashboard;
