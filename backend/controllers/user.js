const bcrypt = require( 'bcrypt' ); // Import Bcrypt package
const jwt = require( 'jsonwebtoken' ); // Import Bcrypt package
const path = require( 'path' ); // Import path of Node.js
const globals = require( '../globals' ); // Import Post routes
const User = require( '../models/user' ); // Import Express package

const PATHS = globals.CONSTANTS.PATHS;
const tokenList = {}

/*
 * This middleware creates a new element
 */
exports.createUser = ( req, res, next ) => {
  bcrypt.hash( req.body.password, 10 ).then( hash => {
    const user = new User( {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hash,
      passwordLength: req.body.password.length,
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
          message: 'User already exist!',
        } );
      } );
  } );
}

/*
 * This middleware find an element and create a new session Token
 */
exports.signUser = ( req, res, next ) => {
  let fetchedUser;
  User.findOne( { email: req.body.authData.email } )
    .then( user => {
      if ( user ) {
        fetchedUser = user;
        return bcrypt.compare( req.body.authData.password, user.password );
        // .compare is a method provided by Bcrypt to compare encrypted passwords returning a boolean
      }
    } )
    .then( resultCompare => {
      if ( !resultCompare ) {
        res.status( 401 ).json( {
          message: 'Invalid email or password!',
        } ); // 401 code for authentication denied
        return;
      }

      const payload = { email: fetchedUser.email, userId: fetchedUser._id }; // Payload to sign
      const options = { expiresIn: req.body.expiresIn } // expiresIn to define a expiration time
      const token = jwt.sign( payload, process.env.JWT_SECRET_KEY, options );
      const refreshToken = jwt.sign( payload, process.env.JWT_SECRET_KEY_REFRESH, options );
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
}

/*
 * This middleware replace update an element
 */
exports.updateUser = ( req, res, next ) => {
  let imagePath = req.body.imagePath;
  if ( req.files.length ) {
    imagePath = `${req.protocol}://${req.get( 'host' )}/` +
      path.join( PATHS.IMAGES, PATHS.USERS, req.files[0].filename );
  }
  const user = new User( {
    _id: req.body.id,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    imagePath: imagePath
  } ); // body is a new field edited by BodyParser package

  User.updateOne( { _id: req.params.id }, user )
    .then( result => {
      if ( result.n === 0 ) {
        res.status( 401 ).json( { message: 'Not authorized user!' } );
        return;
      }
      res.status( 200 ).json( { message: 'User updated successful!' } );
    } ) // .updateOne method is provided by Mongoose to its models
    .catch( error => {
      res.status( 500 ).json( {  message: 'Updating User failed!' } );
    } );
}

/*
 * This middleware replace update an element
 */
exports.updateUserPassword = ( req, res, next ) => {
  let fetchedUser;
  User.findById( req.params.id )
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
          message: 'Invalid password!',
        } ); // 401 code for authentication denied
        return bcrypt.hash( req.body.newPassword, 10 );
      }
    } )
    .then( hash => {
      fetchedUser.password = hash;
      User.updateOne( { _id: req.params.id }, fetchedUser )
        .then( result => {
          if ( result.n === 0 ) {
            res.status( 401 ).json( { message: 'Not authorized user!' } );
            return;
          }
          res.status( 200 ).json( { message: 'User updated successful!' } );
        } ) // .updateOne method is provided by Mongoose to its models
        .catch( error => {
          res.status( 500 ).json( {  message: 'Updating User failed!' } );
        } );
    } )
    .catch( error => {
      res.status( 401 ).json( {
        message: 'Authentication failed!',
      } ); // 401 code for authentication denied
    } );
}

/*
 * This middleware fetch specific element
 */
exports.getUser = ( req, res, next ) => {
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
}

/*
 * This middleware find a specific element
 */
exports.findUser = ( req, res, next ) => {
  User.findById( req.params.id )
    .then( user => {
      req.data.find = user
      next();
    } ) // .find method is provided by Mongoose to its models
    .catch( error => {
      res.status( 500 ).json( { message: 'Finding User failed!' } );
    } );
}

/*
 * This middleware find a specific element
 */
exports.deleteUser = ( req, res, next ) => {
  User.deleteOne( { _id: req.params.id } )
    .then( result => {
      if ( result.n === 0 ) {
        res.status( 401 ).json( { message: 'Not authorized user!' } );
        return;
      }
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
  } else {
    res.status( 401 ).json( {
      message: 'Authentication failed!',
    } ); // 401 code for authentication denied
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