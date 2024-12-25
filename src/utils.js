const axios = require('axios');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchPage = async (url, retries = 3) => {
  try {
    const response = await axios.get(url, { headers: require('./config').headers });
    return response.data;
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying ${url}...`);
      await delay(2000);
      return fetchPage(url, retries - 1);
    }
    console.log(`Failed to fetch ${url}`);
    throw error;
  }
};

module.exports = { delay, fetchPage };
