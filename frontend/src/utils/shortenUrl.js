import { DEFAULT_VALIDITY_MINUTES } from "./constants";
import generateShortcode from "./generateShortCode";
import loadUrls from "./loadUrls";
import saveUrls from "./saveUrls";

export default function shortenUrl(originalUrl, validityMinutes, customShortcode) {
  const urls = loadUrls();

  let shortcode = customShortcode;
  let isCustom = false;
  
  if (shortcode) {
    if (urls.some(url => url.shortcode === shortcode)) {
      return { success: false, error: 'Shortcode already in use.' };
    }
    isCustom = true;
  } else {
    do {
      shortcode = generateShortcode();
    } while (urls.some(url => url.shortcode === shortcode));
  }

  const validity = validityMinutes && validityMinutes > 0 ? validityMinutes : DEFAULT_VALIDITY_MINUTES;
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + validity * 60000);

  const newUrl = {
    originalUrl,
    shortcode,
    isCustom,
    createdAt: createdAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
    clicks: 0,
    clickData: [] 
  };

  urls.push(newUrl);
  saveUrls(urls);
  

  return { success: true, data: newUrl };
};