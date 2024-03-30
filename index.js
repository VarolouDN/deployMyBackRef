const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRouter = require("./routes/auth.routes");
const articleRouter = require("./routes/article.routes");
const userRouter = require("./routes/user.roures");
const cors = require("cors");
const app = express();

// const corsParams = {
//   origin: ["https://deploy-my-front.vercel.app/"],
//   methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
//   credentials: true,
// };
//app.use(cors(corsParams));

const PORT = process.env.SERVER_PORT || 5000;
const DB_URL = process.env.DATABASE_URL;
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// app.use("/api/article/create", upload.single("file"), cors());
app.use("/api/auth", cors(), authRouter);
app.use("/api/article", cors(), articleRouter);
app.use("/api/user", cors(), userRouter);

mongoose
  .connect(DB_URL, {})
  .then(() => {
    console.log("DB connection successful!");
  })
  .catch((err) => console.log(err));

const start = () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server works on PORT:${PORT} `);
    });
  } catch (e) {
    console.log(e.message);
  }
};

start();
