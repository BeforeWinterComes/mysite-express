// 负责和数据库交互
const adminModal = require("./model/adminModel");
//登录
module.exports.loginDao = async function (loginInfo) {
  return await adminModal.findOne({
    where: {
      loginId: loginInfo.loginId,
      loginPwd: loginInfo.loginPwd,
    },
  });
};
