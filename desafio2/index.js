const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('response', async response => {
    const url = response.url();
    if (response.request().resourceType() === 'image') {
      response.buffer().then(file => {
        const fileName = url.split('/').pop();
        const filePath = path.resolve('../tmp/', fileName);
        const extName = path.extname(fileName);
        if (extName == '.jpg' && fileName.length < 255) {
          const writeStream = fs.createWriteStream(filePath);
          writeStream.write(file);
        }
      });
    }
  });
  await page.goto('https://httpstatusdogs.com/');
  const imgList = await page.evaluate(() => {
    const nodeList = document.querySelectorAll('main img');
    const imgArray = [...nodeList];
    const imgList = imgArray.map(image => ({
      src: image.src.split('/').pop(),
    }));
    return imgList;
  });
  fs.writeFile(
    path.join(__dirname, 'dogs.json'),
    JSON.stringify(imgList, null, 2),
    err => {
      if (err) throw new Error('something went wrong');
      console.log('well done!');
    }
  );

  await browser.close();
})();
