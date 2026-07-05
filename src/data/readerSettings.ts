export type ReaderSettings = {
  pageMode: "scroll" | "page";
  tapLeftAction: "prev" | "none";
  tapRightAction: "next" | "none";
  allowTextSelection: boolean;

  fontFamily: string;
  customFontName: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;

  brightness: number;
  hideSystemBars: boolean;

  showRuby: boolean;
  showImages: boolean;
  showPageBreak: boolean;

  enableTextSearch: boolean;
  enableBookmarks: boolean;
  enableHighlights: boolean;
  enableNotes: boolean;

  ttsEnabled: boolean;
  ttsRate: number;
};

export const defaultReaderSettings: ReaderSettings = {
  pageMode: "scroll",
  tapLeftAction: "prev",
  tapRightAction: "next",
  allowTextSelection: true,

  fontFamily: "system-ui",
  customFontName: "",

  fontSize: 24,
  lineHeight: 2.1,
  letterSpacing: 0,

  brightness: 1,
  hideSystemBars: false,

  showRuby: true,
  showImages: true,
  showPageBreak: true,

  enableTextSearch: true,
  enableBookmarks: true,
  enableHighlights: true,
  enableNotes: true,

  ttsEnabled: false,
  ttsRate: 1,
};

const KEY = "reader_settings";

export function loadReaderSettings(): ReaderSettings {
  return JSON.parse(
    localStorage.getItem(KEY) || JSON.stringify(defaultReaderSettings)
  );
}

export function saveReaderSettings(settings: ReaderSettings) {
  localStorage.setItem(KEY, JSON.stringify(settings));
}