const blogModel = require("./model/blogModel");
const blogTypeModel = require("./model/blogTypeModel");

// 添加博客
const addBlogDao = async (newBlogInfo) => {
  const { dataValues } = await blogModel.create(newBlogInfo);
  return dataValues;
};

// 分页查询博客
const findBlogByPageDao = async (pageInfo) => {
  if (pageInfo.categoryId) {
    // 根据分类信息查询
    return await blogModel.findAndCountAll({
      include: [
        {
          model: blogTypeModel,
          as: "category",
          where: {
            id: pageInfo.categoryId,
          },
        },
      ],
      offset: (pageInfo.page * 1 - 1) * pageInfo.limit,
      limit: pageInfo.limit * 1,
    });
  } else {
    // 直接根据分页查询
    return await blogModel.findAndCountAll({
      include: [
        {
          model: blogTypeModel,
          as: "category",
        },
      ],
      offset: (pageInfo.page * 1 - 1) * pageInfo.limit,
      limit: pageInfo.limit * 1,
    });
  }
};
// 获取其中一个博客
const findOneBlogDao = async (id) => {
  return await blogModel.findAll({
    where: {
      id,
    },
  });
};

// 修改其中一个博客
const updateBlogDao = async (id, blogInfo) => {
  await blogModel.update(blogInfo, {
    where: {
      id,
    },
  });
  return findOneBlogDao(id);
};

// 删除其中一个博客
const deleteBlogDao = async (id) => {
  return await blogModel.destroy({
    where: {
      id,
    },
  });
};

module.exports = {
  addBlogDao,
  findBlogByPageDao,
  findOneBlogDao,
  updateBlogDao,
  deleteBlogDao,
};
