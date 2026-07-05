import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
} from "@ionic/react";

import { arrowBackOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";

import {
  Episode,
  getEpisode,
  getNovel,
  NovelInfo,
  updateLastRead,
} from "../data/novelDb";

import { fetchEpisodeOnline, fetchNovelInfo } from "../data/syosetuApi";
import { loadReaderSettings } from "../data/readerSettings";
import "./ReaderPage.css";

const ReaderPage: React.FC = () => {
  const { ncode, episodeNo } = useParams<{
    ncode: string;
    episodeNo: string;
  }>();

  const history = useHistory();
  const epNo = Number(episodeNo);

  const [novel, setNovel] = useState<NovelInfo | null>(null);
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(true);
  const [readerSettings] = useState(loadReaderSettings());

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      let n = await getNovel(ncode);

      if (!n) {
        n = await fetchNovelInfo(ncode);
      }

      setNovel(n);

      const localEpisode = await getEpisode(ncode, epNo);

      if (localEpisode) {
        setEpisode(localEpisode);
      } else {
        const onlineEpisode = await fetchEpisodeOnline(ncode, epNo);
        setEpisode(onlineEpisode);
      }

      await updateLastRead(ncode, epNo);
      setLoading(false);
    };

    load();
  }, [ncode, epNo]);

  const moveEpisode = (next: number) => {
    history.replace(`/reader/${ncode}/${next}`);
  };

  if (loading || !novel || !episode) {
    return (
      <IonPage>
        <IonContent className="reader-page">
          <p className="empty-text">読み込み中...</p>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="reader-toolbar">
          <IonButtons slot="start">
            <IonButton onClick={() => history.goBack()}>
              <IonIcon icon={arrowBackOutline} />
            </IonButton>
          </IonButtons>

          <IonTitle>{novel.title}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="reader-page">
        <div
          className="tap-left"
          onClick={() => {
            if (readerSettings.tapLeftAction === "prev" && epNo > 1) {
              moveEpisode(epNo - 1);
            }
          }}
        />

        <div
          className="tap-right"
          onClick={() => {
            if (
              readerSettings.tapRightAction === "next" &&
              epNo < novel.general_all_no
            ) {
              moveEpisode(epNo + 1);
            }
          }}
        />

        <div
          className={`reader-body ${
            readerSettings.pageMode === "page" ? "page-mode" : "scroll-mode"
          } ${
            readerSettings.allowTextSelection
              ? "allow-selection"
              : "disable-selection"
          }`}
          style={{
            fontFamily:
              readerSettings.fontFamily === "custom"
                ? readerSettings.customFontName
                : readerSettings.fontFamily,
            fontSize: `${readerSettings.fontSize}px`,
            lineHeight: readerSettings.lineHeight,
            letterSpacing: `${readerSettings.letterSpacing}px`,
            filter: `brightness(${readerSettings.brightness})`,
          }}
        >
          <h1>{episode.title}</h1>

          {episode.body ? (
            <p>{episode.body}</p>
          ) : (
            <p className="empty-text">本文を取得できませんでした</p>
          )}
        </div>

        <div className="reader-page-buttons">
          <IonButton
            fill="outline"
            disabled={epNo <= 1}
            onClick={() => moveEpisode(epNo - 1)}
          >
            前のページ
          </IonButton>

          <IonButton
            disabled={epNo >= novel.general_all_no}
            onClick={() => moveEpisode(epNo + 1)}
          >
            次のページ
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ReaderPage;