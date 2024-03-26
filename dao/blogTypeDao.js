const blogTypeModel = require("./model/blogTypeModel");

// 添加博客分类
const addBlogTypeDao = async (newBlogTypeInfo) => {
  const { dataValues } = await blogTypeModel.create(newBlogTypeInfo);
  return dataValues;
};

// 查询所有博客分类
const findAllBlogTypeDao = async () => {
  const res = await blogTypeModel.findAll();
  return res;
};
// 获取其中一个博客分类
const findOneBlogTypeDao = async (id) => {
  return await blogTypeModel.findAll({
    where: {
      id,
    },
  });
};

// 修改其中一个博客分类
const updateBlogTypeDao = async (id, blogTypeInfo) => {
  await blogTypeModel.update(blogTypeInfo, {
    where: {
      id,
    },
  });
  return findOneBlogTypeDao(id);
};

// 删除其中一个博客分类
const deleteBlogTypeDao = async (id) => {
  return await blogTypeModel.destroy({
    where: {
      id,
    },
  });
};

module.exports = {
  addBlogTypeDao,
  findAllBlogTypeDao,
  findOneBlogTypeDao,
  updateBlogTypeDao,
  deleteBlogTypeDao,
};
