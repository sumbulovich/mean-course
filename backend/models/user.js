const mongoose = require( 'mongoose' ); // Import Mongoose package
const uniqueValidator = require( 'mongoose-unique-validator' ); // Import Mongoose Unique Validator package

mongoose.set( 'useCreateIndex', true ); // Fix Deprecation Warning when is set a 'unique' field

const userSchema = mongoose.Schema( {
  email: { type: String, required: true, unique: true }, // On JavaScript Srting type is with capital
  password: { type: String, required: true },
  imagePath: String
} );

userSchema.plugin( uniqueValidator ); // .plugin method is Provided by Mongoose to add extra functionalities to a schema

module.exports = mongoose.model( 'User', userSchema );
