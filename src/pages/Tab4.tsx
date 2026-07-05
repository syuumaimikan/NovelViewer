import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonToggle,
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonToast,
} from "@ionic/react";

import {
  settingsOutline,
  downloadOutline,
  moonOutline,
  textOutline,
  cloudUploadOutline,
  cloudDownloadOutline,
  documentTextOutline,
} from "ionicons/icons";

import { useEffect, useRef, useState } from "react";
import {
  exportBackup,
  getSettings,
  importBackupFile,
  ReaderSettings,
  saveSettings,
  addToLibrary,
  Novel,
} from "../data/novelstore";
import "./Tab4.css";

const Tab4: React.FC = () => {
  const [settings, setSettings] = useState<ReaderSettings>(getSettings());
  const [ncode, setNcode] = useState("");
  const [toast, setToast] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const downloadByNcode = async () => {
    if (!ncode.trim()) {
      setToast("Nコードを入力してください");
      return;
    }

    try {
      const params = new URLSearchParams({
        out: "json",
        ncode,
        of: "t-w-s-gp-nt-ga-n-k",
      });

      const res = await fetch(
        `/syosetu-api/novelapi/api/?${params.toString()}`,
      );
      const data = await res.json();

      if (!data[1]) {
        setToast("小説が見つかりません");
        return;
      }

      const novel: Novel = data[1];
      addToLibrary(novel);

      const text = `${novel.title}\n${novel.writer}\n\n${novel.story ?? ""}`;
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${novel.ncode}.txt`;
      a.click();

      URL.revokeObjectURL(url);
      setToast("ダウンロードしました");
    } catch {
      setToast("ダウンロードに失敗しました");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>もっと</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="more-page">
        <div className="page-title">
          <h1>もっと</h1>
          <p>設定・バックアップ・ダウンロード</p>
        </div>

        <IonList className="custom-list">
          <IonItem className="custom-item" lines="none">
            <IonIcon icon={settingsOutline} slot="start" />
            <IonLabel>
              <h2>読書設定</h2>
              <p>表示方法をカスタマイズ</p>
            </IonLabel>
          </IonItem>

          <IonItem className="custom-item" lines="none">
            <IonIcon icon={documentTextOutline} slot="start" />
            <IonLabel>縦書き表示</IonLabel>
            <IonToggle
              checked={settings.vertical}
              onIonChange={(e) =>
                setSettings({ ...settings, vertical: e.detail.checked })
              }
            />
          </IonItem>

          <IonItem className="custom-item" lines="none">
            <IonIcon icon={moonOutline} slot="start" />
            <IonLabel>テーマ</IonLabel>
            <IonSelect
              value={settings.theme}
              onIonChange={(e) =>
                setSettings({ ...settings, theme: e.detail.value })
              }
            >
              <IonSelectOption value="dark">ダーク</IonSelectOption>
              <IonSelectOption value="light">ライト</IonSelectOption>
              <IonSelectOption value="sepia">セピア</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem className="custom-item" lines="none">
            <IonIcon icon={textOutline} slot="start" />
            <IonLabel>フォントサイズ</IonLabel>
            <IonInput
              type="number"
              value={settings.fontSize}
              onIonInput={(e) =>
                setSettings({
                  ...settings,
                  fontSize: Number(e.detail.value),
                })
              }
            />
          </IonItem>

          <IonItem className="custom-item" lines="none">
            <IonIcon icon={textOutline} slot="start" />
            <IonLabel>行間</IonLabel>
            <IonInput
              type="number"
              value={settings.lineHeight}
              onIonInput={(e) =>
                setSettings({
                  ...settings,
                  lineHeight: Number(e.detail.value),
                })
              }
            />
          </IonItem>

          <IonItem className="custom-item" lines="none">
            <IonIcon icon={downloadOutline} slot="start" />
            <IonLabel>
              <h2>小説ダウンロード</h2>
              <p>Nコードから保存</p>
            </IonLabel>
          </IonItem>

          <IonItem className="custom-item" lines="none">
            <IonInput
              placeholder="例: N1234AB"
              value={ncode}
              onIonInput={(e) => setNcode(String(e.detail.value))}
            />
          </IonItem>

          <IonButton
            expand="block"
            className="main-button"
            onClick={downloadByNcode}
          >
            <IonIcon icon={downloadOutline} slot="start" />
            ダウンロード
          </IonButton>

          <IonItem className="custom-item" lines="none">
            <IonIcon icon={cloudUploadOutline} slot="start" />
            <IonLabel>バックアップを書き出し</IonLabel>
            <IonButton fill="clear" onClick={exportBackup}>
              実行
            </IonButton>
          </IonItem>

          <IonItem className="custom-item" lines="none">
            <IonIcon icon={cloudDownloadOutline} slot="start" />
            <IonLabel>バックアップを復元</IonLabel>
            <IonButton fill="clear" onClick={() => fileRef.current?.click()}>
              選択
            </IonButton>

            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) importBackupFile(file);
              }}
            />
          </IonItem>
        </IonList>

        <IonToast
          isOpen={toast !== ""}
          message={toast}
          duration={1600}
          onDidDismiss={() => setToast("")}
        />
      </IonContent>
    </IonPage>
  );
};

export default Tab4;
