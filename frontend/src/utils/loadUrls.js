import { STORAGE_KEY } from "./constants";

export default function loadUrls() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

