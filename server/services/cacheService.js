const fs = require("fs/promises");
const path = require("path");
const { CACHE_TTL_MS } = require("../config/env");

const CACHE_DIR = path.join(__dirname, "..", "cache");

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

function getCachePath(type, key) {
  const safeKey = String(key).replace(/[^\w.-]/g, "_");
  return path.join(CACHE_DIR, type, `${safeKey}.json`);
}

async function getCache(type, key) {
  try {
    const filePath = getCachePath(type, key);
    const stat = await fs.stat(filePath);

    const expired = Date.now() - stat.mtimeMs > CACHE_TTL_MS;
    if (expired) return null;

    const text = await fs.readFile(filePath, "utf-8");
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function setCache(type, key, data) {
  const filePath = getCachePath(type, key);
  await ensureDir(path.dirname(filePath));

  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

module.exports = {
  getCache,
  setCache
};