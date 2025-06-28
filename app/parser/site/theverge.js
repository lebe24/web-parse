const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async function parseTheVerge(url){
    const articles = [];
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate',
      'Connection': 'keep-alive',
    };

    try {
        const response = await axios.get(url, { headers });
        const $ = cheerio.load(response.data);

        

        $('#content > div._1ymtmqp0 > div > div.duet--layout--river-container._1ibrbus0 > div > div.duet--layout--river.hp1qhq2.hp1qhq1 > div.hp1qhq3 > div > div.duet--content-cards--content-card._1ufh7nr1._1ufh7nr0._1lkmsmo3').each((i, element) => {
            const $li = $(element);
            const title = $li.find('a').text().trim()
            const link = $li.find('a').attr('href');
            const image = $li.find("img").attr('src');

            articles.push({
                title : title,
                link : link,
                image : image
            })

            console.log(articles);

        });

        return articles;

    }catch  {
        console.log('Error fetching the webpage');
    }
}

// parseTheVerge("https://www.theverge.com/tech")
