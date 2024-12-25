const puppeteer = require('puppeteer');

async function scrapeLinkedIn() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://www.linkedin.com/in/some-profile/');

  const profileData = await page.evaluate(() => {
    const name = document.querySelector('.top-card-layout__title')?.innerText || 'No name';
    const title = document.querySelector('.top-card-layout__headline')?.innerText || 'No title';
    const location = document.querySelector('.top-card-layout__first-subline')?.innerText || 'No location';
    const summary = document.querySelector('.pv-about-section')?.innerText || 'No summary';

    return {
      name,
      title,
      location,
      summary
    };
  });

  console.log(profileData);

  await browser.close();
}

scrapeLinkedIn().catch(console.error);
