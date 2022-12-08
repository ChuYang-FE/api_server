const express = require("express");
const router = express.Router();

const userHandle = require("../router_handle/user");

// 1. 导入验证表单数据的中间件
const expressJoi = require("@escook/express-joi");
// 2. 导入需要的验证规则对象
const { reg_login_schema } = require("../schema/user");

const { regUser, login } = userHandle;

// 注册
router.post("/reguser", expressJoi(reg_login_schema), regUser);

// 登录
router.post("/login", login);

// 将路由对象共享出去
module.exports = router;
