import express from "express";

import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import multer from "multer";

import { db } from "./db.js";
import bycript from "bcrypt";

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////REGISTER

app.post("/api/auth/register", (req, res) => {
  //check existing user

  const q = "SELECT*FROM users WHERE email=? OR username=?";
  db.query(q, [req.body.email, req.body.username], (err, data) => {
    if (err) return res.json(err);
    if (data.length) return res.status(409).json("user already exist");
    //hash

    const salt = bycript.genSaltSync(10);
    const hash = bycript.hashSync(req.body.password, salt);

    //register user into database

    const q = "INSERT INTO users(`username`,`email`,`password`) VALUES(?)";
    const values = [req.body.username, req.body.email, hash];
    db.query(q, [values], (err) => {
      if (err) return res.json(err);
      return res.status(200).json("user has been created");
    });
  });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////LOGIN
app.post("/api/auth/login", (req, res) => {
  //check user existing

  const q = "SELECT*FROM users WHERE username=?";
  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.json(err);
    if (data.length === 0) return res.status(404).json("user not found");
    // check password

    const isPasswordCorrect = bycript.compareSync(
      req.body.password,
      data[0].password
    );

    if (!isPasswordCorrect)
      return res.status(400).json("incorrect username or password");

    const token = jwt.sign({ id: data[0].id }, "jwtkey");

    const { password, ...others } = data[0];

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////LOGOUT
app.post("/api/auth/logout", (req, res) => {
  res
    .clearCookie("access_token", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .json("user logged out");
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////POST
app.get("/api/posts", (req, res) => {
  const q = "SELECT *FROM posts";

  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json(data);
  });
});

app.get("/api/posts/:id", (req, res) => {
  const id = req.params.id;
  const q =
    "SELECT `username`,`title`,`desc`,u.img AS userImage,`cat`,`date`,`uid`,`imge` FROM users u JOIN posts p ON u.id=p.uid WHERE p.id=?";
  db.query(q, [id], (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json(data[0]);
  });
});

app.post("/api/posts", (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("not authorized");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("token not valid");

    const q =
      "INSERT INTO posts ('title','desc','imge','cat','date','uid') VALUES (?)";
    const values = [
      req.body.title,
      req.body.desc,
      req.body.img,
      req.body.cat,
      req.body.date,
      userInfo.id,
    ];
    db.query(q, [values], (err, data) => {
      if (err) return res.status(401).json(err);
      return res.status(200).json("published succesfully");
    });
  });
});

app.delete("/api/posts/:id", (req, res) => {
  const q = "DELETE FROM posts WHERE id =?";
  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.json(err);
    res.status(200).json("deleted");
  });
});

app.put("/api/posts/:id", (req, res) => {
  const q = "UPDATE posts 'title'=?,'desc'=?,'img'=?,'cat'=? WHERE id=?";
  const values = [req.body.title, req.body.desc, req.body.img, req.body.cat];
  const postId = req.params.id;
  db.query(q, [...values, postId], (err, data) => {
    if (err) return res.status(401).json(err);
    return res.status(200).json("updated succesfully");
  });
});

app.listen(8800, () => {
  console.log("connected");
});
