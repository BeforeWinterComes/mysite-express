// 该文件负责对数据库进行初始化
const sequelize = require("./dbConnect"); // 数据库连接实例
const adminModel = require("./model/adminModel"); // 各种数据模型
const md5 = require("md5");

(async function () {
  // 将数据模型和表进行同步
  await sequelize.sync({
    alter: true,
  });
  // 同步完成后，有一些表是需要一些初始数据
  // 我们需要先查询这张表有没有内容，没有内容，我们才初始化数据
  const adminCount = await adminModel.count();
  if (!adminCount) {
    // 该表没有数据，初始化
    await adminModel.create({
      loginId: "admin",
      name: "超级管理员",
      loginPwd: md5("123456"),
    });
    console.log("初始化管理员数据完毕");
  }
  console.log("数据库数据准备完毕");
})();
