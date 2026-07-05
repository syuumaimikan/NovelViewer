import {
  IonContent,
  IonPage,
  IonButton,
  IonIcon,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonModal,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonFooter,
  IonChip,
  IonToast,
} from "@ionic/react";

import { searchOutline, filterOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { getRanking, searchNovels } from "../api/novelApi";
import "./Tab2.css";

type Novel = {
  title: string;
  writer: string;
  story?: string;
  genre?: number;
  keyword?: string;
  ncode: string;
  global_point?: number;
  novel_type?: number;
  general_all_no?: number;
};

const Tab2: React.FC = () => {
  const history = useHistory();

  const [open, setOpen] = useState(false);
  const [range, setRange] = useState("daily");

  const [keyword, setKeyword] = useState("");
  const [genre, setGenre] = useState("none");
  const [type, setType] = useState("all");
  const [minLength, setMinLength] = useState("");
  const [maxLength, setMaxLength] = useState("");
  const [completed, setCompleted] = useState("all");

  const [novels, setNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const fetchRanking = async (type: string) => {
    setLoading(true);

    try {
      const data = await getRanking(type);
      setNovels(data);
    } catch (e) {
      console.error(e);
      setToast("ランキング取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const searchNovelList = async () => {
    setLoading(true);

    try {
      const params: Record<string, string> = {
        lim: "30",
        order: "hyoka",
      };

      if (keyword.trim()) params.word = keyword;
      if (genre !== "none") params.genre = genre;
      if (type === "short") params.type = "t";
      if (type === "serial") params.type = "r";
      if (minLength) params.minlen = minLength;
      if (maxLength) params.maxlen = maxLength;
      if (completed === "completed") params.isend = "1";

      const data = await searchNovels(params);
      setNovels(data);
      setOpen(false);
    } catch (e) {
      console.error(e);
      setToast("検索に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRanking(range);
  }, [range]);

  return (
    <IonPage>
      <IonContent fullscreen className="discover-page">
        <div className="discover-header">
          <h1>見つける</h1>

          <div>
            <IonButton fill="clear" onClick={() => setOpen(true)}>
              <IonIcon icon={searchOutline} />
            </IonButton>

            <IonButton fill="clear" onClick={() => setOpen(true)}>
              <IonIcon icon={filterOutline} />
            </IonButton>
          </div>
        </div>

        <IonSegment
          value={range}
          onIonChange={(e) => setRange(String(e.detail.value))}
          className="ranking-tabs"
        >
          <IonSegmentButton value="daily">
            <IonLabel>日間</IonLabel>
          </IonSegmentButton>

          <IonSegmentButton value="weekly">
            <IonLabel>週間</IonLabel>
          </IonSegmentButton>

          <IonSegmentButton value="monthly">
            <IonLabel>月間</IonLabel>
          </IonSegmentButton>

          <IonSegmentButton value="quarter">
            <IonLabel>四半期</IonLabel>
          </IonSegmentButton>

          <IonSegmentButton value="total">
            <IonLabel>累計</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        <div className="novel-list">
          {loading && <p className="empty-text">読み込み中...</p>}

          {!loading &&
            novels.map((novel, index) => (
              <div
                className="novel-row"
                key={novel.ncode}
                onClick={() =>
                  history.push(`/novel/${novel.ncode.toLowerCase()}`)
                }
              >
                <div className="rank-number">{index + 1}</div>

                <div className="novel-main">
                  <h2>{novel.title}</h2>
                  <p>
                    {novel.writer}・{getGenreName(novel.genre)}・
                    {((novel.global_point ?? 0) / 1000).toFixed(1)}k pt
                  </p>
                </div>

                <span className="novel-badge">
                  {novel.novel_type === 1 ? "短編" : "連載"}
                </span>
              </div>
            ))}
        </div>

        <IonModal
          isOpen={open}
          onDidDismiss={() => setOpen(false)}
          initialBreakpoint={0.75}
          breakpoints={[0, 0.75, 1]}
          handle
          className="search-sheet"
        >
          <IonContent className="search-sheet-content">
            <h1 className="sheet-title">検索条件</h1>

            <IonSearchbar
              className="keyword-search"
              placeholder="検索キーワード"
              value={keyword}
              onIonInput={(e) => setKeyword(e.detail.value ?? "")}
            />

            <div className="section">
              <p className="section-title">ジャンル</p>

              <IonItem className="select-box" lines="none">
                <IonSelect
                  value={genre}
                  onIonChange={(e) => setGenre(e.detail.value)}
                >
                  <IonSelectOption value="none">指定なし</IonSelectOption>
                  <IonSelectOption value="101">異世界〔恋愛〕</IonSelectOption>
                  <IonSelectOption value="102">現実世界〔恋愛〕</IonSelectOption>
                  <IonSelectOption value="201">ハイファンタジー</IonSelectOption>
                  <IonSelectOption value="202">ローファンタジー</IonSelectOption>
                  <IonSelectOption value="302">ヒューマンドラマ</IonSelectOption>
                  <IonSelectOption value="304">推理</IonSelectOption>
                  <IonSelectOption value="305">ホラー</IonSelectOption>
                  <IonSelectOption value="306">アクション</IonSelectOption>
                  <IonSelectOption value="307">コメディー</IonSelectOption>
                </IonSelect>
              </IonItem>
            </div>

            <div className="section">
              <p className="section-title">種別</p>

              <div className="chip-row">
                <IonChip
                  className={type === "all" ? "active-chip" : ""}
                  onClick={() => setType("all")}
                >
                  すべて
                </IonChip>

                <IonChip
                  className={type === "short" ? "active-chip" : ""}
                  onClick={() => setType("short")}
                >
                  短編
                </IonChip>

                <IonChip
                  className={type === "serial" ? "active-chip" : ""}
                  onClick={() => setType("serial")}
                >
                  連載
                </IonChip>
              </div>
            </div>

            <div className="section">
              <p className="section-title">完結区分</p>

              <div className="chip-row">
                <IonChip
                  className={completed === "all" ? "active-chip" : ""}
                  onClick={() => setCompleted("all")}
                >
                  すべて
                </IonChip>

                <IonChip
                  className={completed === "completed" ? "active-chip" : ""}
                  onClick={() => setCompleted("completed")}
                >
                  完結済み
                </IonChip>
              </div>
            </div>

            <div className="section">
              <p className="section-title">文字数</p>

              <IonSearchbar
                placeholder="最小文字数"
                value={minLength}
                onIonInput={(e) => setMinLength(e.detail.value ?? "")}
              />

              <IonSearchbar
                placeholder="最大文字数"
                value={maxLength}
                onIonInput={(e) => setMaxLength(e.detail.value ?? "")}
              />
            </div>

            <div className="bottom-space" />
          </IonContent>

          <IonFooter className="sheet-footer">
            <IonButton
              expand="block"
              className="search-button"
              onClick={searchNovelList}
            >
              <IonIcon icon={searchOutline} slot="start" />
              検索する
            </IonButton>
          </IonFooter>
        </IonModal>

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

const getGenreName = (genre?: number) => {
  const genres: Record<number, string> = {
    101: "異世界〔恋愛〕",
    102: "現実世界〔恋愛〕",
    201: "ハイファンタジー",
    202: "ローファンタジー",
    302: "ヒューマンドラマ",
    304: "推理",
    305: "ホラー",
    306: "アクション",
    307: "コメディー",
  };

  return genre ? genres[genre] ?? "その他" : "その他";
};

export default Tab2;