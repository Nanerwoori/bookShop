const express = require("express");
const router = express.Router();
const Author = require("../models/Author");
const Book = require("../models/Book");

const imageMemeTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

router.get("/", (req, res) => {
  const searchOptions = {};
  const { title, publishedAfter, publishedBefore } = req.query;

  if (typeof title === "string" && title.trim().length > 0) {
    searchOptions.title = new RegExp(title, "i");
  }
  if (typeof publishedAfter === "string" && publishedAfter.trim().length > 0) {
    searchOptions.publishDate = { $gte: publishedAfter };
  }
  if (
    typeof publishedBefore === "string" &&
    publishedBefore.trim().length > 0
  ) {
    searchOptions.publishDate = { $lte: publishedBefore };
  }

  Book.find(searchOptions)
    .then(books => {
      //   console.log(books);
      //   const books = results.map(
      //     book =>
      //       (book.coverImgePath =
      //         "data:" +
      //         book.coverImageType +
      //         ";charset=utf-8;base64" +
      //         book.coverImage.toString("base64"))
      //   );

      books.forEach(book => {
        return (book.coverImgePath =
          "data:" +
          book.coverImageType +
          ";charset=utf-8;base64," +
          book.coverImage.toString("base64"));
      });

      res.render("books/index", { books, searchOptions });
    })
    .catch(err => {
      res.redirect("/books");
    });
});

router.get("/new", (req, res) => {
  const book = {};
  Author.find().then(authors => {
    res.render("books/new", { book, authors });
  });
});

router.post("/", (req, res) => {
  const newBook = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.description
  });

  saveCover(newBook, req.body.cover);

  newBook
    .save()
    .then(book => {
      res.redirect("/");
    })
    .catch(err => {
      console.log(err);
      res.render("books/index", { errorMessage: "Cound't create books" });
    });
});

function saveCover(newBook, coverEncoded) {
  if (coverEncoded == null) return;
  const cover = JSON.parse(coverEncoded);
  if (cover != null && imageMemeTypes.includes(cover.type)) {
    newBook.coverImage = new Buffer.from(cover.data, "base64");
    newBook.coverImageType = cover.type;
  }
}

module.exports = router;
