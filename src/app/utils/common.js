import * as XLSX from 'xlsx';
import dayjs from "dayjs"; 

export function setLocalStorageItem(key, value) {
  if (typeof window === "undefined") return; 

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}
export function getLocalStorageItem(key) {
  if (typeof window === "undefined") return null; 

  try {
    const item = localStorage.getItem(key);
    
    if (item && (item.startsWith("{") || item.startsWith("["))) {
      return JSON.parse(item);
    }
    
    return item; 
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error);
    return null; 
  }
}


export function removeLocalStorageItem(key) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
}
export const statusColors = {
  "รอรับเรื่อง": "text-blue-500",
  "รับเรื่องแล้ว": "text-green-500",
  "ส่งช่างไปแล้ว": "text-yellow-500",
  "ซ่อมสำเร็จแล้วรอการยืนยัน": "text-orange-500",
  "ซ่อมสำเร็จ รอการยืนยัน": "text-orange-500",
  "ยืนยันการซ่อมสำเร็จ": "text-green-500",
  "ยกเลิก": "text-red-500",
  "ไม่มีสถานะ": "text-gray-400",
};



export function exportCSV(data, axiosResponse, fallbackFileName = 'default.csv') {
  if (!Array.isArray(data) || data.length === 0) {
    alert('ไม่มีข้อมูลสำหรับ export');
    return;
  }

  const ws = XLSX.utils.aoa_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(ws, {
    strip: true,
    quoteStrings: false, 
  });

  const bom = '\ufeff';
  const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });

  const contentDisposition = axiosResponse?.headers?.['content-disposition'] || '';
  const match = contentDisposition.match(/filename="?([^"]+)"?/);
  const rawFileName = match?.[1]?.replace('.csv', '') || fallbackFileName.replace('.csv', '');
  const today = dayjs().format("YYYY-MM-DD");

  const fileName = `${rawFileName}_${today}.csv`;

  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.href = url;
  link.download = fileName;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

