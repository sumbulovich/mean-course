const mongoose = require( 'mongoose' ); // Import Mongoose package

mongoose.set( 'useFindAndModify', false );
// Fix Deprecation Warning on `findOneAndUpdate()` and `findOneAndDelete()` methods

const types = mongoose.Schema.Types;
const codeSchema = mongoose.Schema({
  userId: { type: types.ObjectId, ref: "User", required: true }, // Add a reference to the model
  createdAt: { type: types.Date, expires: '1d', default: Date.now },
});

module.exports = mongoose.model( 'Code', codeSchema );
