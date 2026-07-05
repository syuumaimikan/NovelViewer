const express = require("express");
const { getRankingCached } = require("../services/novelService");

const router = express.Router();

router.get("/:type", async (req, res) => {
  try {
    const data = await getRankingCached(req.params.type);
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: "ranking fetch failed"
    });
  }
});

module.exports = router;