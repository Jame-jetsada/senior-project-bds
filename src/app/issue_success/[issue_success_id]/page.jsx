import React from 'react'
import Navbar from "../../components/navbar";

function IssueSuccessPage() {
  return (
    <div>
      <Navbar page="/issue_history" title="แจ้งปัญหา"/>
      <div className="mt-8 text-center">
        <h2 className="font-bold text-xl">รายละเอียดการแจ้งปัญหา</h2>
      </div>

      <div className="mx-auto mt-8 py-3 p-3 bg-gray-300 rounded-md w-64">
        <div className="items-start space-y-2">
          <p>เรื่อง: <p>เครื่องสแกนเสีย</p></p>
          <p>ประเภท: <p>ด้าน IT</p></p>
          <p>อุปกร์: <p>เครื่องสแกน</p></p>
          <p>รายละเอียด: <p>ไม่สามารถใช้งานเครื่องสแกนสินค้าได้</p></p>
          <p>รูปและวิดีโอ: </p>
          <p>วันและเวลาที่แจ้ง: <p>20 ธ.ค. 67 12:30</p></p>
          <p>สถานะ: <span className="text-green-500 font-bold">สำเร็จ</span></p>
        </div>
      </div>
    </div>
  )
}

export default IssueSuccessPage
