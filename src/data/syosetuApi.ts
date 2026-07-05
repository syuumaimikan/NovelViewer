import {
  Episode,
  NovelInfo,
  saveEpisode,
  markDownloaded,
} from "./novelDB";

const API_BASE = "/syosetu-api";

export async function fetchNovelInfo(ncode: string): Promise<NovelInfo> {
  const params = new URLSearchParams({
    out: "json",
    ncode,
    of: "t-w-s-ga-n",
  });

  const res = await fetch(`${API_BASE}/novelapi/api/?${params}`);
  const data = await res.json();
  const item = data[1];

  if (!item) throw new Error("小説が見つかりません");

  return {
    ncode: item.ncode.toLowerCase(),
    title: item.title,
    writer: item.writer,
    story: item.story,
    general_all_no: item.general_all_no ?? 1,
    downloaded: false,
    lastReadEpisode: 1,
  };
}

async function fetchEpisode(ncode: string, episodeNo: number) {
  const res = await fetch(`/syosetu-page/${ncode.toLowerCase()}/${episodeNo}/`);
  const html = await res.text();

  const titleMatch = html.match(/<p class="novel_subtitle">(.*?)<\/p>/s);
  const bodyMatch = html.match(/<div id="novel_honbun"[^>]*>(.*?)<\/div>/s);

  const title =
    titleMatch?.[1]?.replace(/<[^>]+>/g, "").trim() ?? `${episodeNo}話`;

  const body =
    bodyMatch?.[1]
      ?.replace(/<br\s*\/?>/g, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .trim() ?? "";

  return { title, body };
}

export async function downloadFullNovel(
  novel: NovelInfo,
  onProgress?: (current: number, total: number) => void
) {
  for (let i = 1; i <= novel.general_all_no; i++) {
    const ep = await fetchEpisode(novel.ncode, i);

    const episode: Episode = {
      id: `${novel.ncode}-${i}`,
      ncode: novel.ncode,
      episodeNo: i,
      title: ep.title,
      body: ep.body,
    };

    await saveEpisode(episode);
    onProgress?.(i, novel.general_all_no);
  }

  await markDownloaded(novel.ncode);
}