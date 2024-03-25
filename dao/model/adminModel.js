const { DataTypes } = require("sequelize");
const sequelize = require("../dbConnect");

// 定义数据模型
module.exports = sequelize.define(
  "admin",
  {
    // 这张表有哪些字段
    loginId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    loginPwd: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
  }
);
