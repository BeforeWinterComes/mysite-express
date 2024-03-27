const { ValidationError } = require("../utils/errors");
const validate = require("validate.js");
const {
  formatResponse,
  handleDataPattern,
  handleTOC,
} = require("../utils/tool");
const blogTypeModel = require("../dao/model/blogTypeModel");
const {
  addBlogDao,
  findBlogByPageDao,
  findOneBlogDao,
  updateBlogDao,
  deleteBlogDao,
} = require("../dao/blogDao");
const { addBlogToType, findOneBlogTypeDao } = require("../dao/blogTypeDao");
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
  // 经过handleTOC处理之后，现在的TOC就是我们想要的模式
  newBlogInfo = handleTOC(newBlogInfo);
  // 接下来，我们将处理好的toc格式转化为字符串
  newBlogInfo.toc = JSON.stringify(newBlogInfo.toc);
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
module.exports.findOneBlogService = async function (id, auth) {
  const data = await findOneBlogDao(id);
  // 首先重新处理toc
  data.dataValues.toc = JSON.parse(data.dataValues.toc);
  // 根据auth是否有值决定浏览数是否自增
  if (!auth) {
    data.scanNumber++;
    await data.save();
  }
  return formatResponse(0, "", data.dataValues);
};
// 修改其中一个博客
module.exports.updateBlogService = async function (id, blogInfo) {
  // 首先判断正文内容有没有改变，因为正文改变可能会影响toc目录
  if (blogInfo.htmlContent && blogInfo.toc) {
    // 文章正文改变，需要重新处理toc目录
    blogInfo.toc = JSON.parse(blogInfo.toc);
  }
  const { dataValues } = await updateBlogDao(id, blogInfo);
  return formatResponse(0, "", dataValues);
};
// 删除其中一个博客
module.exports.deleteBlogService = async function (id) {
  // 根据id查询到该文章的信息
  const data = await findOneBlogDao(id);
  // 需要将该文章对应分类递减
  const categoryInfo = await findOneBlogTypeDao(data.dataValues.categoryId);
  categoryInfo.articleCount--;
  console.log("123", categoryInfo);
  await categoryInfo.save();
  // 删除该文章下所有评论
  // 删除文章
  await deleteBlogDao(id);
  return formatResponse(0, "", true);
};
