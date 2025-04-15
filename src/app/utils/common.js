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
