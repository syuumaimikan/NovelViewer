import { openDB } from "idb";

export type NovelInfo = {
  ncode: string;
  title: string;
  writer: string;
  story?: string;
  general_all_no: number;
  downloaded: boolean;
  downloadedAt?: string;
  lastReadEpisode?: number;
};

export type Episode = {
  id: string;
  ncode: string;
  episodeNo: number;
  title: string;
  body: string;
};

const dbPromise = openDB("NovelReaderDB", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("novels")) {
      db.createObjectStore("novels", { keyPath: "ncode" });
    }

    if (!db.objectStoreNames.contains("episodes")) {
      const store = db.createObjectStore("episodes", { keyPath: "id" });
      store.createIndex("ncode", "ncode");
    }
  },
});

export async function addNovelToLibrary(novel: NovelInfo) {
  const db = await dbPromise;
  const key = novel.ncode.toLowerCase();
  const exists = await db.get("novels", key);

  if (exists) return;

  await db.put("novels", {
    ...novel,
    ncode: key,
    downloaded: false,
    lastReadEpisode: 1,
  });
}

export async function saveNovel(novel: NovelInfo) {
  const db = await dbPromise;
  await db.put("novels", {
    ...novel,
    ncode: novel.ncode.toLowerCase(),
  });
}

export async function getNovels(): Promise<NovelInfo[]> {
  const db = await dbPromise;
  return await db.getAll("novels");
}

export async function getNovel(ncode: string) {
  const db = await dbPromise;
  return await db.get("novels", ncode.toLowerCase());
}

export async function saveEpisode(ep: Episode) {
  const db = await dbPromise;
  await db.put("episodes", ep);
}

export async function getEpisodes(ncode: string): Promise<Episode[]> {
  const db = await dbPromise;
  const eps = await db.getAllFromIndex(
    "episodes",
    "ncode",
    ncode.toLowerCase(),
  );
  return eps.sort((a, b) => a.episodeNo - b.episodeNo);
}

export async function updateLastRead(ncode: string, episodeNo: number) {
  const novel = await getNovel(ncode);
  if (!novel) return;

  await saveNovel({
    ...novel,
    lastReadEpisode: episodeNo,
  });
}

export async function markDownloaded(ncode: string) {
  const novel = await getNovel(ncode);
  if (!novel) return;

  await saveNovel({
    ...novel,
    downloaded: true,
    downloadedAt: new Date().toISOString(),
  });
}
