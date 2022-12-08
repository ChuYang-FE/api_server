const express = require("express");
const cors = require("cors");
const joi = require("joi");
const expressJoi = require("@escook/express-joi");

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

// 错误中间件
app.use(function (err, req, res, next) {
  // 数据验证失败
  if (err instanceof joi.ValidationError) return res.customSend(err);
  // 未知错误
  res.customSend(err);
});

const userRouter = require("./router/user");
app.use("/api", userRouter);

app.listen(3007, () => {
  console.log("api server is running at http://127.0.0.1:3007");
});
