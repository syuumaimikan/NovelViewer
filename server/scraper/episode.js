const axios = require("axios");
const cheerio = require("cheerio");

function normalizeText(text) {
  return text
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function getEpisode(ncode, episodeNo) {
  const key = ncode.toLowerCase();

  const res = await axios.get(
    `https://ncode.syosetu.com/${key}/${episodeNo}/`,
    {
      headers: {
        "User-Agent": "Mozilla/5.0 NovelViewer"
      }
    }
  );

  const $ = cheerio.load(res.data);

  const title =
    $(".p-novel__title").first().text().trim() ||
    $(".novel_subtitle").first().text().trim() ||
    `第${episodeNo}話`;

  const body =
    $(".js-novel-text").first().text() ||
    $(".p-novel__body").first().text() ||
    $("#novel_honbun").first().text();

  return {
    id: `${key}-${episodeNo}`,
    ncode: key,
    episodeNo: Number(episodeNo),
    title,
    body: normalizeText(body || ""),
    downloadedAt: ""
  };
}

module.exports = {
  getEpisode
};