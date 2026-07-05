const { getCache, setCache } = require("./cacheService");
const { getRanking } = require("../scraper/ranking");
const {
  getNovelInfo,
  searchNovels
} = require("../scraper/novel");
const { getEpisode } = require("../scraper/episode");

async function getRankingCached(type) {
  const cache = await getCache("ranking", type);
  if (cache) return cache;

  const data = await getRanking(type);
  await setCache("ranking", type, data);

  return data;
}

async function searchNovelsCached(query) {
  const key = JSON.stringify(query);

  const cache = await getCache("search", key);
  if (cache) return cache;

  const data = await searchNovels(query);
  await setCache("search", key, data);

  return data;
}

async function getNovelInfoCached(ncode) {
  const key = ncode.toLowerCase();

  const cache = await getCache("novel", key);
  if (cache) return cache;

  const data = await getNovelInfo(key);
  await setCache("novel", key, data);

  return data;
}

async function getEpisodeCached(ncode, episodeNo) {
  const key = `${ncode.toLowerCase()}-${episodeNo}`;

  const cache = await getCache("episode", key);
  if (cache) return cache;

  const data = await getEpisode(ncode, episodeNo);
  await setCache("episode", key, data);

  return data;
}

async function downloadNovelAll(ncode) {
  const novel = await getNovelInfoCached(ncode);

  if (!novel) {
    throw new Error("Novel not found");
  }

  const total = novel.general_all_no || 1;
  const episodes = [];

  for (let i = 1; i <= total; i++) {
    const episode = await getEpisodeCached(ncode, i);
    episodes.push(episode);
  }

  return {
    novel,
    episodes
  };
}

module.exports = {
  getRankingCached,
  searchNovelsCached,
  getNovelInfoCached,
  getEpisodeCached,
  downloadNovelAll
};