const {
  addBlogTypeDao,
  findAllBlogTypeDao,
  findOneBlogTypeDao,
  updateBlogTypeDao,
  deleteBlogTypeDao,
} = require("../dao/blogTypeDao");
const { ValidationError } = require("../utils/errors");
const validate = require("validate.js");
const { formatResponse, handleDataPattern } = require("../utils/tool");
const { handle } = require("express/lib/router");

// 新增博客分类
module.exports.addBlogTypeService = async function (newBlogTypeInfo) {
  //数据验证规则,防止是通过postman注入
  const blogTypeRule = {
    name: {
      presence: {
        allowEmpty: false,
      },
      type: "string",
    },
  };
  // 进行数据验证
  const validateResult = validate.validate(newBlogTypeInfo, blogTypeRule);
  if (!validateResult) {
    // 验证通过
    newBlogTypeInfo.articleCount = 0; // 因为是新增的文章分类，所以一开始文章数量为0
    const data = await addBlogTypeDao(newBlogTypeInfo);
    return formatResponse(0, "", data);
  } else {
    throw new ValidationError("数据验证失败");
  }
};
// 查询所有博客分类
module.exports.findAllBlogTypeService = async function () {
  const obj = formatResponse(
    0,
    "",
    handleDataPattern(await findAllBlogTypeDao())
  );
  obj.data.sort((a, b) => a.order - b.order);
  return obj;
};
// 获取其中一个博客分类
module.exports.findOneBlogTypeService = async function (id) {
  return formatResponse(0, "", handleDataPattern(await findOneBlogTypeDao(id)));
};
// 修改其中一个博客分类
module.exports.updateBlogTypeService = async function (id, blogTypeInfo) {
  return formatResponse(
    0,
    "",
    handleDataPattern(await updateBlogTypeDao(id, blogTypeInfo))
  );
};
// 删除其中一个博客分类
module.exports.deleteBlogTypeService = async function (id) {
  await deleteBlogTypeDao(id);
  // 这里需要返回受影响文章数量
  return formatResponse(0, "", true);
};
