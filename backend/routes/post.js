const express = require( 'express' ); // Import Express package
const path = require( 'path' ); // Import path of Node.js
const globals = require( '../globals' );
const postController = require( '../controllers/post' );
const fileService = require( '../services/file' );
const authService = require('../services/auth');
const oneTime = require('../services/one-time');

const router = express.Router(); // Create Express Router

const PATHS = globals.CONSTANTS.PATHS;
const FILE_PATH_MAP = {
  1: path.join( PATHS.ROOT, PATHS.IMAGES, PATHS.POSTS ),
  2: path.join( PATHS.ROOT, PATHS.IMAGES, PATHS.POSTS, PATHS.THUMBNAILS )
}; // The path destination is relative to server.js

router.use( oneTime( fileService.createDirectories( FILE_PATH_MAP ) ) );
// This middleware is execute just one time and create image directories if not exist

router.post( '', authService.checkToken, fileService.storeFile( FILE_PATH_MAP ), postController.createPost );

router.put(
  '/:id', authService.checkToken, fileService.storeFile( FILE_PATH_MAP ),
  postController.updatePost, fileService.deleteFile( FILE_PATH_MAP )
);
// .put replace an element by a new one
// .patch update an element with new values

router.get( '', postController.getPosts );

router.get( '/:id', postController.getPost );

router.delete( '/:id', authService.checkToken, postController.deletePost, fileService.deleteFile( FILE_PATH_MAP ) );

module.exports = router; // Export router