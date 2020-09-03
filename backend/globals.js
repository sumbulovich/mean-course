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

const token = {
  SECRET_KEY: 'GlNcAuQGzYLkvSyHvT1MkQ==', // Custom secret of private key used on the token's generation
  SECRET_KEY_REFRESH: 'IcU0d71mA388lsYfY3LHtA==', // Custom secret of private key used on the token's generation
} // Token data

/*
 * CLASSES
 */
class Page {
  constructor( pageIndex, pageSize ) {
    this.pageIndex = pageIndex,
    this.pageSize = pageSize
  }
}

module.exports = {
  CONSTANTS: {
    PATHS: paths,
    TOKEN: token
  },
  CLASSES: {
    PAGE: Page
  }
}; // Export Globals