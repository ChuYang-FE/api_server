const express = require("express");

const router = express.Router();

// 注册
router.post("/reguser", (req, res) => {
  res.send("reguser ok");
});

// 登录
router.post("/login", (req, res) => {
  res.send("login ok");
})

// 将路由对象共享出去
module.exports = router;
