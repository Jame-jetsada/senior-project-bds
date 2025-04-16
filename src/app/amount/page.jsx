"use client";

import React, { use, useState, useEffect } from "react";
import Navbar from "../components/navbar";
import Navigation from "../components/navigation";
import { useRouter } from "next/navigation";
import { getShelfProducts, getItemByShelf } from "../service/api.service";
import QrBarcodeScanner from "react-qr-barcode-scanner";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import Swal from "sweetalert2";

function InputPage() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState("");
  const [shelfProducts, setShelfProducts] = useState([]);
  const [productCode, setProductCode] = useState("");
  const [product, setProduct] = useState([]);
  const [isScanning, setIsScanning] = useState(false);

  const handleChange = async (event) => {
    const selectedShelf = event.target.value;
    setSelectedOption(selectedShelf);
    localStorage.setItem("shelf", selectedShelf);
    try {
      const res = await getItemByShelf(selectedShelf);
      if (res && res.data) {
        setProduct(res.data);
      }
    } catch (error) {
      console.error("Error fetching item by shelf:", error);
    }
  };

  useEffect(() => {
    const storedShelf = localStorage.getItem("shelf");
    if (storedShelf) {
      setSelectedOption(storedShelf);
      handleChange({ target: { value: storedShelf } });
    }
  }, []);

  const handleInputChange = (event) => {
    const value = event.target.value;
    if (/^\d{0,13}$/.test(value)) {
      setProductCode(value);
    }
  };

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

  const handleRowClick = (item) => {
    router.push(`/count/${item.item_id}?shelf=${selectedOption}`);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (productCode || selectedOption) {
      const item_id = productCode;
      router.push(
        `/count/${item_id}?shelf=${selectedOption}&barcode=${productCode}`
      );
    } else {
      Swal.fire({
        icon: "warning",
        title: "แจ้งเตือน",
        text: "กรุณาเลือกชั้นวางและใส่รหัสสินค้า",
      })
    }
  };

  const handleScan = (scannedText) => {
    if (!isScanning) return; // ป้องกัน Scanner ปิดแล้วทำงานต่อ

    if (scannedText && scannedText !== productCode) {
      setProductCode(scannedText);
      setIsScanning(false); // ปิด Scanner หลังสแกนเสร็จ
    }
  };

  const handleError = (err) => {
    console.error("Scan Error:", err);
  };

  return (
    <div>
      <Navbar page="/menu" title="นับสินค้า" />
      <div className="flex flex-col items-center justify-center">
        <div className="w-[350px] mt-4 bg-white border shadow p-4 rounded-md">
          <form action="">
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
                      maxHeight: 300,
                      overflow: "auto",
                    },
                  },
                }}
              >
                <MenuItem value="">เลือกชั้นวาง</MenuItem>
                {shelfProducts?.length > 0 ? (
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

            <div className="relative">
              <input
                className="w-full p-2 border border-gray-300 my-3 rounded-xl text-lg focus:border-blue-500"
                type="text"
                inputMode="numeric"
                placeholder="กรุณาใส่รหัสสินค้า"
                value={productCode}
                id="productCode"
                onChange={handleInputChange}
                maxLength={13} // จำกัดความยาวสูงสุด
              />
              <i className="bi bi-upc-scan absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-2xl cursor-pointer"
              onClick={() => setIsScanning(true)}></i>
            </div>

            <button
              type="submit"
              className="w-full bg-white text-[#5ABCF5] hover:text-white font-semibold py-3 rounded-xl hover:bg-[#5ABCF5] border-2 border-[#5ABCF5] duration-75 transition"
              onClick={onSubmit}
            >
              ยืนยัน
            </button>

            <div className="relative">
              <div className="overflow-y-auto max-h-60 rounded-lg mt-3">
                <table className="w-full border-collapse text-center">
                  <thead className="bg-gray-200 sticky top-0">
                    <tr>
                      <th className="p-2">#</th>
                      <th className="p-2">รหัส</th>
                      <th className="p-2">ชื่อสินค้า</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.length > 0 ? (
                      product.map((item, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-100"
                          onClick={() => handleRowClick(item)}
                        >
                          <td className="p-2 border-b border-gray-300">
                            {index + 1}
                          </td>
                          <td className="p-2 border-b border-gray-300">
                            {item.item_id}
                          </td>
                          <td className="p-2 border-b border-gray-300">
                            {item.item_desc1}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
                          className="p-2 border-b border-gray-300"
                        >
                          ไม่มีข้อมูลสินค้า
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </form>

          {isScanning && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="relative bg-white p-4 rounded-lg shadow-lg">
                <p className="text-center mb-3 font-semibold">
                  สแกนบาร์โค้ด
                </p>

                <QrBarcodeScanner
                  onUpdate={(err, result) => {
                    if (result) {
                      handleScan(result.text); // ใช้ข้อมูลที่สแกน
                    } else if (err) {
                      handleError(err);
                    }
                  }}
                  style={{
                    width: "100%",
                  }}
                />

                {/* ปุ่มปิด Scanner */}
                <button
                  className="w-full bg-red-500 text-white mt-2 py-2 rounded-lg hover:bg-red-600 transition"
                  onClick={() => setIsScanning(false)}
                >
                  ปิด
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Navigation
        navi1="นับสินค้า"
        navi2="ประวัติการนับ"
        page1="/amount"
        page2="/count_history"
        color1="bg-[#06A1FB] rounded-tr-2xl rounded-tl-2xl rounded-br-2xl"
      />
    </div>
  );
}

export default InputPage;
