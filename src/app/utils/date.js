import dayjs from 'dayjs';
import 'dayjs/locale/th'; // Load Thai locale
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat); 

dayjs.locale('th'); // Set locale to Thai



/**
 * Format a date range in Thai
 * @param {string} round - The string containing the date range
 * @returns {string} - The formatted date range in Thai
 */
export function formatRoundInThai(round) {
  if (!round || typeof round !== 'string') {
    return 'Invalid Date'; 
  }

  if (round.includes(' - ')) {
    const [startDate, endDate] = round.split(' - ');
    const parsedStartDate = dayjs(startDate, 'DD/MM/YYYY');
    const parsedEndDate = dayjs(endDate, 'DD/MM/YYYY'); 

    if (!parsedStartDate.isValid()) {
      console.error('Invalid start date:', startDate);
    }
    if (!parsedEndDate.isValid()) {
      console.error('Invalid end date:', endDate);
    }

    const formattedStartDate = parsedStartDate.isValid()
      ? parsedStartDate.format('DD MMMM YYYY')
      : 'Invalid Date';
    const formattedEndDate = parsedEndDate.isValid()
      ? parsedEndDate.format('DD MMMM YYYY')
      : 'Invalid Date';

    return `รอบ ${formattedStartDate} - ${formattedEndDate}`;
  } else {
    console.error('Invalid round format');
    return 'Invalid Date'; 
  }
}
export const formatDateInThai = (dateString) => {
  if (!dateString) return "ไม่ระบุวันที่"; // Handle empty values

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "ไม่ระบุวันที่"; // Handle invalid dates

    const thaiMonthsShort = [
      "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
      "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
    ];

    const day = date.getDate();
    const month = thaiMonthsShort[date.getMonth()];
    const year = date.getFullYear() + 543 - 2500; // Convert to 2-digit Buddhist year
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day} ${month} ${year} ${hours}:${minutes}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "ไม่สามารถแปลงวันที่ได้";
  }
};


