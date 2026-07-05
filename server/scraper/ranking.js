const axios = require("axios");
const cheerio = require("cheerio");
const { getNovelInfoMany } = require("./novel");

const rankingUrls = {
  daily: "https://yomou.syosetu.com/rank/list/type/daily_total/",
  weekly: "https://yomou.syosetu.com/rank/list/type/weekly_total/",
  monthly: "https://yomou.syosetu.com/rank/list/type/monthly_total/",
  quarter: "https://yomou.syosetu.com/rank/list/type/quarter_total/",
  total: "https://yomou.syosetu.com/rank/list/type/total_total/"
};

async function getRanking(type) {
  const url = rankingUrls[type];

  if (!url) {
    throw new Error("Invalid ranking type");
  }

  const res = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 NovelViewer"
    }
  });

  const $ = cheerio.load(res.data);
  const ncodes = [];

  $("a[href*='ncode.syosetu.com']").each((_, el) => {
    const href = $(el).attr("href") || "";
    const match = href.match(/ncode\.syosetu\.com\/(n[0-9a-z]+)/i);

    if (match) {
      const ncode = match[1].toLowerCase();

      if (!ncodes.includes(ncode)) {
        ncodes.push(ncode);
      }
    }
  });

  return await getNovelInfoMany(ncodes.slice(0, 30));
}

module.exports = {
  getRanking
};