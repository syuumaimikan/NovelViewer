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
  IonSelect,
  IonSelectOption,
  IonRange,
  IonButton,
  IonToast,
} from "@ionic/react";

import {
  settingsOutline,
  textOutline,
  sunnyOutline,
  volumeHighOutline,
  bookmarkOutline,
  searchOutline,
  createOutline,
  imageOutline,
  phonePortraitOutline,
} from "ionicons/icons";

import { useEffect, useState } from "react";
import {
  loadReaderSettings,
  saveReaderSettings,
  ReaderSettings,
} from "../data/readerSettings";

import "./Tab4.css";

const Tab4: React.FC = () => {
  const [settings, setSettings] =
    useState<ReaderSettings>(loadReaderSettings());
  const [toast, setToast] = useState("");

  useEffect(() => {
    saveReaderSettings(settings);
  }, [settings]);

  const update = <K extends keyof ReaderSettings>(
    key: K,
    value: ReaderSettings[K],
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetSettings = () => {
    localStorage.removeItem("reader_settings");
    location.reload();
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
          <p>読書設定・表示設定</p>
        </div>

        <IonList className="custom-list">
          <IonItem className="custom-item" lines="none">
            <IonIcon icon={settingsOutline} slot="start" />
            <IonLabel>
              <h2>読書設定</h2>
              <p>読みやすさをカスタマイズ</p>
            </IonLabel>
          </IonItem>

          <IonItem className="custom-item" lines="none">
            <IonLabel>ページ送り方式</IonLabel>
            <IonSelect
              value={settings.pageMode}
              onIonChange={(e) => update("pageMode", e.detail.value)}
            >
              <IonSelectOption value="scroll">縦スクロール</IonSelectOption>
              <IonSelectOption value="page">左右ページ送り</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem className="custom-item" lines="none">
            <IonLabel>左タップ</IonLabel>
            <IonSelect
              value={settings.tapLeftAction}
              onIonChange={(e) => update("tapLeftAction", e.detail.value)}
            >
              <IonSelectOption value="prev">前ページ</IonSelectOption>
              <IonSelectOption value="none">なし</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem className="custom-item" lines="none">
            <IonLabel>右タップ</IonLabel>
            <IonSelect
              value={settings.tapRightAction}
              onIonChange={(e) => update("tapRightAction", e.detail.value)}
            >
              <IonSelectOption value="next">次ページ</IonSelectOption>
              <IonSelectOption value="none">なし</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem className="custom-item" lines="none">
            <IonIcon icon={textOutline} slot="start" />
            <IonLabel>フォント</IonLabel>
            <IonSelect
              value={settings.fontFamily}
              onIonChange={(e) => update("fontFamily", e.detail.value)}
            >
              <IonSelectOption value="system-ui">システム</IonSelectOption>
              <IonSelectOption value="serif">明朝</IonSelectOption>
              <IonSelectOption value="sans-serif">ゴシック</IonSelectOption>
              <IonSelectOption value="'Noto Serif JP', serif">
                Noto Serif JP
              </IonSelectOption>
              <IonSelectOption value="'Noto Sans JP', sans-serif">
                Noto Sans JP
              </IonSelectOption>
              <IonSelectOption value="custom">カスタム</IonSelectOption>
            </IonSelect>
          </IonItem>

          {settings.fontFamily === "custom" && (
            <IonItem className="custom-item" lines="none">
              <IonLabel position="stacked">カスタムフォント名</IonLabel>
              <IonInput
                placeholder="例: Yu Mincho"
                value={settings.customFontName}
                onIonInput={(e) =>
                  update("customFontName", String(e.detail.value ?? ""))
                }
              />
            </IonItem>
          )}

          <IonItem className="custom-item range-item" lines="none">
            <IonLabel>文字サイズ：{settings.fontSize}px</IonLabel>
            <IonRange
              min={14}
              max={40}
              step={1}
              value={settings.fontSize}
              onIonChange={(e) => update("fontSize", Number(e.detail.value))}
            />
          </IonItem>

          <IonItem className="custom-item range-item" lines="none">
            <IonLabel>行間：{settings.lineHeight}</IonLabel>
            <IonRange
              min={1.2}
              max={3}
              step={0.1}
              value={settings.lineHeight}
              onIonChange={(e) => update("lineHeight", Number(e.detail.value))}
            />
          </IonItem>

          <IonItem className="custom-item range-item" lines="none">
            <IonLabel>文字間隔：{settings.letterSpacing}px</IonLabel>
            <IonRange
              min={0}
              max={8}
              step={0.5}
              value={settings.letterSpacing}
              onIonChange={(e) =>
                update("letterSpacing", Number(e.detail.value))
              }
            />
          </IonItem>

          <IonItem className="custom-item range-item" lines="none">
            <IonIcon icon={sunnyOutline} slot="start" />
            <IonLabel>
              明るさ：{Math.round(settings.brightness * 100)}%
            </IonLabel>
            <IonRange
              min={0.3}
              max={1.3}
              step={0.05}
              value={settings.brightness}
              onIonChange={(e) => update("brightness", Number(e.detail.value))}
            />
          </IonItem>

          <IonItem className="custom-item" lines="none">
            <IonIcon icon={phonePortraitOutline} slot="start" />
            <IonLabel>ステータスバー・ナビゲーションバーを隠す</IonLabel>
            <IonToggle
              checked={settings.hideSystemBars}
              onIonChange={(e) => update("hideSystemBars", e.detail.checked)}
            />
          </IonItem>

          <IonItem className="custom-item" lines="none">
            <IonLabel>ルビ表示</IonLabel>
            <IonToggle
              checked={settings.showRuby}
              onIonChange={(e) => update("showRuby", e.detail.checked)}
            />
          </IonItem>

          <IonItem className="custom-item" lines="none">
            <IonIcon icon={imageOutline} slot="start" />
            <IonLabel>挿絵表示</IonLabel>
            <IonToggle
              checked={settings.showImages}
              onIonChange={(e) => update("showImages", e.detail.checked)}
            />
          </IonItem>

          <IonItem className="custom-item" lines="none">
            <IonLabel>改ページ表示</IonLabel>
            <IonToggle
              checked={settings.showPageBreak}
              onIonChange={(e) => update("showPageBreak", e.detail.checked)}
            />
          </IonItem>

          <IonItem className="custom-item" lines="none">
            <IonIcon icon={searchOutline} slot="start" />
            <IonLabel>本文検索</IonLabel>
            <IonToggle
              checked={settings.enableTextSearch}
              onIonChange={(e) => update("enableTextSearch", e.detail.checked)}
            />
          </IonItem>

          <IonItem className="custom-item" lines="none">
            <IonIcon icon={bookmarkOutline} slot="start" />
            <IonLabel>しおり</IonLabel>
            <IonToggle
              checked={settings.enableBookmarks}
              onIonChange={(e) => update("enableBookmarks", e.detail.checked)}
            />
          </IonItem>

          <IonItem className="custom-item" lines="none">
            <IonLabel>ハイライト</IonLabel>
            <IonToggle
              checked={settings.enableHighlights}
              onIonChange={(e) => update("enableHighlights", e.detail.checked)}
            />
          </IonItem>

          <IonItem className="custom-item" lines="none">
            <IonIcon icon={createOutline} slot="start" />
            <IonLabel>メモ</IonLabel>
            <IonToggle
              checked={settings.enableNotes}
              onIonChange={(e) => update("enableNotes", e.detail.checked)}
            />
          </IonItem>

          <IonItem className="custom-item" lines="none">
            <IonIcon icon={volumeHighOutline} slot="start" />
            <IonLabel>TTS 読み上げ</IonLabel>
            <IonToggle
              checked={settings.ttsEnabled}
              onIonChange={(e) => update("ttsEnabled", e.detail.checked)}
            />
          </IonItem>

          <IonItem className="custom-item range-item" lines="none">
            <IonLabel>読み上げ速度：{settings.ttsRate}</IonLabel>
            <IonRange
              min={0.5}
              max={2}
              step={0.1}
              value={settings.ttsRate}
              onIonChange={(e) => update("ttsRate", Number(e.detail.value))}
            />
          </IonItem>
          <IonItem className="custom-item" lines="none">
            <IonLabel>本文の選択を許可</IonLabel>
            <IonToggle
              checked={settings.allowTextSelection}
              onIonChange={(e) =>
                update("allowTextSelection", e.detail.checked)
              }
            />
          </IonItem>
          <IonButton
            expand="block"
            className="main-button"
            onClick={() => setToast("設定を保存しました")}
          >
            設定を保存
          </IonButton>

          <IonButton
            expand="block"
            fill="outline"
            color="danger"
            onClick={resetSettings}
          >
            設定を初期化
          </IonButton>
        </IonList>

        <IonToast
          isOpen={toast !== ""}
          message={toast}
          duration={1500}
          onDidDismiss={() => setToast("")}
        />
      </IonContent>
    </IonPage>
  );
};

export default Tab4;
