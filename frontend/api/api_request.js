import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function getUniversities() {
  const { data } = await axios.put(
    `${API_URL}/api/universities`,
  );
  return data;
}

export async function getCareer_types() {
  const { data } = await axios.put(
    `${API_URL}/api/career_types`,
  );
  return data;
}