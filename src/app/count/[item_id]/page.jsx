"use client";

import { use, useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import { useRouter } from "next/navigation";
import { getItemDetail, countProduct } from "../../service/api.service";
import Swal from "sweetalert2";

const CountItemPage = ({ params, searchParams }) => {
  const router = useRouter();
  const [productDetail, setProductDetail] = useState([]);
  const [itemQty, setItemQty] = useState(0);
  const { item_id } = params; 
  const shelf = searchParams?.shelf; 
  const barcode = searchParams?.barcode; 
  
  useEffect(() => {
    fetchProductDetail();
  }, [params, item_id]);

  const fetchProductDetail = async () => {
    if (typeof window !== "undefined") {
      const site_id = localStorage.getItem("site_id");
      const isBarcode = barcode || ""  ; // Example condition for barcode
      const body = {
        item_id: isBarcode ? "" : item_id,
        site_id: site_id,
        item_barcode: isBarcode ? item_id : "",
      };

      try {
        const res = await getItemDetail(body);
        if (res.res_code === "E101") {
          Swal.fire({
            icon: "error",
            title: "ไม่พบข้อมูล",
            text: res.res_msg,
          });
          router.push("/amount");
        }
        if (res && res.data) {
          setProductDetail(res.data);
        }
      } catch (error) {
        console.error("Error fetching item details:", error);
      }
    }
  };
  

  const countItemProduct = async () => {
    const body = {
      item_id: productDetail.item_id,
      site_id: localStorage.getItem("site_id"),
      firstname: localStorage.getItem("firstname"),
      lastname: localStorage.getItem("lastname"),
      item_qty: Number(itemQty),
      item_position: shelf,
    };

    try {
      const res = await countProduct(body);
      if (res && res.res_code === "000") {
        Swal.fire({
          icon: "success",
          title: "สำเร็จ",
          text: "สินค้าได้ถูกนับแล้ว",
        });
        router.push("/amount");
      } else {
        Swal.fire({
          icon: "error",
          title: "ไม่สำเร็จ",
          text: "เกิดข้อผิดพลาดในการนับสินค้า กรุณาลองอีกครั้ง",
        });
      }
    } catch (error) {
      console.error("Error submitting countProduct", error);
      Swal.fire({
        icon: "error",
        title: "Error 500",
        text: "เกิดข้อผิดพลาด",
      });
    }
  };

  return (
    <div>
      <Navbar page = "/amount" title = "นับสินค้า"/>
      <div className="flex justify-center items-center mt-4 text-red-500">
        {productDetail.is_counted ? 'สินค้านี้มีการนับไปแล้ว' : ''}
      </div>
      <div className="flex flex-col justify-center items-center mt-8 p-4 bg-white border rounded-md shadow-md max-w-md mx-auto">
        
          <div className="flex items-center space-x-4">
            {productDetail && productDetail.item_image ? (
              <img
                src={productDetail.item_image}
                alt={productDetail.item_name}
                className="w-40 h-40 object-cover "
              />
            ) : (
              <p>Image not available</p>
            )}
            <h1 className="border border-gray-200 rounded text-center px-4 py-2">
              {productDetail && productDetail.item_name
                ? productDetail.item_name
                : "Product Name"}
            </h1>
          </div>
        
        <input
          type="text"
          inputMode="numeric"
          
          className="flex w-60 border border-gray-500 p-3 my-2 rounded-xl mb-4 text-center"
          value={itemQty}
          // onChange={(e) => setItemQty(e.target.value)}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= 4 && /^\d*$/.test(value)) {
              setItemQty(value);
            }
          }}
          maxLength={4}
          placeholder="กรุณาใส่จำนวน"
        />

        <div>
          <button
            type="submit"
            className="w-60  bg-white text-[#5ABCF5] hover:text-white font-semibold py-3 rounded-xl hover:bg-[#5ABCF5] border-2 border-[#5ABCF5] duration-75 transition"
            onClick={countItemProduct}
          >
            ยืนยัน
          </button>
        </div>
      </div>
    </div>
  );
};

export default CountItemPage;
