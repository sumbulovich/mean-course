const jwt = require( 'jsonwebtoken' ); // Import Bcrypt package

exports.checkToken = ( req, res, next ) => {
  try {
    const token = req.headers.authorization.split( ' ' ).pop(); //  Get just token of ['Bearer', token]
    const verify = jwt.verify( token, process.env.JWT_SECRET_KEY );
    const tokenPayload = { email: verify.email, userId: verify.userId }
    req.data = { ...req.data, ...{ tokenPayload } };
    // Custom field the request to pass data to a Middleware
    next();
  } catch ( error ) {
    res.status( 401 ).json( {
      message: 'You are not authenticated!',
    } ); // 401 code for authentication denied
  }
}