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
import { useHistory } from "react-router";
import { searchOutline, filterOutline, downloadOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { addToLibrary, addHistory, Novel } from "../data/novelstore";
import { addNovelToLibrary } from "../data/novelDB";
import "./Tab2.css";

const Tab2: React.FC = () => {
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
  const history = useHistory();
  const getRankingType = (range: string) => {
    const d = new Date();
    d.setDate(d.getDate() - 1);

    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    const date = `${y}${m}${day}`;

    if (range === "daily") return `${date}-d`;
    if (range === "weekly") return `${date}-w`;
    if (range === "monthly") return `${date}-m`;
    if (range === "quarter") return `${date}-q`;

    return "";
  };

  const fetchNovelDetailsByNcodes = async (ncodes: string[]) => {
    const params = new URLSearchParams({
      out: "json",
      lim: "30",
      ncode: ncodes.join("-"),
      of: "t-w-s-gp-nt-ga-n-k",
    });

    const res = await fetch(`/syosetu-api/novelapi/api/?${params.toString()}`);
    const text = await res.text();

    if (!res.ok || text.startsWith("Error")) {
      console.error(text);
      throw new Error("詳細取得に失敗しました");
    }

    return JSON.parse(text).slice(1);
  };

  const searchNovels = async () => {
    setLoading(true);

    try {
      if (range === "total") {
        const params = new URLSearchParams({
          out: "json",
          lim: "30",
          order: "hyoka",
          of: "t-w-s-gp-nt-ga-n-k",
        });

        const res = await fetch(
          `/syosetu-api/novelapi/api/?${params.toString()}`,
        );
        const data = await res.json();

        setNovels(data.slice(1));
        return;
      }

      const rtype = getRankingType(range);

      const rankParams = new URLSearchParams({
        out: "json",
        rtype,
      });

      const rankRes = await fetch(
        `/syosetu-api/rank/rankget/?${rankParams.toString()}`,
      );

      const rankText = await rankRes.text();

      if (!rankRes.ok || rankText.startsWith("Error")) {
        console.error(rankText);
        setToast("ランキング取得に失敗しました");
        return;
      }

      const rankData = JSON.parse(rankText);

      const ncodes = rankData.slice(0, 30).map((item: any) => item.ncode);

      const details = await fetchNovelDetailsByNcodes(ncodes);

      setNovels(details);
    } catch (e) {
      console.error(e);
      setToast("ランキング取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const addLibrary = async (novel: Novel) => {
    await addNovelToLibrary({
      ncode: novel.ncode.toLowerCase(),
      title: novel.title,
      writer: novel.writer,
      story: novel.story,
      general_all_no: novel.general_all_no ?? 1,
      downloaded: false,
      lastReadEpisode: 1,
    });

    setToast("ライブラリに追加しました");
  };

  const downloadNovel = (novel: Novel) => {
    addToLibrary(novel);
    setToast("ライブラリに保存しました");
  };

  const openNovel = (novel: Novel) => {
    addHistory(novel);
    window.open(`https://ncode.syosetu.com/${novel.ncode.toLowerCase()}/`);
  };

  useEffect(() => {
    searchNovels();
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
          onIonChange={(e) => {
            const value = String(e.detail.value);
            setRange(value);
          }}
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
              <div className="novel-row" key={novel.ncode}>
                <div className="rank-number">{index + 1}</div>

                <div
                  className="novel-main"
                  onClick={() =>
                    history.push(`/novel/${novel.ncode.toLowerCase()}`)
                  }
                >
                  <h2>{novel.title}</h2>
                  <p>
                    {novel.writer}・{getGenreName(novel.genre)}・
                    {((novel.global_point ?? 0) / 1000).toFixed(1)}k pt
                  </p>
                </div>

                <div className="right-area">
                  <span className="novel-badge">
                    {novel.novel_type === 1 ? "短編" : "連載"}
                  </span>

                  <IonButton fill="clear" onClick={() => downloadNovel(novel)}>
                    <IonIcon icon={downloadOutline} />
                  </IonButton>
                </div>
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
                  <IonSelectOption value="102">
                    現実世界〔恋愛〕
                  </IonSelectOption>
                  <IonSelectOption value="201">
                    ハイファンタジー
                  </IonSelectOption>
                  <IonSelectOption value="202">
                    ローファンタジー
                  </IonSelectOption>
                  <IonSelectOption value="302">
                    ヒューマンドラマ
                  </IonSelectOption>
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
                {[
                  ["all", "すべて"],
                  ["short", "短編"],
                  ["serial", "連載"],
                ].map(([value, label]) => (
                  <IonChip
                    key={value}
                    className={type === value ? "active-chip" : ""}
                    onClick={() => setType(value)}
                  >
                    {label}
                  </IonChip>
                ))}
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
              onClick={searchNovels}
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

  return genre ? (genres[genre] ?? "その他") : "その他";
};

export default Tab2;
