import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonToolbar,
  IonButtons,
  IonToast,
} from "@ionic/react";

import {
  arrowBackOutline,
  heartOutline,
  bookOutline,
  shareSocialOutline,
  ellipsisVerticalOutline,
} from "ionicons/icons";

import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { addNovelToLibrary, getNovel, NovelInfo } from "../data/novelDb";
import { fetchNovelInfo } from "../data/syosetuApi";
import "./NovelDetailPage.css";

const NovelDetailPage: React.FC = () => {
  const { ncode } = useParams<{ ncode: string }>();
  const history = useHistory();

  const [novel, setNovel] = useState<NovelInfo | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const load = async () => {
      const local = await getNovel(ncode);

      if (local) {
        setNovel(local);
        return;
      }

      const info = await fetchNovelInfo(ncode);
      setNovel(info);
    };

    load();
  }, [ncode]);

  const addLibrary = async () => {
    if (!novel) return;
    await addNovelToLibrary(novel);
    setToast("ライブラリに追加しました");
  };

  const read = () => {
    history.push(`/reader/${ncode}/1`);
  };

  if (!novel) {
    return (
      <IonPage>
        <IonContent className="novel-detail-page">
          <p className="empty-text">読み込み中...</p>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader className="detail-header">
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => history.goBack()}>
              <IonIcon icon={arrowBackOutline} />
            </IonButton>
          </IonButtons>

          <IonButtons slot="end">
            <IonButton>
              <IonIcon icon={shareSocialOutline} />
            </IonButton>

            <IonButton>
              <IonIcon icon={ellipsisVerticalOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="novel-detail-page">
        <div className="detail-main">
          <h1>{novel.title}</h1>
          <p className="writer">{novel.writer}</p>

          <IonButton
            expand="block"
            className="add-library-button"
            onClick={addLibrary}
          >
            <IonIcon icon={heartOutline} slot="start" />
            ライブラリに追加
          </IonButton>

          <div className="keyword-row">
            {(novel.keyword ?? "")
              .split(" ")
              .filter(Boolean)
              .slice(0, 8)
              .map((k) => (
                <span key={k}>{k}</span>
              ))}
          </div>

          <p className="story">{novel.story}</p>
        </div>

        <IonButton className="floating-read-button" onClick={read}>
          <IonIcon icon={bookOutline} slot="start" />
          読む
        </IonButton>

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

export default NovelDetailPage;