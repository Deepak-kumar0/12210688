
 export default function  isValidShortcode  (shortcode) {
  if (shortcode === null || shortcode === undefined || shortcode === '') {
    return true; 
  }
  return /^[a-zA-Z0-9]+$/.test(shortcode) && shortcode.length >= 4 && shortcode.length <= 15;
};