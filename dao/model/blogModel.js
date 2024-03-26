const { DataTypes } = require("sequelize");
const sequelize = require("../dbConnect");

// 定义数据模型
module.exports = sequelize.define(
  "blog",
  {
    // 这张表有哪些字段
    //标题
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // 描述
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // 目录
    toc: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // 文章正文
    htmlContent: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // 缩略图
    thumb: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // 浏览数
    scanNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // 评论数
    commentNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // 时间戳
    createDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
  }
);
