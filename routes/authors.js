const express = require("express");
const router = express.Router();
const Author = require("../models/Author");
const Book = require("../models/Book");

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
});

// Create New Author
router.get("/new", (req, res) => {
  res.render("authors/new");
});

// Show Author
router.get("/:id", (req, res) => {
  if (typeof req.params.id !== "string" && req.params.length === 0)
    return res.render("authors/index", {
      errorMessage: "Could't found author with the id "
    });

  Author.findById(req.params.id)
    .then(author => {
      Book.find({ author: author.id }).then(books => {
        res.render("authors/show", { author, books });
      });
    })
    .catch(err => {
      console.log(err);
      res.redirect("/");
    });
});

// Display Eidt Form
router.get("/:id/edit", (req, res) => {
  if (typeof req.params.id !== "string" && req.params.id === 0)
    return res.redirect("/");
  Author.findById(req.params.id)
    .then(author => res.render("authors/edit", { author }))
    .catch(err => {
      console.log(err);
      res.redirect("/");
    });
});

// Process Edit
router.put("/:id", (req, res) => {
  if (typeof req.params.id !== "string" && req.params.id === 0)
    return res.redirect("/");

  Author.findById(req.params.id)
    .then(author => {
      if (
        typeof req.body.name === "string" &&
        req.body.name.trim().length === 0
      )
        return res.render("authors/edit", {
          author,
          errorMessage: "the name field is requried."
        });

      author.name = req.body.name;
      author.save().then(author => res.redirect(`/authors/${author.id}`));
    })
    .catch(err => {
      console.log("Error updating author : ", err);
      res.redirect("/");
    });

  // res.render("authors/edit");
});

// Delete Author
router.delete("/:id", (req, res) => {
  if (typeof req.params.id !== "string" && req.params.id === 0)
    return res.redirect("/");

  Author.findById(req.params.id)
    .then(author => {
      if (!author) return res.redirect("/");

      author.remove();
      res.redirect("/authors");
    })
    .catch(err => {
      console.log("Error deleting author ", err);
      res.redirect("/");
    });
});

module.exports = router;
