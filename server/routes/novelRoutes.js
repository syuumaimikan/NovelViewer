const express = require("express");
const {
  getNovelInfoCached,
  getEpisodeCached
} = require("../services/novelService");

const router = express.Router();

router.get("/:ncode", async (req, res) => {
  try {
    const data = await getNovelInfoCached(req.params.ncode);

    if (!data) {
      return res.status(404).json({
        error: "novel not found"
      });
    }

    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: "novel fetch failed"
    });
  }
});

router.get("/:ncode/:episodeNo", async (req, res) => {
  try {
    const data = await getEpisodeCached(
      req.params.ncode,
      req.params.episodeNo
    );

    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: "episode fetch failed"
    });
  }
});

module.exports = router;