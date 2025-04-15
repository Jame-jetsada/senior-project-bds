import axios from 'axios';
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

export async function getProbType() {
  try {
    const result = await axios.get("/project-v0/problem/get-prob-type");
    return result.data;
  } catch (error) {
    return error;
  }
}

export async function getTechnicalItems(item) {
  try {
    const result = await axios.get(`/project-v0/problem/get-technical-items/${item}`);
    return result.data;
  } catch (error) {
    return error;
  }
}
export async function createProblem(data) {
  try {
    const result = await axios.post("/project-v0/problem/create-problem", data);
    return result.data;
  } catch (error) {
    return error;
  }
}
export async function getProblemBySite(site) {
  try {
    const result = await axios.get(`/project-v0/problem/get-problem-By-site-id/${site}`);
    return result.data;
  } catch (error) {
    return error;
  }
}

export async function getProblemById(id) {
  try {
    const result = await axios.get(`/project-v0/problem/get-problem-by-id/${id}`);
    return result.data;
  } catch (error) {
    return error;
  }
}

export async function getProblemHistoryBySiteId(site_id) {
  try {
    const result = await axios.get(`/project-v0/problem/get-problem-history/${site_id}`);
    return result.data;
  } catch (error) {
    return error;
  }
}

export async function updateStatusClose(body) {
  try {
    const result = await axios.post(`/project-v0/problem/update-status-close`,body);
    return result.data;
  } catch (error) {
    return error;
  }
}

export async function cancelProblem(id:string) {
  try {
    const result = await axios.delete(`/project-v0/problem/cancel-problem/${id}`);
    return result.data;
  } catch (error) {
    return error;
  }
}