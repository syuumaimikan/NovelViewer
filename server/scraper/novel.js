const axios = require("axios");

const USER_AGENT = "Mozilla/5.0 NovelViewer";

async function getNovelInfo(ncode) {
  const params = new URLSearchParams({
    out: "json",
    ncode,
    of: "t-w-s-gp-nt-ga-n-k-g"
  });

  const res = await axios.get(
    `https://api.syosetu.com/novelapi/api/?${params.toString()}`,
    {
      headers: { "User-Agent": USER_AGENT }
    }
  );

  return res.data[1] ?? null;
}

async function getNovelInfoMany(ncodes) {
  if (!ncodes || ncodes.length === 0) return [];

  const params = new URLSearchParams({
    out: "json",
    ncode: ncodes.join("-"),
    of: "t-w-s-gp-nt-ga-n-k-g"
  });

  const res = await axios.get(
    `https://api.syosetu.com/novelapi/api/?${params.toString()}`,
    {
      headers: { "User-Agent": USER_AGENT }
    }
  );

  return res.data.slice(1);
}

async function searchNovels(query) {
  const params = new URLSearchParams({
    out: "json",
    lim: query.lim || "100",
    order: query.order || "hyoka",
    of: "t-w-s-gp-nt-ga-n-k-g"
  });

  if (query.word) params.append("word", query.word);
  if (query.genre) params.append("genre", query.genre);
  if (query.type) params.append("type", query.type);
  if (query.minlen) params.append("minlen", query.minlen);
  if (query.maxlen) params.append("maxlen", query.maxlen);
  if (query.isend) params.append("isend", query.isend);

  const res = await axios.get(
    `https://api.syosetu.com/novelapi/api/?${params.toString()}`,
    {
      headers: { "User-Agent": USER_AGENT }
    }
  );

  return res.data.slice(1);
}

module.exports = {
  getNovelInfo,
  getNovelInfoMany,
  searchNovels
};