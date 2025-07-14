import loadUrls from "./loadUrls";
import saveUrls from "./saveUrls";

export default function recordClickAndRedirect  (shortcode) {
  const urls = loadUrls();
  const urlIndex = urls.findIndex(url => url.shortcode === shortcode);

  if (urlIndex === -1) {
    return null;
  }

  const urlData = urls[urlIndex];
  
  if (new Date(urlData.expiresAt) < new Date()) {
      
      return null;
  }

  urlData.clicks += 1;
  
  
  const clickDetails = {
    timestamp: new Date().toISOString(),
    source: document.referrer || 'Direct/Unknown', 
    geoLocation: 'Simulated Location (India)' 
  };
  
  urlData.clickData.push(clickDetails);

  saveUrls(urls);

  return urlData.originalUrl;
};