import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";

import { arrowBackOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import {
  Episode,
  getEpisodes,
  getNovel,
  NovelInfo,
  updateLastRead,
} from "../data/novelDB";
import "./ReaderPage.css";

const ReaderPage: React.FC = () => {
  const { ncode } = useParams<{ ncode: string }>();
  const history = useHistory();

  const [novel, setNovel] = useState<NovelInfo | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [episodeNo, setEpisodeNo] = useState(1);
  const [vertical, setVertical] = useState(false);

  useEffect(() => {
    const load = async () => {
      const n = await getNovel(ncode);
      const eps = await getEpisodes(ncode);

      if (!n) return;

      setNovel(n);
      setEpisodes(eps);
      setEpisodeNo(n.lastReadEpisode ?? 1);
    };

    load();
  }, [ncode]);

  const currentEpisode = episodes.find((ep) => ep.episodeNo === episodeNo);

  const changeEpisode = async (no: number) => {
    setEpisodeNo(no);
    await updateLastRead(ncode, no);
  };

  if (!novel) {
    return (
      <IonPage>
        <IonContent className="reader-page">
          <p className="empty-text">小説が見つかりません</p>
        </IonContent>
      </IonPage>
    );
  }

  if (episodes.length === 0) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={() => history.goBack()}>
                <IonIcon icon={arrowBackOutline} />
              </IonButton>
            </IonButtons>
            <IonTitle>{novel.title}</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent className="reader-page">
          <p className="empty-text">
            この小説はまだダウンロードされていません。
            ライブラリ画面から全話DLしてください。
          </p>
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

          <IonButtons slot="end">
            <IonButton onClick={() => setVertical(!vertical)}>
              {vertical ? "横" : "縦"}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="reader-page">
        <div className="episode-selector">
          <IonSelect
            value={episodeNo}
            onIonChange={(e) => changeEpisode(Number(e.detail.value))}
          >
            {episodes.map((ep) => (
              <IonSelectOption key={ep.id} value={ep.episodeNo}>
                第{ep.episodeNo}話　{ep.title}
              </IonSelectOption>
            ))}
          </IonSelect>
        </div>

        <div className={vertical ? "reader-body vertical" : "reader-body"}>
          <h1>{currentEpisode?.title}</h1>
          <p>{currentEpisode?.body}</p>
        </div>

        <div className="reader-nav">
          <IonButton
            disabled={episodeNo <= 1}
            onClick={() => changeEpisode(episodeNo - 1)}
          >
            前の話
          </IonButton>

          <IonButton
            disabled={episodeNo >= episodes.length}
            onClick={() => changeEpisode(episodeNo + 1)}
          >
            次の話
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ReaderPage;