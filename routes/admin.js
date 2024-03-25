var express = require("express");
var router = express.Router();

const { loginService } = require("../services/adminServices");
/* GET users listing. */
router.post("/login", function (req, res, next) {
  // 首先应该有一个验证码的验证
  loginService(req.body);
});

module.exports = router;
