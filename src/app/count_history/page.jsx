"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import Navigation from "../components/navigation";
import {
  getTotalCountAndCounted,
  getShelfProducts,
  getCountProduct,
} from "../service/api.service";
import { formatRoundInThai } from "../utils/date";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useRouter } from "next/navigation";

function CountHistoryPage() {
  const router = useRouter(); 
  const [selectedOption, setSelectedOption] = useState("");
  const [totalCount, setTotalCount] = useState({});
  const [shelfProducts, setShelfProducts] = useState([]);
  const [countProduct, setCountProduct] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState("");
  const formattedRound = formatRoundInThai(totalCount.round);
  const handleChange = (e) => {
    setSelectedOption(e.target.value);
  };

  useEffect(() => {
    const fetchTotalCountAndCounted = async () => {
      const res = await getTotalCountAndCounted();
      if (res && res.data) {
        setTotalCount(res.data);
      }
    };
    fetchTotalCountAndCounted();
  }, []);
  useEffect(() => {
    const fetchShelfProducts = async () => {
      try {
        const res = await getShelfProducts();
        setShelfProducts(res.data);
      } catch (error) {
        console.error("Error fetching shelf products", error);
      }
    };

    fetchShelfProducts();
  }, []);

  useEffect(() => {
    const getCountProductHistory = async () => {
      const filters_item_position = selectedOption;

      const res = await getCountProduct(filters_item_position);
      setCountProduct(res.data);
    };
    getCountProductHistory();
  }, [selectedOption]);

  const handleEdit = (item) => {
    router.push(`/count/${item.item_id}`);
  };
  
  return (
    <div>
      <Navbar page="/menu" title="ประวัติการนับ" />
      <div className="flex flex-col justify-center items-center mt-4 space-y-2">
        
        <p className="text-lg">
          จำนวนสินค้าที่นับไปแล้ว : {totalCount.totalCountCounted}
        </p>

        <p className="text-lg">{formattedRound}</p>

        <div className="w-[300px] mt-4 bg-white border shadow p-3 rounded-md">
          <FormControl fullWidth variant="outlined">
            <InputLabel>เลือกชั้นวาง</InputLabel>
            <Select
              value={selectedOption}
              onChange={handleChange}
              label="เลือกชั้นวาง"
              sx={{ width: "100%" }}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300, // จำกัดความสูงของ dropdown
                    overflowY: "auto", // ให้เลื่อนด้วย scroll mouse
                  },
                },
              }}
            >
              <MenuItem value="">ทั้งหมด</MenuItem>
              {shelfProducts.length > 0 ? (
                shelfProducts.map((shelfProduct, index) => (
                  
                  <MenuItem key={index} value={shelfProduct}>
                    ชั้นวาง {shelfProduct}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>ไม่มีข้อมูลชั้นวาง</MenuItem>
              )}
            </Select>
          </FormControl>

        <div className="overflow-y-auto max-h-80 mt-6 space-y-4">
          {countProduct.length > 0 ? (
            countProduct.map((item, index) => (
              <div
                key={index}
                className="py-4 px-6 bg-gray-100 rounded-md shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <h1 className="text-sm mb-2 text-gray-600">
                    ชื่อ : {item.item_desc1 || "-"}
                  </h1>
                  <button
                    className="text-black hover:text-blue-400"
                    onClick={() => handleEdit(item)} 
                  >
                    <i className="bi bi-pencil-square text-lg"></i>
                  </button>
                </div>
                <h1 className="text-sm mb-2 text-gray-600">
                  วันและเวลา : {item.update_date || "-"}
                </h1>
                <h1 className="text-sm mb-2 text-gray-600">
                  สินค้าที่นับได้ : {item.item_qty || "-"}
                </h1>
                <h1 className="text-sm mb-2 text-gray-600">
                  สินค้าในระบบ : {item.onhand_balance_qty || "-"}
                </h1>
                <h1 className="text-sm mb-2 text-gray-600">
                  ขาด/เกิน : {item.difference_count || "-"}
                </h1>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center">No data available</p>
          )}
        </div>

        </div>
      </div>

      <Navigation
        navi1="นับสินค้า"
        navi2="ประวัติการนับ"
        page1="/amount"
        page2="/count_history"
        color2="bg-[#06A1FB] rounded-tr-2xl rounded-tl-2xl rounded-bl-2xl"
      />
    </div>
  );
}

export default CountHistoryPage;
