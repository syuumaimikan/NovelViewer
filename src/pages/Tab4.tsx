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
  IonInput,
  IonButton,
  IonProgressBar,
  IonToast,
} from "@ionic/react";
import { downloadOutline } from "ionicons/icons";
import { useState } from "react";
import { fetchNovelInfo, downloadFullNovel } from "../data/syosetuApi";
import "./Tab4.css";

const Tab4: React.FC = () => {
  const [ncode, setNcode] = useState("");
  const [toast, setToast] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const download = async () => {
    if (!ncode.trim()) {
      setToast("Nコードを入力してください");
      return;
    }

    try {
      setDownloading(true);
      setProgress(0);
      const novel = await fetchNovelInfo(ncode);
      await downloadFullNovel(novel, (current, total) => {
        setProgress(current / total);
      });

      setToast("全話ダウンロードしました");
    } catch {
      setToast("ダウンロードに失敗しました");
    } finally {
      setDownloading(false);
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
          <p>設定・小説ダウンロード</p>
        </div>

        <IonList className="custom-list">
          <IonItem className="custom-item" lines="none">
            <IonIcon icon={downloadOutline} slot="start" />
            <IonLabel>
              <h2>小説を全話ダウンロード</h2>
              <p>Nコードを入力してDBに保存</p>
            </IonLabel>
          </IonItem>

          <IonItem className="custom-item" lines="none">
            <IonInput
              placeholder="例: N6316BN"
              value={ncode}
              onIonInput={(e) => setNcode(String(e.detail.value))}
            />
          </IonItem>

          {downloading && <IonProgressBar value={progress} />}

          <IonButton
            expand="block"
            className="main-button"
            onClick={download}
            disabled={downloading}
          >
            <IonIcon icon={downloadOutline} slot="start" />
            {downloading
              ? `ダウンロード中 ${Math.floor(progress * 100)}%`
              : "全話ダウンロード"}
          </IonButton>
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
