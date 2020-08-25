const express = require( 'express' ); // Import Express package
const bcrypt = require( 'bcrypt' ); // Import Bcrypt package
const jwt = require( 'jsonwebtoken' ); // Import Bcrypt package
const User = require( '../models/user' ); // Import Express package
const globals = require( '../globals' ); // Import Post routes
const ms = require( 'ms' ); // Import MS package

const router = express.Router(); // Create Express Router

router.post('/signup', ( req, res, next ) => {
  bcrypt.hash( req.body.password, 10 ).then( hash => {
    const user = new User( {
      email: req.body.email,
      password: hash
    } ); // .hash method is provide by Bcrypt to encrypt password (10 characters)

    User.create( user )
      .then( user => {
        res.status( 200 ).json( {
          message: 'User created successfully',
          user: user
        } ); // user.save()
      } )
      .catch ( error => {
        res.status( 500 ).json( {
          message: 'Error: User already exist!',
        } );
      } );
  } );
} );

router.post( '/signin', ( req, res, next ) => {
  let fetchedUser;
  User.findOne( { email: req.body.email } )
    .then( user => {
      if ( user ) {
        fetchedUser = user;
        return bcrypt.compare( req.body.password, user.password );
        // .compare is a method provided by Bcrypt to compare encrypted passwords returning a boolean
      }
    } )
    .then( resultCompare => {
      if ( !resultCompare ) {
        res.status( 401 ).json( {
          message: 'Authentication failed!',
        } ); // 401 code for authentication denied
        return;
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        globals.CONSTANTS.AUTH_SECRET_KEY, // Custom secret of private key used on the token's generation
        { expiresIn: globals.CONSTANTS.TOKEN_EXPIRATION_TIME } // options?: expiresIn to define a expiration time
      );
      // .sign method provided by JsonWebToken to create a token based in some inputs of our choice
      res.status( 200 ).json( {
        message: 'User logged successfully!',
        token: token,
        expiresIn: ms( globals.CONSTANTS.TOKEN_EXPIRATION_TIME ) // Convert string time format to milliseconds
      } ); // 200 code for success
    } )
    .catch( error => {
      res.status( 401 ).json( {
        message: 'Authentication failed!',
      } ); // 401 code for authentication denied
    } );
} );

module.exports = router; // Export app