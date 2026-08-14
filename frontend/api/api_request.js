import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function getUniversities() {
  const { data } = await axios.get(
    `${API_URL}/api/universities`,
  );
  return data;
}

export async function getCareerTypes() {
  const { data } = await axios.get(
    `${API_URL}/api/career_types`,
  );
  return data;
}

export async function getCareerGuidance(body) {
  const { data } = await axios.post(
    `${API_URL}/api/career-guidance`,
    body
  );
  return data;
}

export async function getSimulacion(body) {
  const { data } = await axios.post(
    `${API_URL}/api/simulaciones`,
    body 
  );
  return data;
}