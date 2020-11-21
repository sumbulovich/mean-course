const bcrypt = require( 'bcrypt' ); // Import Bcrypt package
const jwt = require( 'jsonwebtoken' ); // Import Bcrypt package
const path = require( 'path' ); // Import path of Node.js
const globals = require( '../globals' ); // Import Post routes
const User = require( '../models/user' ); // Import Express package
const Code = require( '../models/code' ); // Import Express package
const emailService = require('../services/email');

const PATHS = globals.CONSTANTS.PATHS;
const tokenList = {}

/*
 * This middleware creates a new element
 */
exports.createUser = ( req, res, next ) => {
  bcrypt.hash( req.body.password, 10 )
    .then( hash => {
      const update = new User( {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hash,
        passwordLength: req.body.password.length,
        created: new Date()
      } ); // .hash method is provide by Bcrypt to encrypt password (10 characters)
      User.create( update )
        .then( user => {
          res.status( 200 ).json( {
            message: 'User created successfully',
            user: user
          } ); // user.save()
        } )
        .catch( error => {
          res.status( 500 ).json( { message: 'User already exist!' } );
        } );
    } );
}

/*
 * This middleware find an element and create a new session Token
 */
exports.signUser = ( req, res, next ) => {
  const tokenPayload = { email: req.data.validUser.email, userId: req.data.validUser._id }; // Payload to sign
  const tokenOptions = { expiresIn: req.body.expiresIn } // expiresIn to define a expiration time
  const token = jwt.sign( tokenPayload, process.env.JWT_SECRET_KEY, tokenOptions );
  const refreshToken = jwt.sign( tokenPayload, process.env.JWT_SECRET_KEY_REFRESH, tokenOptions );
  // .sign method provided by JsonWebToken to create a token based in some inputs of our choice
  tokenList[ refreshToken ] = token; // Save Token on a token's list
  res.status( 200 ).json( {
    message: 'User logged successfully!',
    token: token,
    refreshToken: refreshToken,
    userId: tokenPayload.userId
  } ); // 200 code for success
}

/*
 * This middleware replace update an element
 */
exports.updateUser = ( req, res, next ) => {
  let userImagePath = req.body.imagePath;
  if ( req.files.length ) {
    userImagePath = `${req.protocol}://${req.get( 'host' )}/` +
      path.join( PATHS.IMAGES, PATHS.USERS, req.files[0].filename );
  }
  const update = new User( {
    _id: req.body.id,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    imagePath: userImagePath
  } ); // body is a new field edited by BodyParser package

  const conditions = { _id: req.body.id };
  User.findOneAndUpdate( conditions, update )
    .then( oldUser => {
      if ( !oldUser ) {
        res.status( 401 ).json( { message: 'Not authorized user!' } );
        return;
      }
      req.data = { ...req.data, ...{ previousDocument: oldUser } };
      const newUser = { ...oldUser.toJSON(), ...update.toJSON() };
      res.status( 200 ).json( {
        message: 'User updated successful!',
        user: newUser
      } );
      next();
    } ) // .updateOne method is provided by Mongoose to its models
    .catch( error => {
      res.status( 500 ).json( {  message: 'Updating User failed!' } );
    } );
}

/*
 * This middleware update an element returning the element as it was before
 */
exports.updateUserPassword = ( req, res, next ) => {
  bcrypt.hash( req.body.newPassword, 10 )
    .then( hash => {
      const conditions = { _id: req.data.validUser._id };
      const update = {
        password: hash,
        passwordLength: req.body.newPassword.length
      }
      const options = { new: true };
      // if true, return the modified document rather than the original
      User.findOneAndUpdate( conditions, update, options )
        .then( newUser => {
          if ( !newUser ) {
            res.status( 401 ).json( { message: 'Not authorized user!' } );
            return;
          }
          res.status( 200 ).json( {
            message: 'Password updated successful!',
            user: newUser
          } );
        } ) // .updateOne method is provided by Mongoose to its models
        .catch( error => {
          res.status( 500 ).json( {  message: 'Updating User failed!' } );
        } );
    } )
    .catch( error => {
      res.status( 401 ).json( { message: 'Authentication failed!' } );
      // 401 code for authentication denied
    } );
}

exports.validatePassword = ( req, res, next ) => {
  let fetchedUser;
  const conditions = { email: req.body.email };
  User.findOne( conditions )
    .then( user => {
      if ( !user ) {
        return;
      }
      fetchedUser = user;
      return bcrypt.compare( req.body.password, user.password );
      // .compare is a method provided by Bcrypt to compare encrypted passwords returning a boolean
    } )
    .then( resultCompare => {
      if ( !resultCompare ) {
        res.status( 401 ).json( { message: 'Invalid credentials!' } );
        // 401 code for authentication denied
        return;
      }
      req.data = { ...req.data, ...{ validUser: fetchedUser } };
      next();
    } )
    .catch( error => {
      res.status( 401 ).json( { message: 'Authentication failed!' } );
      // 401 code for authentication denied
    } );
}

