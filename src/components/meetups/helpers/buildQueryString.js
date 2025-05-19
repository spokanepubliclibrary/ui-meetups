/* 
  -build query string from object
  @param {Object} queryObject - object containing query params
  @returns {string} query string
*/
const buildQueryString = (queryObject) => {
  const queryParams = [];
  for (const key in queryObject) {
    if (
      queryObject.hasOwnProperty(key) &&
      queryObject[key] !== undefined &&
      queryObject[key] !== null
    ) {
      queryParams.push(
        `${encodeURIComponent(key)}=${encodeURIComponent(queryObject[key])}`
      );
    }
  }
  return queryParams.join('&');
};

export default buildQueryString;
