var express = require("express");
const { uploading, formatResponse } = require("../utils/tool");
const multer = require("multer");
const { UploadError } = require("../utils/errors");
var router = express.Router();

//上传
router.post("/", async function (req, res, next) {
  // single中书写上传控件的name值
  uploading.single("file")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      next(new UploadError("上传文件失败，请检查文件大小，2M以内"));
    } else {
      const path = "/static/uploads/" + req.file.filename;
      res.send(formatResponse(0, "", path));
    }
  });
});

module.exports = router;
