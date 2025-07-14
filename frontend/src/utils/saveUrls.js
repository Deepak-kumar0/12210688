import { STORAGE_KEY } from "./constants";

export default function saveUrls(urls) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(urls));
};