const mongoose = require( 'mongoose' ); // Import Mongoose package

mongoose.set( 'useFindAndModify', false );
// Fix Deprecation Warning on `findOneAndUpdate()` and `findOneAndDelete()` methods

const types = mongoose.Schema.Types;
const postSchema = mongoose.Schema({
  title: { type: types.String, required: true },
  content: { type: types.String, required: true },
  imagePath: types.String,
  userId: { type: types.ObjectId, ref: "User", required: true }, // Add a reference to the model
  createdAt: { type: types.Date, default: Date.now }
});

module.exports = mongoose.model( 'Post', postSchema );
