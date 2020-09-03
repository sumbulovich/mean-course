const mongoose = require( 'mongoose' ); // Import Mongoose package
const uniqueValidator = require( 'mongoose-unique-validator' ); // Import Mongoose Unique Validator package

mongoose.set( 'useCreateIndex', true ); // Fix Deprecation Warning when is set a 'unique' field

const userSchema = mongoose.Schema( {
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  imagePath: String
} );

userSchema.plugin( uniqueValidator ); // .plugin method is Provided by Mongoose to add extra functionalities to a schema

module.exports = mongoose.model( 'User', userSchema );
