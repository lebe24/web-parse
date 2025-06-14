const axios = require('axios');
const cheerio = require('cheerio');


module.exports = async function parseTechCrunchList(url) {

  const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate',
      'Connection': 'keep-alive',
    };

    try{
       const response = await axios.get(url, { headers });
       const $ = cheerio.load(response.data);

       const articles = [];

       // Parse article elements - TechCrunch uses specific selectors
    $('div.wp-block-columns.is-layout-flex.wp-container-core-columns-is-layout-3.wp-block-columns-is-layout-flex > div:nth-child(1) > div > ul').each((i, element) => {

      const $article = $(element);
      $article.children('li').each((index, element) => {

        const $li = $(element);
        const title = $li.find('h3').text().trim();
        const link = $li.find('h3 > a').attr('href');
        const date = $li.find('time').text().trim();

        articles.push({
          title : title,
          link : link,
          date : date
        })

      })

    })

    return articles

    }catch{
      console.error('Error scraping TechCrunch:', error.message);
      return {
        error: error.message,
        url: 'https://techcrunch.com/',
        scrapedAt: new Date().toISOString(),
        totalArticles: 0,
        articles: []
      };
    }
}
