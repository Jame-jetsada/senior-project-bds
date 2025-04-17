"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import PlusIcon from "../../assets/icons/PlusIcon";
import TrashIcon from "../../assets/icons/TrashIcon";
import { createProblem, getProbType, getTechnicalItems } from "../service/issue.service";
import { getLocalStorageItem } from "../utils/common";
import Swal from "sweetalert2";
import { message ,Spin} from "antd";
import { uploadFile } from "../service/api.service";

function AddIssuePage() {
  const [selectedType, setSelectedType] = useState(1);
  const [selectedEquipment, setSelectedEquipment] = useState(1);
  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [probType, setProbType] = useState([]);
  const [technicalItems, setTechnicalItems] = useState([]);
  const [title, setTitle] = useState(""); 
  const [image, setImage] = useState([]);
  const [probDetail, setProbDetail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const handleProbDetailChange = (e) => setProbDetail(e.target.value);
  const handleEquipmentChange = (e) => setSelectedEquipment(e.target.value);
  const handleInputChange = (e) => { setTitle(e.target.value);};

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length > 0) {
        const totalFiles = files.length + selectedFiles.length;
        if (totalFiles > 3) {
            message.error("คุณสามารถอัปโหลดไฟล์ได้สูงสุด 3 ไฟล์เท่านั้น");
            return;
        }

        setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);

        const newPreviews = selectedFiles.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
        setFilePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);

        await uploadFilesAsync(selectedFiles);
    }
};

const resizeImage = (file, maxSize = 1024) => {
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        const resizedFile = new File([blob], file.name, {
          type: file.type,
          lastModified: Date.now(),
        });
        resolve(resizedFile);
      }, file.type);
    };

    reader.readAsDataURL(file);
  });
};


