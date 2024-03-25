var express = require("express");
var router = express.Router();
var { formatResponse, analysisToken } = require("../utils/tool");

const { loginService } = require("../services/adminServices");
//登录
router.post("/login", async function (req, res, next) {
  // 首先应该有一个验证码的验证
  const result = await loginService(req.body);
  if (result.token) {
    res.setHeader("authentication", result.token);
  }
  res.send(formatResponse(0, "", result.data));
});

// 恢复登陆状态
router.get("/whoami", async function (req, res, next) {
  // 从客户端的请求拿到token,解析
  const token = analysisToken(req.get("Authorization"));
  // console.log(token);
  // 返回给客户端
  res.send(
    formatResponse(0, "", {
      loginId: token.loginId,
      name: token.name,
      id: token.id,
    })
  );
});

module.exports = router;
