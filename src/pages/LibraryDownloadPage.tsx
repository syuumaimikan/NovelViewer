import {
  IonButton,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage,
  IonProgressBar,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonToast,
} from "@ionic/react";

import { arrowBackOutline, menuOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { getNovel, isEpisodeDownloaded, NovelInfo } from "../data/novelDB";
import { downloadEpisode } from "../data/syosetuApi";
import "./LibraryDownloadPage.css";

type EpisodeStatus = {
  episodeNo: number;
  downloaded: boolean;
};

const LibraryDownloadPage: React.FC = () => {
  const { ncode } = useParams<{ ncode: string }>();
  const history = useHistory();

  const [novel, setNovel] = useState<NovelInfo | null>(null);
  const [episodes, setEpisodes] = useState<EpisodeStatus[]>([]);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState("");

  const load = async () => {
    const n = await getNovel(ncode);
    if (!n) return;

    setNovel(n);

    const list: EpisodeStatus[] = [];

    for (let i = 1; i <= n.general_all_no; i++) {
      list.push({
        episodeNo: i,
        downloaded: await isEpisodeDownloaded(ncode, i),
      });
    }

    setEpisodes(list);
  };

  useEffect(() => {
    load();
  }, [ncode]);

  const downloadOne = async (episodeNo: number) => {
    try {
      setDownloading(true);
      await downloadEpisode(ncode, episodeNo);
      await load();
    } catch {
      setToast("ダウンロードに失敗しました");
    } finally {
      setDownloading(false);
    }
  };

  const downloadAll = async () => {
    if (!novel) return;

    setDownloading(true);
    setProgress(0);

    try {
      for (let i = 1; i <= novel.general_all_no; i++) {
        if (!(await isEpisodeDownloaded(ncode, i))) {
          await downloadEpisode(ncode, i);
        }

        setProgress(i / novel.general_all_no);
      }

      await load();
      setToast("全てDLしました");
    } catch {
      setToast("DLに失敗しました");
    } finally {
      setDownloading(false);
    }
  };

  if (!novel) {
    return (
      <IonPage>
        <IonContent className="download-page">
          <p className="empty-text">読み込み中...</p>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="download-toolbar">
          <IonButtons slot="start">
            <IonButton onClick={() => history.goBack()}>
              <IonIcon icon={arrowBackOutline} />
            </IonButton>
          </IonButtons>

          <IonTitle>{novel.title}</IonTitle>

          <IonButtons slot="end">
            <IonButton>
              <IonIcon icon={menuOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="download-page">
        <div className="download-novel-header">
          <IonCheckbox checked />
          <div>
            <h2>{novel.title}</h2>
            <p>{novel.writer}</p>
          </div>
        </div>

        {downloading && <IonProgressBar value={progress} />}

        <div className="episode-group-title">全{novel.general_all_no}話</div>

        {episodes.map((ep) => (
          <IonItem
            key={ep.episodeNo}
            className="episode-download-row"
            lines="none"
          >
            <IonCheckbox
              checked={ep.downloaded}
              onClick={() => !ep.downloaded && downloadOne(ep.episodeNo)}
              slot="start"
            />

            <IonLabel>
              <h2>第{ep.episodeNo}話</h2>
              <p>{ep.downloaded ? "ダウンロード済み" : "未ダウンロード"}</p>
            </IonLabel>

            <IonButton
              fill="clear"
              onClick={() => history.push(`/reader/${ncode}/${ep.episodeNo}`)}
            >
              読む
            </IonButton>
          </IonItem>
        ))}

        <div className="download-footer-space" />

        <IonToast
          isOpen={toast !== ""}
          message={toast}
          duration={1600}
          onDidDismiss={() => setToast("")}
        />
      </IonContent>

      <div className="download-bottom-bar">
        <IonButton fill="outline" onClick={downloadAll} disabled={downloading}>
          全てDL
        </IonButton>
      </div>
    </IonPage>
  );
};

export default LibraryDownloadPage;
