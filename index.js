const axios = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const Papa = require('papaparse');
const fs = require('fs');

const getHTML = async () => {
  const baseUrl = 'https://www.imdb.com/list/ls000441429/?sort=moviemeter,asc&st_dt=&mode=detail&page=1&ref_=ttls_vm_dtl';
  const response = await axios.get(baseUrl);
  return response.data;
}

const convert = (htmlString) => {
  const dom = new JSDOM(htmlString);
  const { document } = dom.window;
  const els = document.querySelectorAll('.lister-item.mode-detail');
  const movies = [];
  for(let i = 0; i < 10; i++) {
    const cardEl = els[i];
    movies[i] = {
      name: cardEl.querySelector('.lister-item-header a').textContent,
      releaseDate: cardEl
        .querySelector('.lister-item-year')
        .textContent
        .replace('(', '')
        .replace(')', ''),
      rating: cardEl.querySelector('.ipl-rating-star__rating').textContent,
      genre: cardEl.querySelector('.genre').textContent.replace('\n', '').trim(),
      // description: cardEl
      //   .querySelector('.lister-item-content p:nth-of-type(2)')
      //   .textContent
      //   .replace('\n', '')
      //   .trim(),
      // runtime: cardEl.querySelector('.runtime').textContent,
      // image: cardEl.querySelector('.loadlate').getAttribute('loadlate')
    }
  }
  return movies;
}

const createExcel = (movieData) => {
  const csv = Papa.unparse(movieData);
  fs.writeFileSync('movies.csv', csv);
}

const main = async () => {
  const html = await getHTML();
  const convertedStuff = convert(html);
  createExcel(convertedStuff);
  console.log('Scraping Done')
}

main();