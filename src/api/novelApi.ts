import { API_BASE_URL } from "../config/api";

export async function getRanking(type: string) {
  const res = await fetch(`${API_BASE_URL}/api/ranking/${type}`);
  if (!res.ok) throw new Error("ランキング取得失敗");
  return await res.json();
}

export async function searchNovels(params: Record<string, string>) {
  const query = new URLSearchParams(params);
  const res = await fetch(`${API_BASE_URL}/api/search?${query.toString()}`);
  if (!res.ok) throw new Error("検索失敗");
  return await res.json();
}

export async function getNovelInfo(ncode: string) {
  const res = await fetch(`${API_BASE_URL}/api/novel/${ncode}`);
  if (!res.ok) throw new Error("小説情報取得失敗");
  return await res.json();
}

export async function getEpisodeOnline(ncode: string, episodeNo: number) {
  const res = await fetch(`${API_BASE_URL}/api/novel/${ncode}/${episodeNo}`);
  if (!res.ok) throw new Error("本文取得失敗");
  return await res.json();
}

export async function downloadNovelAllFromServer(ncode: string) {
  const res = await fetch(`${API_BASE_URL}/api/download/${ncode}`);
  if (!res.ok) throw new Error("全話取得失敗");
  return await res.json();
}
