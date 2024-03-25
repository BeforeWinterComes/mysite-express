// 该文件负责链接数据库
const { Sequelize } = require("sequelize");

// 创建数据库连接
const sequelize = new Sequelize("mysite", "root", "zhang776366255", {
  host: "localhost",
  dialect: "mysql",
  logging: false, // 生成的sql语句不会再控制台显示
});
// 向外暴露链接实例
module.exports = sequelize;
