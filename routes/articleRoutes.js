const Router = require("express");
const Article = require("../models/Article.js");
const fs = require("fs");
const path = require("path");
const User = require("../models/User.js");
const multer = require("multer");
const { check, validationResult } = require("express-validator");
const router = new Router();
const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  "/create",
  // ,upload.single("file")
  async (req, res) => {
    //     try {
    //       // Теперь req.body содержит текстовые данные из FormData
    //       console.log("create");

    //       // req.file содержит информацию о загруженном файле
    //       const uploadedFile = req.file;
    //       console.log(req.file)
    //       const newArticle = Object.assign({}, req.body)["newArticle"];
    //       const { title, userId, name, text } = JSON.parse(newArticle);

    //       console.log(newArticle)

    //       if (uploadedFile) {
    //         console.log("with image")
    //         const timestamp = Date.now();
    //         const randomValue = Math.floor(Math.random() * 1000);
    //         const uniqueFileName = `file_${timestamp}_${randomValue}.jpg`;
    //         const uniquePath = path.join(
    //             __dirname,
    //             "..",
    //             `/uploads/${uniqueFileName}`
    //         );

    //         //СОХРАНЕНИЕ ФАЙЛА НА СЕРВЕРЕ

    //       fs.writeFile(uniquePath, uploadedFile.buffer, async (err) => {
    //           if (err) {
    //             console.error("Ошибка сохранения файла:", err);
    //             return res.status(500).json({message: "Ошибка сохранения файла"});
    //           }
    //         })

    //             console.log("newArticle", newArticle)//Здесь newArticle существует
    //           // const newArticle={
    //           //     title, userId, name, text,
    //           //     filePath: uniquePath
    //           // }
    //             const article = new Article({title, userId, name, text,filePath: uniquePath});
    //            console.log(typeof title)
    //            console.log(title, userId, name, text, uniquePath)
    //              await article.save()
    //             if (!article) throw new Error('article was not create')
    //             console.log("Article true")
    //             console.log(article)
    //             // await article.save();
    //             console.log("article", article) // Здесь article пустой обьект
    //             return res
    //                 .set("Access-Control-Allow-Origin", "*")
    //                 .json({message: "Article was created", success: true, data: {article}});

    //       }

    // else {
    //   console.log('without image')
    //         const article = new Article({title, userId, name, text});
    //         if (article) {
    //           await article.save();
    //           return res
    //               .set("Access-Control-Allow-Origin", "*")
    //               .json({message: "Article was created", success: true});
    //         } else {
    //           return res
    //               .set("Access-Control-Allow-Origin", "*")
    //               .json({message: "Article was not created"});
    //         }
    //       }
    //     }
    try {
      console.log("create article");
      console.log(req.body);
      const newArticle = new Article(req.body);
      if (!newArticle) throw new Error("article was not created");

      await newArticle.save();
      res.status(200).json({
        message: "Article was created",
        data: { newArticle },
        success: true,
      });
    } catch (e) {
      res.send({ message: "Server error" });
    }
  }
);

router.get("/articles", async (req, res) => {
  console.log("get articles");
  try {
    const articles = await Article.find();

    res.set("Access-Control-Allow-Origin", "*").json(articles);
  } catch (e) {
    res.send({ message: "Server error" });
  }
});

router.get("/articles/:id", async (req, res) => {
  try {
    const articleId = req.params.id;
    console.log(req.params);
    if (!mongoose.Types.ObjectId.isValid(articleId)) {
      return res.status(400).json({
        message: "given object id is not valid",
      });
    } else {
      const article = await Article.findById(articleId);
      if (!article) {
        return res
          .status(404)
          .json({ message: "Article with this id doesn't exist" });
      }

      return res.set("Access-Control-Allow-Origin", "*").send(article);
    }
  } catch (e) {
    res.send({ message: "Server error" });
  }
});

router.put("/articles/:id", async (req, res) => {
  try {
    const articleId = req.params.id;
    console.log(req.params);
    console.log(req.body);
    // if (!mongoose?.Types?.ObjectId?.isValid(articleId)) {
    //   return res.status(400).json({
    //     message: "given object id is not valid",
    //   });
    // } else {
    const article = await Article.findByIdAndUpdate(
      articleId,
      req.body,
      /*{ title: req.body.title, text: req.body.text  }*/ { new: true }
    );
    if (!article) {
      return res
        .status(404)
        .json({ message: "Article with this id doesn't exist" });
    }

    return res
      .set("Access-Control-Allow-Origin", "*")
      .set("Access-Control-Allow-Headers", "Content-Type")
      .json({
        article: article,
        message: "Article was updated",
        success: true,
      });
  } catch (e) {
    res.send({ message: "Server error" });
  }
});

router.options("/articles/:id", (req, res) => {
  console.log(req.params.id);
  // Отправьте корректные CORS заголовки и успешный статус код (200)
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.status(200).send();
});

router.delete("/articles/:id", async (req, res) => {
  console.log(req.params);
  console.log(req.query);
  try {
    const articleId = req.params.id;
    const userId = req.query.userId;

    if (!mongoose?.Types?.ObjectId?.isValid(articleId)) {
      return res.status(400).json({
        message: "given object id is not valid",
      });
    } else {
      const checkedArticle = await Article.findById(articleId);
      let a = String(checkedArticle.userId);
      let b = String(userId);
      console.log(a, b);
      if (a !== b) {
        console.log("wrong");
        return res
          .status(404)
          .json({ message: "This user cant delete this article" });
      }

      const article = await Article.findByIdAndDelete(articleId);
      if (!article) {
        console.log("article doesnt exist");
        return res
          .status(404)
          .json({ message: "Article with this id doesn't exist" });
      }

      return res
        .set("Access-Control-Allow-Origin", "*")
        .set("Access-Control-Allow-Headers", "Content-Type")
        .json({
          article: article,
          message: "Article was deleted",
          success: true,
        });
    }
  } catch (e) {
    res.send({ message: "Server error" });
  }
});

module.exports = router;
