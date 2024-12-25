const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const { fetchPage } = require('./utils');
const { linkedInProfileURLs, maxRetries } = require('./config');
const fs = require('fs');

const scrapeProfile = async (url) => {
  try {
    const pageContent = await fetchPage(url);
    const $ = cheerio.load(pageContent);
    
    const profileData = {
      name: $('h1.text-heading-xlarge').text().trim(),
      jobTitle: $('h2.text-body-medium').text().trim(),
      location: $('span.text-body-small').text().trim(),
      summary: $('section.pv-about-section').text().trim(),
    };

    return profileData;
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    return null;
  }
};

const scrapeCompany = async (url) => {
  try {
    const pageContent = await fetchPage(url);
    const $ = cheerio.load(pageContent);

    const companyData = {
      companyName: $('h1.text-heading-xlarge').text().trim(),
      industry: $('div.text-body-medium').text().trim(),
      headquarters: $('div.inline-show-more-text').text().trim(),
      about: $('section.org-grid__core-activity').text().trim(),
    };

    return companyData;
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    return null;
  }
};

const crawl = async () => {
  const profiles = [];
  const companies = [];

  for (let url of linkedInProfileURLs) {
    if (url.includes('/in/')) {
      const profile = await scrapeProfile(url);
      if (profile) profiles.push(profile);
    } else if (url.includes('/company/')) {
      const company = await scrapeCompany(url);
      if (company) companies.push(company);
    }
  }

  // Save scraped data
  fs.writeFileSync('./data/profiles.json', JSON.stringify({ profiles, companies }, null, 2));
  console.log('Data scraped and saved.');
};

crawl();
