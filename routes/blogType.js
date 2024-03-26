var express = require("express");
const {
  addBlogTypeService,
  findAllBlogTypeService,
  findOneBlogTypeService,
  updateBlogTypeService,
  deleteBlogTypeService,
} = require("../services/blogTypeService");
var router = express.Router();

// 添加博客分类
router.post("/", async function (req, res, next) {
  res.send(await addBlogTypeService(req.body));
});
// 获取博客分类
router.get("/", async function (req, res, next) {
  res.send(await findAllBlogTypeService());
});
// 获取其中一个博客分类
router.get("/:id", async function (req, res, next) {
  res.send(await findOneBlogTypeService(req.params.id));
});
// 修改其中一个博客分类
router.put("/:id", async function (req, res, next) {
  res.send(await updateBlogTypeService(req.params.id, req.body));
});
// 删除其中一个博客分类
router.delete("/:id", async function (req, res, next) {
  res.send(await deleteBlogTypeService(req.params.id));
});

module.exports = router;
