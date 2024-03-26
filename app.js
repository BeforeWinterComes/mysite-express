var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const dotenv = require("dotenv");
const session = require("express-session");
var { expressjwt: expressJWT } = require("express-jwt");
//引入该模块后，就可以在 Express 路由处理函数中直接使用异步函数，并在其中抛出错误，Express 会自动捕获这些错误并交给错误处理中间件处理
require("express-async-errors");
const {
  ForbiddenError,
  UnknownError,
  ServiceError,
} = require("./utils/errors");

// 使用.env中的环境变量
dotenv.config();
// 引入数据库连接
require("./dao/db");
// 引入路由
var adminRouter = require("./routes/admin");
var captchaRouter = require("./routes/captcha");
var bannerRouter = require("./routes/banner");
const md5 = require("md5");

var app = express();
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

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
    path: [
      { url: "/api/admin/login", methods: ["POST"] },
      { url: "/res/captcha", methods: ["GET"] },
    ],
  })
);
app.use("/api/admin", adminRouter);
app.use("/res/captcha", captchaRouter);
app.use("/api/banner", bannerRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.log("err", err);
  if (err.name === "UnauthorizedError") {
    // 说明是token验证错误，接下来抛出自定义错误
    res.send(new ForbiddenError("未登录或者登录过期").toResponseJSON());
  } else if (err instanceof ServiceError) {
    res.send(err.toResponseJSON());
  } else {
    res.send(new UnknownError().toResponseJSON());
  }
});

module.exports = app;
