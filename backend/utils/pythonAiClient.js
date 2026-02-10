import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const PY_AI_URL = process.env.PY_AI_URL || 'http://127.0.0.1:8002/verify';

export const verifyWithPythonAI = async ({ validIdPath, selfiePath }) => {
  if (!validIdPath || !selfiePath) {
    throw new Error('validIdPath and selfiePath are required');
  }

  const form = new FormData();
  form.append('valid_id', fs.createReadStream(validIdPath));
  form.append('selfie', fs.createReadStream(selfiePath));

  const headers = form.getHeaders();

  const resp = await axios.post(PY_AI_URL, form, { headers, timeout: 10000 });
  const data = resp.data || {};
  return {
    aiStatus: data.aiStatus || 'failed',
    aiIssues: data.aiIssues || []
  };
};

export default verifyWithPythonAI;
