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
  IonButton,
} from "@ionic/react";
import { timeOutline, trashOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { getHistory, Novel } from "../data/novelstore";
import "./Tab3.css";

const Tab3: React.FC = () => {
  const [history, setHistory] = useState<Novel[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("novel_history");
    setHistory([]);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>履歴</IonTitle>
          <IonButton slot="end" fill="clear" onClick={clearHistory}>
            <IonIcon icon={trashOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="history-page">
        <div className="page-title">
          <h1>履歴</h1>
          <p>最近読んだ小説</p>
        </div>

        <IonList className="custom-list">
          {history.map((novel) => (
            <IonItem key={novel.ncode} className="custom-item" lines="none">
              <IonIcon icon={timeOutline} slot="start" />

              <IonLabel>
                <h2>{novel.title}</h2>
                <p>
                  {novel.writer}・
                  {novel.lastup
                    ? new Date(novel.lastup).toLocaleString()
                    : "日時不明"}
                </p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>

        {history.length === 0 && (
          <p className="empty-text">履歴はまだありません</p>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
