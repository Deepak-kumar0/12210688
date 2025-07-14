
import log from "../../../loggingMiddleware";
import loadUrls from "./loadUrls";
import saveUrls from "./saveUrls";

function recordClickAndRedirect(shortcode) {
  let allUrls = loadUrls();
  let foundIndex = -1;

  for (let i = 0; i < allUrls.length; i++) {
    if (allUrls[i].shortcode === shortcode) {
      foundIndex = i;
      break;
    }
  }

  if (foundIndex === -1) {
    return null;
  }

  let foundUrl = allUrls[foundIndex];

  let nowTime = new Date();
  let expireTime = new Date(foundUrl.expiresAt);
  if (expireTime < nowTime) {
    return null;
  }

  foundUrl.clicks = foundUrl.clicks + 1;

  let clickInfo = {
    timestamp: new Date().toISOString(),
    source: document.referrer ? document.referrer : "Direct/Unknown",
    geoLocation: "Simulated Location (India)"
  };

  foundUrl.clickData.push(clickInfo);

  saveUrls(allUrls);
  log({stack: "frontend",level:"redirection",pack: "pages", message: "Redirect successfully"});
  return foundUrl.originalUrl;
}

export default recordClickAndRedirect;
