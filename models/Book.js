const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  publishDate: {
    type: Date,
    required: true
  },
  pageCount: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  coverImage: {
    type: Buffer,
    required: true
  },
  coverImageType: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "authors"
  }
});

// bookSchema.virtual("coverImagePath").get(function() {
//   if (this.coverImage != null && this.coverImageType != null) {
//     return `data:${
//       this.coverImageType
//     };charset=utf-8;base64,${this.coverImage.toString("base64")}`;
//   }
// });

module.exports = mongoose.model("Book", bookSchema);
