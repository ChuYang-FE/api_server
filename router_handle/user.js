const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");

exports.regUser = (req, res) => {
  const { username, password } = req.body;

  // 查询是否被占用
  const sqlStr = "select * from ev_users where username=?";
  db.query(sqlStr, username, (err, results) => {
    if (err) return res.customSend(err);

    // 被占用
    if (results.length > 0) return res.customSend("用户名被占用，请变更！");

    const cryPwd = bcrypt.hashSync(password);
    const insertSql = "insert into ev_users set ?";
    db.query(
      insertSql,
      {
        username,
        password: cryPwd,
      },
      (err, results) => {
        if (err) return res.customSend(err);
        if (results.affectedRows !== 1) return res.customSend("注册失败！");

        res.customSend("注册成功！", 0);
      }
    );
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  // 查询是否被占用
  const sqlStr = "select * from ev_users where username=?";
  db.query(sqlStr, username, (err, results) => {
    if (err) return res.customSend(err);

    if (results.length !== 1) return res.customSend("登录失败！");

    const pwdCorrect = bcrypt.compareSync(password, results[0].password);
    if (!pwdCorrect) return res.customSend("密码错误！");

    // 剔除密码等敏感信息
    const user = { ...results[0], password: "", user_pic: "" };

    // 生成 Token 字符串
    const tokenStr = jwt.sign(user, config.jwtSecretKey, {
      expiresIn: config.expiresIn,
    });
    res.send({
      status: 0,
      message: "登录成功！",
      token: "Bearer " + tokenStr,
    });
  });
};
