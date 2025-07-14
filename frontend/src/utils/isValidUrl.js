 export default function isValidUrl (url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};