/*
 * This middleware fetch specific element
 */
exports.getUser = ( req, res, next ) => {
  const conditions = req.params.id;
  User.findById( conditions )
    .then( user => {
      if ( !user ) {
        res.status( 404 ).json( { message: 'User not found!' } );
        // 404 code for not found
        return;
      }
      res.status( 200 ).json( {
        message: 'User fetched successfully!',
        user: user
      } ); // 200 code for success
    } ) // .find method is provided by Mongoose to its models
    .catch( error => {
      res.status( 500 ).json( { message: 'Fetching User failed!' } );
    } );
}

/*
 * This middleware find a specific element
 */
exports.deleteUser = ( req, res, next ) => {
  const conditions = { _id: req.params.id };
  User.findOneAndDelete( conditions )
    .then( oldUser => {
      if ( !oldUser ) {
        res.status( 401 ).json( { message: 'Not authorized user!' } );
        return;
      }
      req.data = { ...req.data, ...{ previousDocument: oldUser } };
      res.status( 200 ).json( { message: 'User deleted successful!' } );
    } ) // .deleteOne method is provided by Mongoose to its models
    .catch( error => {
      res.status( 500 ).json( { message: 'Deleting User failed!' } );
    } );
}

/*
 * This middleware refresh the last generated session Token
 */
exports.refreshToken = ( req, res, next ) => {
  const localStorageData = req.body.localStorageData;
  if ( ( localStorageData.refreshToken ) && ( localStorageData.refreshToken in tokenList ) ) {
    const verify = jwt.verify( localStorageData.token, process.env.JWT_SECRET_KEY );
    const payload = { email: verify.email, userId: verify.userId };
    const options = { expiresIn: req.body.expiresIn };
    const token = jwt.sign( payload, process.env.JWT_SECRET_KEY, options );
    // .sign method provided by JsonWebToken to create a token based in some inputs of our choice
    tokenList[ req.body.refreshToken ] = token// Update the Token in the token's list

    res.status( 200 ).json( {
      message: 'Token Refreshed successfully!',
      token: token
    } ); // 200 code for success
  }
}

/*
 * This middleware reject the last generated session Token
 */
exports.rejectToken = ( req, res, next ) => {
  if ( ( req.body.refreshToken ) && ( req.body.refreshToken in tokenList ) ) {
    delete tokenList[ req.body.refreshToken ]
  }
  res.status( 204 ); // 204 code for no content (no message body)
}

exports.sendEmail = ( req, res, next ) => {
  const conditions = { email: req.body.to };
  User.findOne( conditions )
    .then( user => {
      if ( !user ) {
        res.status( 404 ).json( { message: 'This email does not exist on or database!' } );
        return;
      }
      Code.deleteOne( conditions )
        .then( result => {
          const conditions = new Code ( { creator: user._id } );
          return Code.create( conditions )
        } )
        .then( code => {
          req.body.html = req.body.html
            .replace(/#name#/g, user.firstName)
            .replace(/#code#/g, code._id);
          return emailService( req.body );
        } )
        .then( sentMessageInfo => {
          res.status( 200 ).json( { message: 'Email Sent successful!' } );
        } )
        .catch( error => {
          res.status( 500 ).json( { message: 'Sending Email failed!' } );
        } );
    } )
    .catch( error => {
      res.status( 500 ).json( { message: 'Something went wrong!' } );
    } );
}

exports.validateCode = ( req, res, next ) => {
  const conditions = { _id: req.params.id };
  Code.exists( conditions )
    .then( isCode => {
      if ( !isCode ) {
        res.status( 500 ).json( { message: 'Invalid code!' } );
        return;
      }
      res.status( 200 ).json( { message: 'Code validated successful!' } );
    } )
    .catch( error => {
      res.status( 500 ).json( { message: 'Something went wrong!' } );
    } );
}

exports.deleteCode = ( req, res, next ) => {
  const conditions = { _id: req.params.id };
  Code.findOneAndDelete( conditions )
    .then( oldCode => {
      const user = { _id: oldCode.creator  };
      req.data = { ...req.data, ...{ validUser: user } };
      next();
    } )
    .catch( error => {
      res.status( 500 ).json( { message: 'Deleting Code failed!' } );
    } );
}