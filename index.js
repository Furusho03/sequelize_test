const express = require("express");
const { Sequelize, Model, DataTypes } = require("sequelize");
require("dotenv").config();
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();

app.use(cors());

const PORT = process.env.PORT || 5000;
const DB_NAME = process.env.DATABASE_NAME;
const DB_USERNAME = process.env.DATABASE_USERNAME;
const DB_PASSWORD = process.env.DATABASE_PASSWORD;
const DB_PORT = process.env.DATABASE_PORT;
const DB_HOST = process.env.DATABASE_HOST;
const DB_DIALECT = process.env.DATABASE_DIALECT;

// デーバベース設定
const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  port: DB_PORT,
  host: DB_HOST,
  dialect: DB_DIALECT,
  // logging: (...msg) => console.log(msg),
});

// 接続テスト
const connection = async () => {
  try {
    await sequelize.authenticate();
    console.log("データベースに接続しました");
  } catch (error) {
    console.error("データベースとの接続に失敗しました:", error);
  }
};
connection();

// モデル
const Users = sequelize.define(
  "Users",
  {
    username: DataTypes.STRING,
    age: DataTypes.INTEGER,
    password: DataTypes.STRING,
  },
  {
    tableName: "users",
  }
);

// データを追加する
const create = async () => {
  const user = Users.create({
    username: "涼太郎",
    age: 26,
    password: "password",
  });
  console.log(JSON.stringify(user, null, 4));
};
// create();

// すべてのユーザーデータ
const userFindAll = async () => {
  const users = await Users.findAll();
  console.log("All Users:", JSON.stringify(users, null, 2));
};
// userFindAll();

// サインアップテスト
const userSignUp = () => {
  bcrypt.genSalt(8, (error, salt) => {
    bcrypt.hash("password", salt, (error, hash) => {
      console.log(hash);
      Users.create({
        username: "John3",
        age: 26,
        password: hash,
      });
    });
  });
};
// userSignUp();

const checkPassword = (plainTextPassword, password) => {
  bcrypt.compare(plainTextPassword, password, (err, result) => {
    if(err) {
      console.log(err)
    }
    console.log(result);
  });
};

const userSignIn = async () => {
  const user = await Users.findByPk(34);
  checkPassword('password',user.password)
};
userSignIn ()

// Express.js の　ルート
app.get("/", async (req, res) => {
  const users = await Users.findAll({
    attributes: ["id", "username", "age", "password"],
  });
  console.log("All Users:", JSON.stringify(users, null, 2));
  res.status(200).json(users);
});

app.get("/user/:id", async (req, res) => {
  const id = req.params.id;
  const user = await Users.findByPk(id, {
    attributes: ["id", "username", "age", "password"],
  });
  console.log(user);
  console.log("User:", JSON.stringify(user, null, 2));
  res.status(200).json(user);
});

// サーバー
app.listen(PORT, () => {
  console.log(`サーバー稼働中 PORT ${PORT}`);
});
