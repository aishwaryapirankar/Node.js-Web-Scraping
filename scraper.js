const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const writeStream = fs.createWriteStream('movielist.csv');

// Headings
writeStream.write(`Name&ReleaseYear, Genre, Rating \n`);


request('https://www.imdb.com/list/ls000441429/?sort=moviemeter,asc&st_dt=&mode=detail&page=1&ref_=ttls_vm_dtl', (error, response, html) => {
  if (!error) {
    const $ = cheerio.load(html);

    $('.lister').each((i, el) => {
      let title = $(el)
        .find('.lister-item-header')
        .text() + ','

      let genre = $(el)
        .find('.genre')
        .text() + '\n'
      
      let rating = $(el)
        .find('.metascore')
        .text();
      
      // For CSV
      writeStream.write(`${title}, ${genre}, ${rating} \n`);

    });
    
    console.log('Scraping is done');
  }
});