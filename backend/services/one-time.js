module.exports = ( mw ) => {
  let done = false;
  return ( req, res, next ) => {
    if ( done ) {
      next();
      return
    }
    mw( req, res, next );
    done = true;
  }
}