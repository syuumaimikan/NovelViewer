export type Novel = {
  ncode: string;
  title: string;
  writer: string;
  story?: string;
  genre?: number;
  keyword?: string;
  global_point?: number;
  novel_type?: number;
  general_all_no?: number;
  lastup?: string;
  body?: string;
  downloadedAt?: string;
  progress?: number;
};

export type ReaderSettings = {
  vertical: boolean;
  fontSize: number;
  lineHeight: number;
  fontFamily: string;
  theme: "dark" | "light" | "sepia";
};

const LIBRARY_KEY = "novel_library";
const HISTORY_KEY = "novel_history";
const SETTINGS_KEY = "reader_settings";

export const defaultSettings: ReaderSettings = {
  vertical: true,
  fontSize: 18,
  lineHeight: 1.9,
  fontFamily: "serif",
  theme: "dark",
};

export function getLibrary(): Novel[] {
  return JSON.parse(localStorage.getItem(LIBRARY_KEY) || "[]");
}

export function saveLibrary(list: Novel[]) {
  localStorage.setItem(LIBRARY_KEY, JSON.stringify(list));
}

export function addToLibrary(novel: Novel) {
  const list = getLibrary();
  const exists = list.some((n) => n.ncode === novel.ncode);

  if (!exists) {
    saveLibrary([
      {
        ...novel,
        downloadedAt: new Date().toISOString(),
        progress: 0,
      },
      ...list,
    ]);
  }
}

export function removeFromLibrary(ncode: string) {
  saveLibrary(getLibrary().filter((n) => n.ncode !== ncode));
}

export function getHistory(): Novel[] {
  return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
}

export function addHistory(novel: Novel) {
  const list = getHistory().filter((n) => n.ncode !== novel.ncode);
  localStorage.setItem(
    HISTORY_KEY,
    JSON.stringify([
      {
        ...novel,
        lastup: new Date().toISOString(),
      },
      ...list,
    ]),
  );
}

export function getSettings(): ReaderSettings {
  return JSON.parse(
    localStorage.getItem(SETTINGS_KEY) || JSON.stringify(defaultSettings),
  );
}

export function saveSettings(settings: ReaderSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function exportBackup() {
  const data = {
    library: getLibrary(),
    history: getHistory(),
    settings: getSettings(),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "novel-reader-backup.json";
  a.click();

  URL.revokeObjectURL(url);
}

export function importBackupFile(file: File) {
  const reader = new FileReader();

  reader.onload = () => {
    const data = JSON.parse(String(reader.result));

    if (data.library) {
      saveLibrary(data.library);
    }

    if (data.history) {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(data.history));
    }

    if (data.settings) {
      saveSettings(data.settings);
    }

    location.reload();
  };

  reader.readAsText(file);
}
