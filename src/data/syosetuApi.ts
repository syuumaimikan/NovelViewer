import { Episode, NovelInfo, saveEpisode } from "./novelDB";

const API_BASE = "/syosetu-api";

function decodeHtml(text: string) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

export async function fetchNovelInfo(ncode: string): Promise<NovelInfo> {
  const params = new URLSearchParams({
    out: "json",
    ncode,
    of: "t-w-s-ga-n-k-g",
  });

  const res = await fetch(`${API_BASE}/novelapi/api/?${params}`);
  const data = await res.json();
  const item = data[1];

  if (!item) {
    throw new Error("小説が見つかりません");
  }

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
  episodeNo: number,
): Promise<Episode> {
  const key = ncode.toLowerCase();

  const res = await fetch(`/syosetu-page/${key}/${episodeNo}/`);
  const html = await res.text();

  console.log(html); // 一度確認用

  const doc = new DOMParser().parseFromString(html, "text/html");

  const title =
    doc.querySelector(".p-novel__title")?.textContent?.trim() ||
    doc.querySelector(".novel_subtitle")?.textContent?.trim() ||
    `第${episodeNo}話`;

  const bodyElement =
    doc.querySelector(".js-novel-text") ||
    doc.querySelector(".p-novel__body") ||
    doc.querySelector("#novel_honbun");

  const body =
    bodyElement?.textContent
      ?.replace(/\r/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim() ?? "";

  return {
    id: `${key}-${episodeNo}`,
    ncode: key,
    episodeNo,
    title,
    body,
    downloadedAt: "",
  };
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
  onProgress?: (current: number, total: number) => void,
) {
  for (let i = 1; i <= novel.general_all_no; i++) {
    await downloadEpisode(novel.ncode, i);
    onProgress?.(i, novel.general_all_no);
  }
}
