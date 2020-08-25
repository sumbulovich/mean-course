/*
 * CONSTANTS
 */
const paths = {
  ROOT: 'backend',
  IMAGES: 'images',
  POSTS: 'posts',
  USERS: 'users',
  THUMBNAILS: 'thumbnails'
} // All project paths

/*
 * CLASSES
 */
class Page {
  constructor( pageIndex, pageSize ) {
    this.pageIndex = pageIndex,
    this.pageSize = pageSize
  }
}

/*
 * Methods
 */
function oneTime( mw ) {
  let done = false;
  return ( req, res, next ) => {
    if ( done ) {
      next();
      return
    }
    mw( req, res, next );
    done = true;
  }
} // Custom method that execute a middleware just one time

module.exports = {
  CONSTANTS: {
    PATHS: paths,
    AUTH_SECRET_KEY: 'GlNcAuQGzYLkvSyHvT1MkQ==',
    TOKEN_EXPIRATION_TIME: '1h'
  },
  CLASSES: {
    PAGE: Page
  },
  METHODS: {
    ONE_TIME: oneTime
  }
}; // Export Globals