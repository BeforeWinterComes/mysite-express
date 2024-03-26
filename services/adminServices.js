// 逻辑层
const md5 = require("md5");
const { loginDao, updateAdminDao } = require("../dao/adminDao");
const jwt = require("jsonwebtoken");
const { ValidationError } = require("../utils/errors");
const { formatResponse } = require("../utils/tool");
// admin 模块的业务逻辑层

// 登录
module.exports.loginService = async function (loginInfo) {
  loginInfo.loginPwd = md5(loginInfo.loginPwd);
  // 进行数据验证，查询数据库看有没有
  let data = await loginDao(loginInfo);
  if (data && data.dataValues) {
    //添加token
    data = {
      id: data.dataValues.id,
      loginId: data.dataValues.loginId,
      name: data.dataValues.name,
    };
    var loginPeriod = null;
    if (loginInfo.remember) {
      // 如果用户勾选了几天过期，则remember用这个，否则为1天
      loginPeriod = parseInt(loginInfo.remember);
    } else {
      loginPeriod = 1;
    }
    const token = jwt.sign(data, md5(process.env.JWT_SECRET), {
      expiresIn: 60 * 60 * 24 * loginPeriod,
    });
    return {
      token,
      data,
    };
  }
  return { data };
};

// 更新
module.exports.updateAdminService = async function (accountInfo) {
  const { loginId, name, loginPwd, oldLoginPwd } = accountInfo;
  // 1. 根据账号信息查询对应用户（使用的旧密码）
  const adminInfo = await loginDao({
    loginId: loginId,
    loginPwd: md5(oldLoginPwd),
  });
  // 2. 分两种情况，有用户信息和没有
  if (adminInfo && adminInfo.dataValues) {
    // 说明密码正确
    const newPassword = md5(loginPwd);
    await updateAdminDao({
      name,
      loginId,
      loginPwd: newPassword,
    });
    return formatResponse(0, "", {
      loginId,
      name,
    });
  } else {
    // 旧密码不正确，抛出自定义错误
    throw new ValidationError("旧密码不正确");
  }
};
