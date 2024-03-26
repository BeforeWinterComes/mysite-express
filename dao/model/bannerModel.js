const { DataTypes } = require("sequelize");
const sequelize = require("../dbConnect");

// 定义数据模型
module.exports = sequelize.define(
  "banner",
  {
    // 这张表有哪些字段
    midImg: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bigImg: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
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
