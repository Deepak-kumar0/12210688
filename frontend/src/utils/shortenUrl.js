

import { DEFAULT_VALIDITY_MINUTES } from "./constants";
import generateShortcode from "./generateShortCode";
import loadUrls from "./loadUrls";
import saveUrls from "./saveUrls";

function shortenUrl(originalUrl, validityMinutes, customShortcode) {
  let allUrls = loadUrls();
  let newShortcode;
  let custom = false;

  if (customShortcode) {
    let found = false;
    for (let i = 0; i < allUrls.length; i++) {
      if (allUrls[i].shortcode === customShortcode) {
        found = true;
        break;
      }
    }
    if (found) {
      return { success: false, error: "Shortcode already in use." };
    }
    newShortcode = customShortcode;
    custom = true;
  } else {
    let exists = true;
    while (exists) {
      newShortcode = generateShortcode();
      exists = false;
      for (let i = 0; i < allUrls.length; i++) {
        if (allUrls[i].shortcode === newShortcode) {
          exists = true;
          break;
        }
      }
    }
  }

  let validMinutes = DEFAULT_VALIDITY_MINUTES;
  if (validityMinutes && validityMinutes > 0) {
    validMinutes = validityMinutes;
  }

  let now = new Date();
  let expireDate = new Date(now.getTime() + validMinutes * 60 * 1000);

  let urlObj = {
    originalUrl: originalUrl,
    shortcode: newShortcode,
    isCustom: custom,
    createdAt: now.toISOString(),
    expiresAt: expireDate.toISOString(),
    clicks: 0,
    clickData: []
  };

  allUrls.push(urlObj);
  saveUrls(allUrls);

  return { success: true, data: urlObj };
}

export default shortenUrl;
