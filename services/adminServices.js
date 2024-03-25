const md5 = require("md5");
const { loginDao } = require("../dao/adminDao");
const jwt = require("jsonwebtoken");
// admin 模块的业务逻辑层
module.exports.loginService = async function (loginInfo) {
  loginInfo.loginPwd = md5(loginInfo.loginPwd);
  // 进行数据验证，查询数据库看有没有
  let data = await loginDao(loginInfo);
  if (data && data.dataValues) {
    //添加token
    data = data.dataValues;
    var loginPeriod = null;
    if (loginInfo.remember) {
      // 如果用户勾选了几天过期，则remember用这个，否则为1天
      loginPeriod = parseInt(loginInfo.remember);
    } else {
      loginPeriod = 1;
    }
    const token = jwt.sign(
      {
        id: data.id,
        loginId: data.loginId,
        name: data.name,
      },
      md5(process.env.JWT_SECRET),
      { expiresIn: 60 * 60 * 24 * loginPeriod }
    );
    console.log("看一下token", token);
  }
  return { data };
};
