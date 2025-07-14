
 export default function isValidValidityPeriod (period) {
  if (period === null || period === undefined || period === '') {
    return true; 
  }
  const minutes = parseInt(period, 10);
  return !isNaN(minutes) && minutes > 0;
};