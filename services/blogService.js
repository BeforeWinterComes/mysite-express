const { ValidationError } = require("../utils/errors");
const validate = require("validate.js");
const { formatResponse, handleDataPattern } = require("../utils/tool");
const blogTypeModel = require("../dao/model/blogTypeModel");
const { addBlogDao, findBlogByPageDao } = require("../dao/blogDao");
const { addBlogToType } = require("../dao/blogTypeDao");
// 扩展验证规则
validate.validators.categoryIdIsExit = async (value) => {
  const blogTypeInfo = blogTypeModel.findByPk(value);
  if (blogTypeInfo) {
    return;
  }
  return "所属分类不存在";
};
// 新增博客
module.exports.addBlogService = async function (newBlogInfo) {
  // 首先处理doc
  // 接下来，我们将处理好的toc格式转化为字符串
  newBlogInfo.toc = JSON.stringify('["a": "b"]');
  // 初始化新文章的其他信息
  newBlogInfo.scanNumber = 0; // 阅读初始量为0
  newBlogInfo.commentNumber = 0; // 评论初始量为0
  // 定义验证规则
  const blogRule = {
    title: {
      presence: {
        allowEmpty: false,
      },
      type: "string",
    },
    description: {
      presence: {
        allowEmpty: true,
      },
      type: "string",
    },
    toc: {
      presence: {
        allowEmpty: true,
      },
      type: "string",
    },
    htmlContent: {
      presence: {
        allowEmpty: false,
      },
      type: "string",
    },
    thumb: {
      presence: {
        allowEmpty: true,
      },
      type: "string",
    },
    scanNumber: {
      presence: {
        allowEmpty: false,
      },
      type: "integer",
    },
    commentNumber: {
      presence: {
        allowEmpty: false,
      },
      type: "integer",
    },
    createDate: {
      presence: {
        allowEmpty: false,
      },
      type: "integer",
    },
    categoryId: {
      presence: {
        allowEmpty: false,
      },
      type: "integer",
      categoryIdIsExit: true,
    },
  };
  // 接下来对传递过来的数据进行验证
  try {
    // 因为扩展的验证规则中涉及到异步操作，所以这里要采用异步的验证方式
    const res = await validate.async(newBlogInfo, blogRule);
    // 接下来还有一个工作，文章新增了，对应的文章所属分类也要新增
    await addBlogToType(newBlogInfo.categoryId);
    const data = await addBlogDao(newBlogInfo);
    return formatResponse(0, "", data);
  } catch (error) {
    // 验证未通过
    throw new ValidationError("数据验证失败");
  }
};
// 分页查询博客
module.exports.findBlogByPageService = async function (pageInfo) {
  const data = await findBlogByPageDao(pageInfo);
  const rows = handleDataPattern(data.rows);
  // 针对toc做还原的操作
  rows.forEach((item) => (item.toc = JSON.parse(item.toc)));
  return formatResponse(0, "", {
    total: data.count,
    rows: rows,
  });
};
// 获取其中一个博客
module.exports.findOneBlogService = async function (id) {
  return formatResponse(0, "", handleDataPattern(await findOneBlogDao(id)));
};
// 修改其中一个博客
module.exports.updateBlogService = async function (id, blogInfo) {
  return formatResponse(
    0,
    "",
    handleDataPattern(await updateBlogDao(id, blogInfo))
  );
};
// 删除其中一个博客
module.exports.deleteBlogService = async function (id) {
  await deleteBlogDao(id);
  // 这里需要返回受影响文章数量
  return formatResponse(0, "", true);
};
