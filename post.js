import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
import { generateContent } from './generateContent.js';

dotenv.config();

const { quote, imagePath } = await generateContent();

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

const page = await browser.newPage();
await page.goto('https://x.com/login');

await page.waitForSelector('input[name="text"]');
await page.type('input[name="text"]', process.env.X_USERNAME);
await page.keyboard.press('Enter');

await page.waitForTimeout(1000);
await page.type('input[name="password"]', process.env.X_PASSWORD);
await page.keyboard.press('Enter');

await page.waitForNavigation();
await page.waitForSelector('div[aria-label="Tweet text"]');
await page.click('div[aria-label="Tweet text"]');
await page.keyboard.type(quote);

const [fileChooser] = await Promise.all([
  page.waitForFileChooser(),
  page.click('div[aria-label="Add photos or video"]')
]);

await fileChooser.accept([imagePath]);
await page.waitForTimeout(2000);

await page.click('div[data-testid="tweetButton"]');
await page.waitForTimeout(3000);
await browser.close();
