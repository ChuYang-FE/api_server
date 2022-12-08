const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.use(express.urlencoded({ extended: false }));

app.listen(3007, () => {
  console.log("api server is running at http://127.0.0.1:3007");
});