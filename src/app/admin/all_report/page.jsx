"use client";

import React, { useEffect } from "react";
import Menubar from "../admin_components/menubar";
import Navbar from "../admin_components/navbar";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import "react-datepicker/dist/react-datepicker.css";
import { getProblemReceived, getStatus, getStatusProblem } from "../../service/api.service";
import { Button ,Table ,DatePicker,Input,message ,Select} from 'antd';
import EditStatusModal from "../../components/EditStatusModal"; 
import EditIcon from "../../../assets/icons/EditIcon"
import { formatDateInThai } from "../../utils/date";
import dayjs from "dayjs";

function AllReport() {
  const [search, setSearch] = useState();
  const [startDate, setStartDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [page, setPage] = useState(1); 
  const [rowsPerPage, setRowsPerPage] = useState(10); 
  const [totalPages, setTotalPages] = useState(0); 
  const [issues, setIssues] = useState([]);
  const [bottom] = useState('bottomCenter');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null); 
  const [problemStatus, setProblemStatus] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchProblemReceived();
  }, [page, rowsPerPage , startDate, endDate , status]); 
  
  const fetchProblemReceived = async () => {
    const body = {
      search: search,
      status:  status || "",
      limit: rowsPerPage, 
      page: page, 
      start_date: startDate,
      end_date: endDate,
    };
    const res = await getProblemReceived(body);
  
    if (res && res.data) {
      setIssues(res.data);
      setTotalPages(res.page_information?.number_of_page || 1); 
    } else if (res.res_code === "E101") {
      setIssues([]);
      setTotalPages(1);
    } else {
      message.error(res.res_msg);

    }
  };

  const getAllStatus = async () => {
    const res = await getStatusProblem();
    if (res && res.status) {
      setProblemStatus(res.status);
    } else {
      message.error(res.res_msg);
    }
  }
  useEffect(() => {
    getAllStatus();
  }, []);

  const handleSearch = () => {
    fetchProblemReceived();
  };
  const handleEditClick = (record) => { 
    setModalOpen(true);
    setSelectedRecord(record); 
  }
  const handleStatusUpdate = () => {
    setModalOpen(false);
    fetchProblemReceived();
  };

  const onStatusChange = (value) => {
    setStatus(value);
    fetchProblemReceived();
  }

  const columns = [
    {
      title: "เลขแจ้งปัญหา",
      dataIndex: "prob_id",
      key: "prob_id",
      width: 100,
    },
    {
      title: "วันที่และเวลา",
      dataIndex: "create_date",
      key: "create_date",
      width: 100,
      render: (text) => formatDateInThai(text),
    },
    {
      title: "เรื่อง",
      dataIndex: "prob_name",
      key: "prob_name",
      width: 100,
    },
    {
      title: "ประเภทปัญหา",
      dataIndex: "prob_type_name",
      key: "prob_type_name",
      width: 100,
    },
    {
      title: "ผู้แจ้ง",
      dataIndex: "create_by",
      key: "create_by",
      width: 100,
    },
    {
      title: "สาขา",
      dataIndex: "site_desc",
      key: "site_desc",
      width: 100,
    },
    {
      title: "สถานะ",
      dataIndex: "prob_status",
      key: "prob_status",
      width: 100,
    },
    {
      title: "",
      dataIndex: "edit",
      key: "edit",
      width: 50,
      render: (text, record) => (
        <Button className="edit-btn-color" icon={<EditIcon />} onClick={() => handleEditClick(record._id)}
        />
      ),
    }
  ];


  return (
    <div className="h-screen flex ">
      <div className="w-[14%] p-4">
        <Link href="" className="flex items-center justify-center  gap-2">
          <div className="bg-[#50B0E9] p-4 rounded-md ">
            <Image
              src="/images/homelogo.png"
              alt="logo"
              width={150}
              height={20}
            />
          </div>
        </Link>

        <Menubar />
      </div>
      <div className="w-[86%] bg-[#F7F8FA] ">
        <Navbar title="" />
        <div className="p-4 m-2 bg-white shadow rounded-lg">
          <span className="text-[#50B0E9]">รายการการแจ้งปัญหา</span>
        </div>
        <div className="">
          <div className="p-6 m-2 bg-white shadow rounded-lg">
          <div className="flex gap-6 mb-4">
          <div className="flex flex-col relative w-1/5">
                <span className="text-[#50B0E9]">ค้นหา</span>
                <Input
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="flex flex-col relative w-1/6">
                <span className="text-[#50B0E9]">วันที่เริ่มต้น</span>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  locale={"th"}
                  defaultValue={dayjs(new Date())}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="flex flex-col relative w-1/6">
                <span className="text-[#50B0E9]">วันที่สิ้นสุด</span>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  dateFormat="dd/MM/yyyy"
                  locale={"th"}
                  defaultValue={dayjs(new Date())}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="flex flex-col relative w-1/6">
              <span className="text-[#50B0E9]">สถานะ</span>

              <Select className="w-full h-full" 
              onChange={(value) => onStatusChange(value)}
              >
              {problemStatus &&
                Object.entries(problemStatus).map(([value, label]) => (
                <Select.Option key={value} value={label}>
                  {label}
                  </Select.Option>
                  ))}
              </Select>
              </div>
              
            </div>

            <Table
            bordered
            rowKey={(record) => record._id}
            columns={columns}
            dataSource={issues}
            pagination={{
              position: ["bottomCenter"],
              current: page, 
              pageSize: rowsPerPage, 
              total: totalPages * rowsPerPage, 
              showSizeChanger: true,
            }}
            scroll={{ y: 1000 }}
            onChange={(pagination) => {
              setPage(pagination.current); 
              setRowsPerPage(pagination.pageSize); 
            }}
          />


            <EditStatusModal
              open={modalOpen}
              param={selectedRecord}
              onCancel={() => setModalOpen(false)}
              onOk={handleStatusUpdate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllReport;
