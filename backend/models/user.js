const mongoose = require( 'mongoose' ); // Import Mongoose package
const uniqueValidator = require( 'mongoose-unique-validator' ); // Import Mongoose Unique Validator package

mongoose.set( 'useCreateIndex', true ); // Fix Deprecation Warning when is set a 'unique' field

const types = mongoose.Schema.Types;
const userSchema = mongoose.Schema( {
  firstName: { type: types.String, required: true },
  lastName: { type: types.String, required: true },
  email: { type: types.String, required: true, unique: true },
  password: { type: types.String, required: true },
  passwordLength: { type: types.Number, require: true },
  imagePath: types.String,
  created: { type: types.Date, required: true }
} );

userSchema.plugin( uniqueValidator ); // .plugin method is Provided by Mongoose to add extra functionalities to a schema

module.exports = mongoose.model( 'User', userSchema );
