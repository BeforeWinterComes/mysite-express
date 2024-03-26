var express = require("express");
var router = express.Router();
const {
  findBannerService,
  updateBannerService,
} = require("../services/bannerService");

// 获取首页标语
router.get("/", async function (req, res, next) {
  res.send(await findBannerService());
});
// 设置首页标语
router.post("/", async function (req, res, next) {
  res.send(await updateBannerService(req.body));
});
module.exports = router;
