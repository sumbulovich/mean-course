/*
 * CONSTANTS
 */
const paths = {
  ROOT: 'backend',
  IMAGES: 'images',
  POSTS: 'posts',
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
  return function ( req, res, next ) {
    if ( done ) {
      next();
      return
    }
    mw( req, res, next );
    done = true;
  }
} // Custom method that execute a meddleware just one time

function multipleOneTime( arr ) {
  const express = require( 'express' ); // Import Express Package
  const router = express.Router()
  router.use.apply(router, arguments)
  return oneTime(router)
} // Custom method that execute multiple meddlewares just one time

module.exports = {
  CONSTANTS: {
    'paths': paths
  },
  CLASSES: {
    'Page': Page
  },
  METHODS: {
    'oneTime': oneTime,
    'multipleOneTime': multipleOneTime
  }
}; // Export Globals