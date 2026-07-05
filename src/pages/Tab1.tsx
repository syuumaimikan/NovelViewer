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
} from "@ionic/react";

import {
  bookOutline,
  cloudDownloadOutline,
  readerOutline,
} from "ionicons/icons";

import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { getNovels, NovelInfo } from "../data/novelDB";
import "./Tab1.css";

const Tab1: React.FC = () => {
  const [library, setLibrary] = useState<NovelInfo[]>([]);
  const history = useHistory();

  useEffect(() => {
    getNovels().then(setLibrary);
  }, []);

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
          <p>追加した小説</p>
        </div>

        <IonList className="custom-list">
          {library.map((novel) => (
            <IonItem key={novel.ncode} className="library-card" lines="none">
              <IonIcon icon={bookOutline} slot="start" />

              <IonLabel>
                <h2>{novel.title}</h2>
                <p>
                  {novel.writer}・{novel.general_all_no}話・
                  {novel.lastReadEpisode ?? 1}話まで読書
                </p>

                <div className="library-actions">
                  <IonButton
                    size="small"
                    onClick={() =>
                      history.push(
                        `/reader/${novel.ncode}/${novel.lastReadEpisode ?? 1}`,
                      )
                    }
                  >
                    <IonIcon icon={readerOutline} slot="start" />
                    読む
                  </IonButton>

                  <IonButton
                    size="small"
                    fill="outline"
                    onClick={() =>
                      history.push(`/library/${novel.ncode}/download`)
                    }
                  >
                    <IonIcon icon={cloudDownloadOutline} slot="start" />
                    DL管理
                  </IonButton>
                </div>
              </IonLabel>

              <IonBadge className="status-badge">保存</IonBadge>
            </IonItem>
          ))}
        </IonList>

        {library.length === 0 && (
          <p className="empty-text">見つける画面から小説を追加してください</p>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
