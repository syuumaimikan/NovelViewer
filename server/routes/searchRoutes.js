const express = require("express");
const { searchNovelsCached } = require("../services/novelService");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const data = await searchNovelsCached(req.query);
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: "search failed"
    });
  }
});

module.exports = router;