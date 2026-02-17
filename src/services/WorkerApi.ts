import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const workerAPI = {
  register: async (formData: FormData) => {
    // FIX: Do not manually set Content-Type — axios sets it automatically
    // with the correct multipart boundary when the body is a FormData object.
    // Setting it manually strips the boundary and breaks the upload.
    const response = await axios.post(`${API_BASE_URL}/workers/register`, formData);
    console.log('Worker registration response:', response.data);
    return response.data;
  },
};