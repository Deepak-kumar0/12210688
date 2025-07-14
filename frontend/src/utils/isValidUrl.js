import log from "../../../loggingMiddleware";

 export default function isValidUrl (url) {
  try {
    new URL(url);
    return true;
  } catch {
    log({stack: "frontend",level:"error",pack: "pages", message: "Invalid url"});
    return false;
  }
};