const { findBannerDao, updateBannerDao } = require("../dao/bannerDao");
const { handleDataPattern, formatResponse } = require("../utils/tool");
// 查询首页标语
module.exports.findBannerService = async function () {
  return formatResponse(0, "", handleDataPattern(await findBannerDao()));
};

// 批量更新首页标语
module.exports.updateBannerService = async function (bannerArr) {
  return formatResponse(0, "", await updateBannerDao(bannerArr));
};
