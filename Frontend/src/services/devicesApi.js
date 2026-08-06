const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api'; 

export const setFanState = async (isOn) => {
  try {
    const response = await fetch(`${BACKEND_URL}/fan-control`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // Gói dữ liệu JSON giống hệt cách bạn test trên Postman
      body: JSON.stringify({ command: isOn ? 'ON' : 'OFF' }) 
    });
    
    if (!response.ok) throw new Error('Error setting fan state: ' + response.statusText);
    return await response.json();
  } catch (error) {
    console.error("Network Error:", error);
    throw error;
  }
};

export const setFanSpeedAPI = async (speed) => {
  try {
    const response = await fetch(`${BACKEND_URL}/fan-speed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ speed })
    });
    if (!response.ok) throw new Error('Error setting fan speed: ' + response.statusText);
    return await response.json();
  } catch (error) {
    console.error("Network Error:", error);
    throw error;
  }
};

export const setAutoFanAPI = async () => {
  try{
    const response = await fetch(`${BACKEND_URL}/auto-fan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ command: 'AUTO' })
    });
    if (!response.ok) throw new Error("Error setting auto fan mode in API call:" + response.statusText);
    return await response.json();
    
  }catch(err){
    console.error("Network Error:", err);
    throw err;
  }
}
