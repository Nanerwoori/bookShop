const express = require("express");
const router = express.Router();
const Author = require("../models/Author");

// All authors
router.get("/", (req, res) => {
  const searchOptions = {};

  const isName =
    typeof req.query.name === "string" && req.query.name.trim().length > 0
      ? true
      : false;

  if (isName) searchOptions.name = new RegExp(req.query.name, "i");

  Author.find(searchOptions)
    .then(authors => {
      res.render("authors/index", { authors, searchOptions: req.query });
    })
    .catch(err => res.redirect("authors/index"));
});
// Create New Author
router.post("/", (req, res) => {
  const name =
    typeof req.body.name === "string" && req.body.name.trim().length > 0
      ? req.body.name.trim()
      : false;

  if (name) {
    const newAuthor = new Author({ name });
    newAuthor
      .save()
      .then(author => res.redirect("/authors"))
      .catch(err =>
        res.render("authors/new", { errorMessage: "Could't not create ... " })
      );
  } else {
    res.render("authors/new", { errorMessage: "Please enter Author's name " });
  }

  console.log(req.body);
});

// Create New Author
router.get("/new", (req, res) => {
  res.render("authors/new");
});

module.exports = router;
