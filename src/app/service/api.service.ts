import axios from 'axios';
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;
let site_id: string | null = null;
if (typeof window !== 'undefined') {
  site_id = localStorage.getItem('site_id');
}
export async function checkInspectionRound() {
  try {
    const result = await axios.get("/project-v0/inspection-round/check-inspection-round");
    return result.data;
  } catch (error) {
    return error;
  }
}

export async function getShelfProducts(){
  try {
    const result = await axios.get(`/project-v0/product/get-shelf-product/${site_id}`);
    return result.data;
  } catch (error) {
    return error;
  }
}

export async function getItemByShelf (item_position:string){
  try {
    const result = await axios.get(`/project-v0/product/get-item-by-shelf`, {
      params: {
        site_id: site_id, 
        item_position: item_position
      }
    });   
    return result.data;
  } catch (error) {
    return error;
  }

}

export async function getItemDetail(body){
  try {
    const result = await axios.post(`/project-v0/product/get-item-detail`, body);
    return result.data;
  } catch (error) {
    return error;
  }
}

export async function countProduct(body){
  try {
    const result = await axios.post(`/project-v0/product/count-product`, body);
    return result.data;
  } catch (error) {
    return error;
  }
}

export async function getTotalCountAndCounted(){
  try {
    const result = await axios.get(`/project-v0/product/get-total-count-and-counted/${site_id}`);
    return result.data;
  } catch (error) {
    return error;
  }
}

export async function getCountProduct(filters_item_position){
  try {
    const result = await axios.get(`/project-v0/product/get-count-product`,{
      params: {
        site_id: site_id, 
        filters_item_position: filters_item_position
      }
    });
    return result.data;
  } catch (error) {
    return error;
  }
}

export async function getProblemReceived(body: { search: string; status: string; limit: number; page: number; }){
  try {
    const result = await axios.post(`/project-v0/problem/get-problem-all`,body);
    return result.data;
  } catch (error) {
    return error;
  }
}

export async function getStatusProblem(){
  try {
    const result = await axios.get(`/project-v0/problem/get-status-problem`);
    return result.data;
  } catch (error) {
    return error;
  }
}

export async function updateStatusProblem(body){
  try {
    const result = await axios.post(`/project-v0/problem/update-status-problem`, body);
    return result.data;
  } catch (error) {
    return error;
  }
}

export async function uploadFile(files){
  try {
    const result = await axios.post(`/project-v0/upload/upload`, files);
    return result.data;
  } catch (error) {
    return error;
  }
}

export async function getStatus(limit: number, page: number, site_id: string) {
  try {
    const result = await axios.get(`/project-v0/problem/get-status`, {
      params: {
        limit: limit,
        page: page,
        site_id: site_id
      }
    });
    return result.data;
  } catch (error) {
    return error;
  }
}

export async function getDashboard(date: string) {
  try {
    const result = await axios.post(`/project-v0/problem/get-dashboard-problem`,{
      date: date,
    });
    return result.data;
  } catch (error) {
    return error;
  }
}

export async function getSiteAll(){
  try {
    const result = await axios.get(`/project-v0/inspection-round/get-site-all`);
    return result.data;
  } catch (error) {
    return error;
  }
}

export async function getInspectionRoundAll(){
  try {
    const result = await axios.get(`/project-v0/inspection-round/get-inspection-round-all`);
    return result.data;
  } catch (error) {
    return error;
  }
}

export async function exportInspectionRound(inspection_code: string, site_id: string) {
  try {
    const result = await axios.get(`/reports/reports-count-product`, {
      params: {
        site_id: site_id,
        inspection_code: inspection_code,
      },
      responseType: "blob",
    });
    return result; 
  } catch (error) {
    throw error; 
  }
}

export async function getDashboardCountProduct(body: any) {
  try {
    const result = await axios.post(`/project-v0/inspection-round/get-dashboard-count-product`,body);
    return result.data;
  } catch (error) {
    return error;
  }
} 
