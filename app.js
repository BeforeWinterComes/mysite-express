var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const dotenv = require("dotenv");
var { expressjwt: expressJWT } = require("express-jwt");
const { ForbiddenError } = require("./utils/errors");

// 使用.env中的环境变量
dotenv.config();
// 引入数据库连接
require("./dao/db");
// 引入路由
var adminRouter = require("./routes/admin");
const md5 = require("md5");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// 配置验证token接口
app.use(
  expressJWT({
    secret: md5(process.env.JWT_SECRET),
    algorithms: ["HS256"], // 新版本jwt要求必须指定算法
  }).unless({
    // 需要排出的token验证的路由
    path: [{ url: "/api/admin/login", methods: ["POST"] }],
  })
);
app.use("/api/admin", adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    // 说明是token验证错误，接下来抛出自定义错误
    res.send(new ForbiddenError("未登录或者登录过期").toResponseJSON());
  }
});

module.exports = app;
