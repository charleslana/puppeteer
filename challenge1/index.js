const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.imdb.com/chart/top/');
  const topList = await page.evaluate(() => {
    const titleList = document.querySelectorAll('table .titleColumn a');
    const posterList = document.querySelectorAll('table .posterColumn img');
    const ratingList = document.querySelectorAll('table .ratingColumn strong');
    const titleArray = [...titleList];
    const posterArray = [...posterList];
    const ratingArray = [...ratingList];
    const topList = titleArray.map((list, index) => ({
      position: index + 1,
      name: list.textContent,
      image: posterArray[index].src,
      rating: ratingArray[index].textContent,
    }));

    return topList;
  });
  fs.writeFile('imdb.json', JSON.stringify(topList, null, 2), err => {
    if (err) throw new Error('something went wrong');
    console.log('well done!');
  });

  await browser.close();
})();
