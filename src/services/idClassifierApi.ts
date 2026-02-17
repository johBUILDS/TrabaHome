const API_URL = 'http://localhost:5000'; // Update this to your Flask server URL

export interface ClassificationResult {
  prediction: 'Valid ID' | 'Non Valid ID';
  confidence: number;
}

export const classifyID = async (file: File): Promise<ClassificationResult> => {
  const formData = new FormData();
  formData.append('file', file);

console.log('🚀 Sending request to Flask API...');
  console.log('🌐 API URL:', `${API_URL}/classify`);
  console.log('📦 File being sent:', file.name);

  try {
    const response = await fetch(`${API_URL}/classify`, {
      method: 'POST',
      body: formData,
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response OK?', response.ok);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error classifying ID:', error);
    throw error;
  }
};

export const checkAPIStatus = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/`);
    const data = await response.json();
    return data.message === ' ID Classifier API is live!';
  } catch (error) {
    console.error('API is not reachable:', error);
    return false;
  }
};