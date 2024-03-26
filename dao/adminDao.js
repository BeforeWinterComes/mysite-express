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

// 更新管理员
module.exports.updateAdminDao = async function (newAccountInfo) {
  return await adminModal.update(newAccountInfo, {
    where: {
      loginId: newAccountInfo.loginId,
    },
  });
};
