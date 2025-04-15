"use client";

import React, { useEffect, useState } from "react";
import Menubar from "../admin_components/menubar";
import Navbar from "../admin_components/navbar";
import Link from "next/link";
import Image from "next/image";
import { DatePicker } from 'antd';
import dayjs from "dayjs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { getDashboard } from "../../service/api.service";

function Dashboard() {
  const [startDate, setStartDate] = useState(dayjs().format("YYYY-MM"));
  const [dataIT, setDataIT] = useState([]);
  const [dataTechnical, setDataTechnical] = useState([]);
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getDashboard(startDate);
        if (res?.data) {
          setDataIT(
            res.data.prob_item_it.map((item) => ({
              name: item.prob_item_name,
              count: item.count,
            }))
          );
          setDataTechnical(
            res.data.prob_item_technique.map((item) => ({
              name: item.prob_item_name,
              count: item.count,
            }))
          );
          setSummary(res.data.prob_type_summary);
        }
      } catch (err) {
        console.error("Error fetching dashboard:", err);
      }
    };

    fetchDashboard();
  }, [startDate]);

  const findSummaryCount = (typeName) => summary.find(item => item.prob_type_name === typeName)?.count ?? 0;

  const renderChartSection = (title, data) => (
    <>
      <div className="text-[#50B0E9] pt-4">{title} จำนวน {findSummaryCount(title)}</div>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <BarChart margin={{ top: 20, right: 30, left: 20, bottom: 30 }} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={150}
              interval={0}
              tickMargin={10}
              
            />
            <YAxis label={{ value: 'จำนวน', angle: 0, position: 'insideLeft',  dx: -20, }} className="mr-4" />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#F37021" name="count" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );

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
          <span className="text-[#50B0E9]">Dashboard</span>
        </div>
        <div className="">
          <div className="p-6 m-2 bg-white shadow rounded-lg">
            <div className="flex flex-col relative w-1/6">
              <span className="text-[#50B0E9]">เดือน</span>
              <DatePicker
                value={dayjs(startDate, "YYYY-MM")}
                onChange={(date) => {
                  if (date) setStartDate(dayjs(date).format("YYYY-MM"));
                }}
                picker="month"
                format="MM/YYYY"
                allowClear={false}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
              />
            </div>
            {renderChartSection("IT Support", dataIT)}
            {renderChartSection("ซ่อมบำรุง", dataTechnical)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
