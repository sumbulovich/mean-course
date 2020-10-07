const express = require( 'express' ); // Import Express package
const path = require( 'path' ); // Import path of Node.js
const globals = require( '../globals' );
const userController = require( '../controllers/user' );
const fileService = require( '../services/file' );
const authService = require('../services/auth');
const oneTime = require('../services/one-time');

const router = express.Router(); // Create Express Router

const PATHS = globals.CONSTANTS.PATHS;
const FILE_PATH_MAP = {
  1: path.join( PATHS.ROOT, PATHS.IMAGES, PATHS.USERS ),
  2: path.join( PATHS.ROOT, PATHS.IMAGES, PATHS.USERS, PATHS.THUMBNAILS )
}; // The path destination is relative to server.js

router.use( oneTime( fileService.createDirectories( FILE_PATH_MAP ) ) );
// This middleware is execute just one time and create image directories if not exist

router.post( '/signup', userController.createUser );

router.post( '/signin', userController.signUser );

router.put(
  '/:id', authService.checkToken, fileService.storeFile( FILE_PATH_MAP ),
  userController.updateUser, fileService.deleteFile( FILE_PATH_MAP ),
);

router.put( '/password/:id', authService.checkToken, userController.updateUserPassword );
// .put replace an element by a new one
// .patch update an element with new values

router.get( '/:id', userController.getUser );

router.delete( '/:id', authService.checkToken, userController.deleteUser, fileService.deleteFile( FILE_PATH_MAP ) );

router.post( '/token', userController.refreshToken );

router.post( '/token/reject', userController.rejectToken );

module.exports = router; // Export app