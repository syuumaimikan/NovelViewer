const express = require("express");
const { downloadNovelAll } = require("../services/novelService");

const router = express.Router();

router.get("/:ncode", async (req, res) => {
  try {
    const data = await downloadNovelAll(req.params.ncode);
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: "download failed"
    });
  }
});

module.exports = router;