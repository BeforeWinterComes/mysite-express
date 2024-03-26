const bannerModal = require("./model/bannerModal");

// 数据库查询首页标语
const findBannerDao = async () => {
  return await bannerModal.findAll();
};

// 批量更新首页标语
const updateBannerDao = async (bannerArr) => {
  await bannerModal.destroy({
    truncate: true,
  });
  await bannerModal.bulkCreate(bannerArr);
  return await findBannerDao();
};

module.exports = { findBannerDao, updateBannerDao };
