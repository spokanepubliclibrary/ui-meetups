
const convertUTCISOToPrettyDate = (isoString) => {
  const date = new Date(isoString);
  if (isNaN(date)) {
    return `Invalid ISO string`
  }

  const options = { year: 'numeric', month: '2-digit', day: '2-digit'};
  const localeDate = date.toLocaleDateString(undefined, options); 
  return localeDate;
};
export default convertUTCISOToPrettyDate;