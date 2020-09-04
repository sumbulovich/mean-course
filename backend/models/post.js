const mongoose = require( 'mongoose' ); // Import Mongoose package

const types = mongoose.Schema.Types;
const postSchema = mongoose.Schema({
  title: { type: types.String, required: true },
  content: { type: types.String, required: true },
  imagePath: types.String,
  creator: { type: types.ObjectId, ref: "User", required: true }, // Add a reference to the model
  created: { type: types.Date, required: true }
});

module.exports = mongoose.model( 'Post', postSchema );
