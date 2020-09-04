const jwt = require( 'jsonwebtoken' ); // Import Bcrypt package
const globals = require( '../globals' );

module.exports = ( req, res, next ) => {
  try {
    const token = req.headers.authorization.split( ' ' ).pop(); //  Get just token of ['Bearer', token]
    const verify = jwt.verify( token, globals.CONSTANTS.TOKEN.SECRET_KEY );
    req.checkAuth = { email: verify.email, userId: verify.userId }; // Custom field the request to pass data to a Middleware
    next();
  } catch ( error ) {
    res.status( 401 ).json( {
      message: 'Authentication failed!',
    } ); // 401 code for authentication denied
  }
}