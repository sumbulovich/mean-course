const mongoose = require( 'mongoose' );
const postSchema = mongoose.Schema({
  title: { type: String, required: true }, // On JavaScript Srting type is with capital
  content: { type: String, required: true },
  imagePath: String
});

module.exports = mongoose.model( 'Post', postSchema );
