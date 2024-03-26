var express = require("express");
var router = express.Router();
const { getCaptchaService } = require("../services/captchaService");

//登录
router.get("/", async function (req, res, next) {
  // 生成一个验证码
  const captcha = await getCaptchaService();
  req.session.captcha = captcha.text;
  // 设置响应头
  res.setHeader("content-type", "image/svg+xml");
  res.send(captcha.data);
});

module.exports = router;
