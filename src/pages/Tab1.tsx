import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonBadge,
  IonProgressBar,
  IonToast,
} from "@ionic/react";

import {
  bookOutline,
  cloudDownloadOutline,
  readerOutline,
  openOutline,
} from "ionicons/icons";

import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { getNovels, NovelInfo } from "../data/novelDB";
import { downloadFullNovel } from "../data/syosetuApi";
import "./Tab1.css";

const Tab1: React.FC = () => {
  const [library, setLibrary] = useState<NovelInfo[]>([]);
  const [downloadingNcode, setDownloadingNcode] = useState("");
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState("");
  const history = useHistory();

  const loadLibrary = async () => {
    setLibrary(await getNovels());
  };

  useEffect(() => {
    loadLibrary();
  }, []);

  const readOffline = (ncode: string) => {
    history.push(`/reader/${ncode}`);
  };

  const readOnline = (ncode: string) => {
    window.open(`https://ncode.syosetu.com/${ncode.toLowerCase()}/`, "_blank");
  };

  const downloadNovel = async (novel: NovelInfo) => {
    try {
      setDownloadingNcode(novel.ncode);
      setProgress(0);

      await downloadFullNovel(novel, (current, total) => {
        setProgress(current / total);
      });

      setToast("全話ダウンロードしました");
      await loadLibrary();
    } catch {
      setToast("ダウンロードに失敗しました");
    } finally {
      setDownloadingNcode("");
      setProgress(0);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>ライブラリ</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="library-page">
        <div className="page-title">
          <h1>ライブラリ</h1>
          <p>保存した小説</p>
        </div>

        <IonList className="custom-list">
          {library.map((novel) => (
            <IonItem key={novel.ncode} className="library-card" lines="none">
              <IonIcon icon={bookOutline} slot="start" />

              <IonLabel>
                <h2>{novel.title}</h2>
                <p>
                  {novel.writer}・{novel.general_all_no}話・
                  {novel.downloaded ? "DL済み" : "未DL"}
                </p>

                {downloadingNcode === novel.ncode && (
                  <IonProgressBar value={progress} />
                )}

                <div className="library-actions">
                  <IonButton
                    size="small"
                    fill="outline"
                    onClick={() => readOnline(novel.ncode)}
                  >
                    <IonIcon icon={openOutline} slot="start" />
                    オンライン
                  </IonButton>

                  {novel.downloaded ? (
                    <IonButton
                      size="small"
                      onClick={() => readOffline(novel.ncode)}
                    >
                      <IonIcon icon={readerOutline} slot="start" />
                      読む
                    </IonButton>
                  ) : (
                    <IonButton
                      size="small"
                      onClick={() => downloadNovel(novel)}
                      disabled={downloadingNcode === novel.ncode}
                    >
                      <IonIcon icon={cloudDownloadOutline} slot="start" />
                      全話DL
                    </IonButton>
                  )}
                </div>
              </IonLabel>

              <IonBadge className="status-badge">
                {novel.downloaded ? "DL済" : "未DL"}
              </IonBadge>
            </IonItem>
          ))}
        </IonList>

        {library.length === 0 && (
          <p className="empty-text">検索画面から小説を追加してください</p>
        )}

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

export default Tab1;