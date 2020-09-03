const jwt = require( 'jsonwebtoken' ); // Import Bcrypt package
const globals = require( '../globals' );

module.exports = ( req, res, next ) => {
  try {
    const token = req.headers.authorization.split( ' ' ).pop(); //  Get just token of ['Bearer', token]
    jwt.verify( token, globals.CONSTANTS.TOKEN.SECRET_KEY );
    next();
  } catch ( error ) {
    res.status( 401 ).json( {
      message: 'Authentication failed!',
    } ); // 401 code for authentication denied
  }
}