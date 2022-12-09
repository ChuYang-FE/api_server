const express = require("express");
const cors = require("cors");
const joi = require("joi");
const config = require("./config");
const userRouter = require("./router/user");

// 解析 token 的中间件
const expressJWT = require("express-jwt");

const app = express();
app.use(cors());

// for application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// 自定义.Send
app.use((req, res, next) => {
  // status： 成功 0， 失败 1
  res.customSend = (msg, status = 1) => {
    res.send({
      status,
      message: msg instanceof Error ? msg.message : msg,
    });
  };
  next();
});

// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(
  expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] })
);

app.use("/api", userRouter);

// 错误中间件
app.use(function (err, req, res, next) {
  // 数据验证失败
  if (err instanceof joi.ValidationError) return res.customSend(err);
  if (err.name === "UnauthorizedError") return res.customSend("身份认证失败！");
  // 未知错误
  res.customSend(err);
});

app.listen(3007, () => {
  console.log("api server is running at http://127.0.0.1:3007");
});
