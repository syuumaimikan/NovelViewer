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
import { trashOutline, bookOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import {
  getLibrary,
  removeFromLibrary,
  Novel,
  addHistory,
} from "../data/novelstore";
import "./Tab1.css";

const Tab1: React.FC = () => {
  const [library, setLibrary] = useState<Novel[]>([]);

  useEffect(() => {
    setLibrary(getLibrary());
  }, []);

  const deleteNovel = (ncode: string) => {
    removeFromLibrary(ncode);
    setLibrary(getLibrary());
  };

  const openNovel = (novel: Novel) => {
    addHistory(novel);
    alert(`${novel.title}\n\nここにリーダー画面を作成します。`);
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
          <p>オフライン保存した小説</p>
        </div>

        <IonList className="custom-list">
          {library.map((novel) => (
            <IonItem key={novel.ncode} className="custom-item" lines="none">
              <IonIcon icon={bookOutline} slot="start" />

              <IonLabel onClick={() => openNovel(novel)}>
                <h2>{novel.title}</h2>
                <p>
                  {novel.writer}・{novel.progress ?? 0}% 読了
                </p>
              </IonLabel>

              <IonBadge className="status-badge">
                {novel.novel_type === 1 ? "短編" : "連載"}
              </IonBadge>

              <IonButton fill="clear" onClick={() => deleteNovel(novel.ncode)}>
                <IonIcon icon={trashOutline} />
              </IonButton>
            </IonItem>
          ))}
        </IonList>

        {library.length === 0 && (
          <p className="empty-text">まだ保存された小説がありません</p>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