const uploadFilesAsync = async (filesToUpload) => {
  setLoadingImage(true);
  try {
    const formData = new FormData();

    for (const file of filesToUpload) {
      const resizedFile = await resizeImage(file, 1024); 
      formData.append("files", resizedFile);
    }

    const res = await uploadFile(formData);

    if (Array.isArray(res.data)) {
      const newImageUrls = res.data.map((item) => item.url);
      setImage((prevImages) => [...prevImages, ...newImageUrls]);
    } else {
      console.error("Invalid response format:", res.data);
    }
  } catch (error) {
    console.error("Upload failed:", error);
  } finally {
    setLoadingImage(false);
  }
};

  useEffect(() => {
    return () => {
      filePreviews.forEach(({ url }) => URL.revokeObjectURL(url));
    };
  }, [filePreviews]);

  useEffect(() => {
    const fetchDataProbType = async () => {
      try {
        const res = await getProbType();
        setProbType(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataProbType(selectedEquipment)
    fetchTechnicalItem(selectedType);
  }, []);

  const fetchTechnicalItem = async (typeId) => {
    try {
      const res = await getTechnicalItems(typeId);
      if (res && res.data) {
        setTechnicalItems(res.data);
      }
    } catch (error) {
      console.error("Error fetching technical item:", error);
    }
  };

  const handleTypeChange = (e) => {
    const typeId = e.target.value;
    setSelectedType(typeId);
    fetchTechnicalItem(typeId);
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedPreviews = filePreviews.filter((_, i) => i !== index);

    setFiles(updatedFiles);
    setFilePreviews(updatedPreviews);
  };

  const onSubmit = async (event) => {
    event.preventDefault(); 
  
    if (!title.trim()) {
      message.error("กรุณากรอกเรื่อง");
      return;
    }
    if (!selectedType) {
      message.error("กรุณาเลือกประเภท");
      return;
    }
    if (!selectedEquipment) {
      message.error("กรุณาเลือกอุปกรณ์");
      return;
    }
    if (!probDetail.trim()) {
      message.error("กรุณากรอกรายละเอียด");
      return;
    }
    if (files.length === 0) {
      message.error("กรุณาแนบรูปภาพอย่างน้อย 1 ไฟล์");
      return;
    }
  
    const create_by = getLocalStorageItem("firstname") || "Unknown";
    const site_id = getLocalStorageItem("site_id") || "N/A";
    const site_name = getLocalStorageItem("site_name") || "N/A";
    try {
      setIsLoading(true); 
      const body = {
        prob_name: title.trim(),
        prob_type: selectedType,
        prob_item: selectedEquipment,
        prob_detail: probDetail.trim(),
        prob_image: image,
        create_by,
        site_id,
        site_desc: site_name,
      };
      const response = await createProblem(body)
      
      if (response?.res_code === '000') {
        message.success("แจ้งปัญหาสำเร็จ!");
        resetForm(); 
      } else {
        Swal.fire({ icon: "error", title: response.res_code, text: response.res_msg });
      }
    } catch (error) {
      console.error("Error submitting issue:", error);
      message.error("เกิดข้อผิดพลาด กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false); 
    }
  };
  const resetForm = () => {
    setTitle("");
    setSelectedType("1"); // Reset to default value
    setSelectedEquipment("");
    setProbDetail("");
    setFiles([]);
    setFilePreviews([]);
  };
  
  return (
    <div>
      <Navbar page="/all_issue" title="แจ้งปัญหา" />
      <div className="mx-auto mt-8 py-4 p-4 bg-white border shadow-md rounded-md text-center w-64">
        <form action="">
          {/* Select Fields */}
          <div className="flex items-center space-x-2">
            <p>เรื่อง:</p>
            <input 
            type="text" 
            value={title} 
            onChange={handleInputChange}
            className="rounded-md w-full h-10 border border-gray-300 " />
          </div>

          <div className="flex items-center space-x-2 mt-4">
            <p>ประเภท:</p>
            <select
              value={selectedType}
              onChange={handleTypeChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 "
            >
              {Array.isArray(probType) && probType.map((type) => (
                <option key={type.Technical_Item_Type_ID} value={type.Technical_Item_Type_ID}>
                  {type.Technical_Item_Type_Desc}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2 mt-4">
            <p className="mt-2">อุปกรณ์:</p>
            <select
              value={selectedEquipment}
              onChange={handleEquipmentChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 "
            >
              {Array.isArray(technicalItems) && technicalItems.map((item) => (
                <option key={item.Item_ID} value={item.Item_ID}>
                  {item.Item_Desc}
                </option>
              ))}
            </select>
          </div>

          <p className="mt-4">รายละเอียด:</p>
          <input type="text" 
          className="rounded-md w-full h-20 border border-gray-300" 
          value={probDetail}
          onChange={handleProbDetailChange}
          />

          <div className="mt-4">
            <label className="block mb-2">แนบรูป​ {files.length}/3</label>
            <div className="flex items-center">
              <input
                type="file"
                accept="image/*, video/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                multiple
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex items-center justify-center w-12 h-12 bg-gray-200 rounded-lg"
              >
                <PlusIcon className="w-6 h-6 text-gray-500" />
              </label>
            </div>
          </div>

          {filePreviews.length > 0 && (
            <div className="mt-4 space-y-2">
              {filePreviews.map(({ file, url }, index) => (
                <div key={index} className="flex items-center space-x-4 p-2 border rounded-lg relative">
                  {loadingImage && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md">
                      <Spin className="text-white" />
                    </div>
                  )}
                  
                  {file.type.startsWith("image/") ? (
                    <img
                      src={url}
                      alt={`Selected file ${index + 1}`}
                      className="w-16 h-16 rounded-md object-cover"
                    />
                  ) : (
                    <video className="w-16 h-16 rounded-md" controls>
                      <source src={url} type={file.type} />
                    </video>
                  )}
                  
                  <p className="flex-1 truncate">{file.name}</p>
                  
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="w-6 h-6" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#5ABCF5] text-white mt-4 py-2 rounded-md hover:bg-[#5a90f5]"
              onClick={onSubmit}
              disabled={isLoading} 
            >
               {isLoading ? "กำลังบันทึก..." : "ยืนยัน"} 
            </button>
        </form>
      </div>
    </div>
  );
}

export default AddIssuePage;
