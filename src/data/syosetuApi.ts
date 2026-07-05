import { Episode, NovelInfo, saveEpisode } from "./novelDb";
import {
  getNovelInfo,
  getEpisodeOnline,
  downloadNovelAllFromServer,
} from "../api/novelApi";

export async function fetchNovelInfo(ncode: string): Promise<NovelInfo> {
  const item = await getNovelInfo(ncode);

  return {
    ncode: item.ncode.toLowerCase(),
    title: item.title,
    writer: item.writer,
    story: item.story,
    keyword: item.keyword,
    genre: item.genre,
    general_all_no: item.general_all_no ?? 1,
    downloaded: false,
    lastReadEpisode: 1,
  };
}

export async function fetchEpisodeOnline(
  ncode: string,
  episodeNo: number
): Promise<Episode> {
  return await getEpisodeOnline(ncode, episodeNo);
}

export async function downloadEpisode(ncode: string, episodeNo: number) {
  const ep = await fetchEpisodeOnline(ncode, episodeNo);

  await saveEpisode({
    ...ep,
    downloadedAt: new Date().toISOString(),
  });

  return ep;
}

export async function downloadAllEpisodes(
  novel: NovelInfo,
  onProgress?: (current: number, total: number) => void
) {
  const data = await downloadNovelAllFromServer(novel.ncode);
  const episodes: Episode[] = data.episodes ?? [];

  for (let i = 0; i < episodes.length; i++) {
    await saveEpisode({
      ...episodes[i],
      downloadedAt: new Date().toISOString(),
    });

    onProgress?.(i + 1, episodes.length);
  }
}