const express = require( 'express' ); // Import Express package
const bcrypt = require( 'bcrypt' ); // Import Bcrypt package
const jwt = require( 'jsonwebtoken' ); // Import Bcrypt package
const User = require( '../models/user' ); // Import Express package
const globals = require( '../globals' ); // Import Post routes

const router = express.Router(); // Create Express Router
const tokenList = {}

/*
 * This middleware creates a new element
 */
router.post( '/signup', ( req, res, next ) => {
  bcrypt.hash( req.body.password, 10 ).then( hash => {
    const user = new User( {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hash,
      created: new Date()
    } ); // .hash method is provide by Bcrypt to encrypt password (10 characters)

    User.create( user )
      .then( user => {
        res.status( 200 ).json( {
          message: 'User created successfully',
          user: user
        } ); // user.save()
      } )
      .catch( error => {
        res.status( 500 ).json( {
          message: 'Error: User already exist!',
        } );
      } );
  } );
} );

/*
 * This middleware find an element and create a new session Token
 */
router.post( '/signin', ( req, res, next ) => {
  let fetchedUser;
  User.findOne( { email: req.body.user.email } )
    .then( user => {
      if ( user ) {
        fetchedUser = user;
        return bcrypt.compare( req.body.user.password, user.password );
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

      const payload = { email: fetchedUser.email, userId: fetchedUser._id }; // Payload to sign
      const options = { expiresIn: req.body.expiresIn } // expiresIn to define a expiration time
      const token = jwt.sign( payload, globals.CONSTANTS.TOKEN.SECRET_KEY, options );
      const refreshToken = jwt.sign( payload, globals.CONSTANTS.TOKEN.SECRET_KEY_REFRESH, options );
      // .sign method provided by JsonWebToken to create a token based in some inputs of our choice
      tokenList[ refreshToken ] = token; // Save Token on a token's list

      res.status( 200 ).json( {
        message: 'User logged successfully!',
        token: token,
        refreshToken: refreshToken,
        userId: fetchedUser._id
      } ); // 200 code for success
    } )
    .catch( error => {
      res.status( 401 ).json( {
        message: 'Authentication failed!',
      } ); // 401 code for authentication denied
    } );
} );

router.post( '/token', ( req, res, next ) => {
  const localStorage = req.body.localStorage;
  if ( ( localStorage.refreshToken ) && ( localStorage.refreshToken in tokenList ) ) {
    const verify = jwt.verify( localStorage.token, globals.CONSTANTS.TOKEN.SECRET_KEY );
    const payload = { email: verify.email, userId: verify.userId };
    const options = { expiresIn: req.body.expiresIn };
    const token = jwt.sign( payload, globals.CONSTANTS.TOKEN.SECRET_KEY, options );
    // .sign method provided by JsonWebToken to create a token based in some inputs of our choice
    tokenList[ req.body.refreshToken ] = token// Update the Token in the token's list

    res.status( 200 ).json( {
      message: 'Token Refreshed successfully!',
      token: token
    } ); // 200 code for success
  } else {
    res.status( 401 ).json( {
      message: 'Authentication failed!',
    } ); // 401 code for authentication denied
  }
} );

router.post( '/token/reject', ( req, res, next ) => {
  if ( ( req.body.refreshToken ) && ( req.body.refreshToken in tokenList ) ) {
    delete tokenList[ req.body.refreshToken ]
  }
  res.status( 204 ); // 204 code for no content (no message body)
} );

/*
 * This middleware fetch specific element
 */
router.get( '/:id', ( req, res, next ) => {
  User.findById( req.params.id )
    .then( user => {
      if ( !user ) {
        res.status( 404 ).json( { message: 'User not found!' } ); // 404 code for not found
        return;
      }
      res.status( 200 ).json( {
        message: 'User fetched successfully!',
        user: user
      } ); // 200 code for success
    } ); // .find method is provided by Mongoose to its models
} );

module.exports = router; // Export app