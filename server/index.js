const express = require("express");
const cors = require("cors");
const { PORT } = require("./config/env");

const rankingRoutes = require("./routes/rankingRoutes");
const searchRoutes = require("./routes/searchRoutes");
const novelRoutes = require("./routes/novelRoutes");
const downloadRoutes = require("./routes/downloadRoutes");

const app = express();

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

app.use("/api/ranking", rankingRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/novel", novelRoutes);
app.use("/api/download", downloadRoutes);

app.get("/", (req, res) => {
  res.json({ message: "NovelViewer Backend is running" });
});

app.listen(PORT, () => {
  console.log(`NovelViewer Backend: http://localhost:${PORT}`);
});
