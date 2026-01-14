const API_BASE_URL = import.meta.env.VITE_API_URL;

const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};



const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export const studentApi = {
  login: (email, password) => {
    return fetch(`${API_BASE_URL}/auth/studentLogin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }).then(handleResponse);
  },

  getProfile: () => {
    return fetch(`${API_BASE_URL}/students/profile`, {
      headers: getAuthHeaders(),
    }).then(handleResponse);
  },

  applyGatepass: (data) => {
    return fetch(`${API_BASE_URL}/gatepass/applyGatePass`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse);
  },

  getGatepasses: () => {
    return fetch(`${API_BASE_URL}/gatepass/myGatePass`, {
      headers: getAuthHeaders(),
    }).then(handleResponse);
  },
};

export const rectorApi = {
  login: (email, password) => {
    return fetch(`${API_BASE_URL}/auth/rectorLogin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }).then(handleResponse);
  },

  addStudent: (studentData) => {
    console.log("API URL HIT:", `${API_BASE_URL}/student/addStudent`);
    return fetch(`${API_BASE_URL}/student/addStudent`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(studentData),
    }).then(handleResponse);
  },

  getStudents: () => {
    return fetch(`${API_BASE_URL}/student/viewStudent`, {
      headers: getAuthHeaders(),
    }).then(handleResponse);
  },

  getGatepassRequests: () => {
    return fetch(`${API_BASE_URL}/gatepass/gatepassRequest`, {
      headers: getAuthHeaders(),
    }).then(handleResponse);
  },

  updateGatepassStatus: (gatepassId, statusGatePass) => {
    return fetch(`${API_BASE_URL}/gatepass/updateGatepassStatus/${gatepassId}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ statusGatePass }),
    }).then(handleResponse);
  },
};
