const jwt = require("jsonwebtoken");
const md5 = require("md5");
const multer = require("multer");
const path = require("path");
var toc = require("markdown-toc");
// 格式化响应数据
module.exports.formatResponse = function (code, msg, data) {
  return {
    code: code,
    msg: msg,
    data: data,
  };
};

// 解析token
module.exports.analysisToken = function (token) {
  return jwt.verify(token.split(" ")[1], md5(process.env.JWT_SECRET));
};

// 处理数组类型的响应数据
module.exports.handleDataPattern = function (data) {
  const arr = [];
  for (const i of data) {
    arr.push(i.dataValues);
  }
  return arr;
};
// 设置上传文件的引擎
const storage = multer.diskStorage({
  // 文件存储的位置
  destination: function (req, file, cb) {
    cb(null, __dirname + "/../public/static/uploads");
  },
  // 上传到服务器的文件，文件名要做单独处理
  filename: function (req, file, cb) {
    // 获取文件名
    const basename = path.basename(
      file.originalname,
      path.extname(file.originalname)
    );
    // 获取后缀名
    const extname = path.extname(file.originalname);
    // 构建新的名字
    const newName =
      basename +
      new Date().getTime() +
      Math.floor(Math.random() * 9000 + 10) +
      extname;
    cb(null, newName);
  },
});

module.exports.uploading = multer({
  storage: storage,
  limits: {
    fileSize: 2000000,
    files: 1,
  },
});

// 处理toc
module.exports.handleTOC = function (info) {
  let result = toc(info.markdownContent).json;
  // [
  //   {
  //     content: "xxx",
  //     slug: "xxx",
  //     lvl: 2,
  //     i: 0,
  //     seen: 0,
  //   },
  // ];
  // 接下来将上方一维数组转化为树
  function transfer(flatArr) {
    const stack = []; // 模拟栈
    const result = [];
    function createTOCItem(item) {
      return {
        name: item.content,
        anchor: item.slug,
        level: item.lvl,
        children: [],
      };
    }
    function handleItem(item) {
      const top = stack[stack.length - 1]; // 拿到最后一项
      if (!top) {
        stack.push(item);
      } else if (item.level > top.level) {
        // 进入该分支，说明当前的toc对象等级比上一个大，它该成为上一个toc的子元素
        top.children.push(item);
        stack.push(item);
      } else {
        stack.pop();
        handleItem(item);
      }
    }
    let min = 6; // 标题最小的级别
    // 该for循环用于寻找当前数组中最小的标题等级
    for (const i of flatArr) {
      if (i.lvl < min) {
        min = i.lvl;
      }
    }
    for (const item of flatArr) {
      const tocItem = createTOCItem(item);
      if (tocItem.level === min) {
        // 如果进入，说明当前的toc已是最低等级，不会成为其他的children
        result.push(tocItem);
      }
      // 如果不进入上方的if，说明该toc对象不是最低等级，可能是其他toc对象children数组中的一员
      handleItem(tocItem);
    }
  }
  // 经过转换之后，输出最终树形格式
  info.toc = transfer(result);
  delete info.markdownContent;
  // 接下来为每个标题添加id，做锚点
  for (const i of result) {
    switch (i.lvl) {
      case 1: {
        var newStr = `<h1 id="${i.slug}">`;
        info.htmlContent = info.htmlContent.replace("<h1>", newStr);
        break;
      }
      case 2: {
        var newStr = `<h2 id="${i.slug}">`;
        info.htmlContent = info.htmlContent.replace("<h2>", newStr);
        break;
      }
      case 3: {
        var newStr = `<h3 id="${i.slug}">`;
        info.htmlContent = info.htmlContent.replace("<h3>", newStr);
        break;
      }
      case 4: {
        var newStr = `<h4 id="${i.slug}">`;
        info.htmlContent = info.htmlContent.replace("<h4>", newStr);
        break;
      }
      case 5: {
        var newStr = `<h5 id="${i.slug}">`;
        info.htmlContent = info.htmlContent.replace("<h5>", newStr);
        break;
      }
      case 6: {
        var newStr = `<h6 id="${i.slug}">`;
        info.htmlContent = info.htmlContent.replace("<h6>", newStr);
        break;
      }
    }
  }
  return info;
};
