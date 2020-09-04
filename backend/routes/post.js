const express = require( 'express' ); // Import Express package
const multer = require( 'multer' ); // Import Multer package
const path = require( 'path' ); // Import path of Node.js
const fs = require( 'fs' ) // Import File System of Node.js
const globals = require( '../globals' ); // Import Post routes
const Post = require( '../models/post' ); // Import Mongoose Post model
const checkAuth = require('../middleware/check-auth');
const oneTime = require('../middleware/one-time');

const router = express.Router(); // Create Express Router

const PATHS = globals.CONSTANTS.PATHS;
const Page = globals.CLASSES.PAGE;

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const FILE_PATH_MAP = {
  1: path.join( PATHS.ROOT, PATHS.IMAGES, PATHS.POSTS ),
  2: path.join( PATHS.ROOT, PATHS.IMAGES, PATHS.POSTS, PATHS.THUMBNAILS )
}; // The path destination is relative to server.js

const storage = multer.diskStorage( {
  destination: ( req, file, cb ) => {
    const isValid = MIME_TYPE_MAP[ file.mimetype ];
    const error = isValid ? null : new Error( 'Invalid mime type' );
    cb( error, FILE_PATH_MAP[ req.files.length ] );
  },
  filename: ( req, file, cb ) => {
    const ext = MIME_TYPE_MAP[ file.mimetype ];
    cb( null, file.originalname + '.' + ext );
  }
} ); // Define how Multer stores files

const upload = multer( { storage: storage } );

const deleteFile = async ( req, res, next ) => {
  const isImageDeleted = !req.body.imagePath;
  const isImageReplaced = req.files && req.files.length;
  await Post.findById( req.params.id )
    .then( post => {
      if ( post.imagePath && ( isImageDeleted || isImageReplaced ) ) {
        const filename = post.imagePath.split( '/' ).pop();
        Object.values( FILE_PATH_MAP ).forEach( path => fs.unlinkSync( path + '/' + filename ) );
        // .unlinkSync method is provided by Node fs package
      }
    } ).catch( error => console.error( error.message ) );
  next();
} // Custom middleware to delete stored file synchronously ( fs.unlink(filePath, callbackFunction) for async )

const createDirectories = ( req, res, next ) => {
  Object.values( FILE_PATH_MAP ).forEach( dir => {
    fs.mkdir( dir, { recursive: true }, error => {
      if ( error ) {
        return console.error( error.message );
      }
    } );
  } );
  next();
}; // Custom middleware to create directories if not exist

/*
 * This middleware is execute just one time and create Post image directories if not exist
 */
router.use( oneTime( createDirectories ) );

/*
 * This middleware creates a new element
 */
// .single( 'image' ) method is provided by Multer and extracts a single file from 'image' property
router.post( '', checkAuth, upload.array( 'image' ), ( req, res, next ) => {
  const imagePath = '';
  if ( req.files.length ) {
    imagePath = `${req.protocol}://${req.get( 'host' )}/
      ${path.join( PATHS.IMAGES, PATHS.POSTS, req.files[0].filename )}`
  }

  const post = new Post( {
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.checkAuth.userId,
    created: new Date()
  } ); // body is a new field edited by BodyParser package

  Post.create( post ).then( post => {
    res.status( 201 ).json( {
      message: 'Post created successfully',
      post: post
    } ); // 201 new resource was created
  } ); // .create method is provided by Mongoose to its models
  /*
  post.save().then( post => {
    res.status( 201 ).json( {
      message: 'Post added successfully',
      postId: post._id
    } ); // 201 new resource was created
  } ); // .save is an instance method of the model provided by Mongoose
  */
} );

/*
 * This middleware replace completely an element by a new one
 * The middleware router.patch update an element with new values instead
 */
router.put( '/:id', checkAuth, upload.array( 'image' ), deleteFile, ( req, res, next ) => {
  const imagePath = req.body.imagePath;
  if ( req.files.length ) {
    imagePath = `${req.protocol}://${req.get( 'host' )}/
      ${path.join( PATHS.IMAGES, PATHS.POSTS, req.files[0].filename )}`
  }
  const post = new Post( {
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  } ); // body is a new field edited by BodyParser package

  Post.updateOne( { _id: req.params.id }, post )
    .then( result => {
      res.status( 200 ).json( {
        message: 'Post replaced successful!',
      } );
    } ); // .updateOne method is provided by Mongoose to its models
} );

/*
 * This middleware fetch initial elements
 */
router.get( '', ( req, res, next ) => {
  const page = new Page( +req.query.pageindex, +req.query.pagesize );
  const postQuery = Post.find(); // .find method is provided by Mongoose to its models
  let fetchedPosts;
  if( page.pageSize && page.pageIndex >= 0 ) {
    postQuery
      .skip( page.pageSize * page.pageIndex )
      .limit( page.pageSize );
  }
  postQuery.then( posts => {
    fetchedPosts = posts;
    return Post.countDocuments(); // .count method is provided by Mongoose to count the number of entries
  } ).then( count => { // It's possible chain multiple promises
    res.status( 200 ).json( {
      message: 'Posts fetched successfully!',
      posts: fetchedPosts,
      totalPosts: count
    } ); // 200 code for success
  } );
} );

/*
 * This middleware fetch specific element
 */
router.get( '/:id', ( req, res, next ) => {
  Post.findById( req.params.id )
    .then( post => {
      if ( !post ) {
        res.status( 404 ).json( {
          message: 'Post not found!',
        } ); // 404 code for not found
        return;
      }
      res.status( 200 ).json( {
        message: 'Post fetched successfully!',
        post: post
      } ); // 200 code for success
    } ); // .find method is provided by Mongoose to its models
} );

/*
 * This middleware delete an element by id
 */
router.delete( '/:id', checkAuth, deleteFile, ( req, res, next ) => {
  Post.deleteOne( { _id: req.params.id } )
    .then( result => {
      res.status( 200 ).json( {
        message: 'Post deleted!',
      } );
    } ); // .deleteOne method is provided by Mongoose to its models
} );

module.exports = router; // Export router