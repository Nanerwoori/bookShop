const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Book = require("./Book");

const AuthorSchema = new Schema({
  name: { type: String, required: true }
});

AuthorSchema.pre("remove", function() {
  Book.find({ author: this.id })
    .then(books => {
      if (books.length > 0) {
        next(new Error("This author has books still"));
      } else {
        next();
      }
    })
    .catch(err => next(err));
});

const Author = mongoose.model("authors", AuthorSchema);

module.exports = Author;
