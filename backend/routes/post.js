const express = require( 'express' ); // Import Express package
const multer = require( 'multer' ); // Import Multer package
const fs = require( 'fs' ) // Import File System of Node.js
const Post = require( '../models/post' ); // Import Mongoose Post model
const util = require('util'); // console.log(util.inspect(myObject, {depth: 1}))


const router = express.Router(); // Create Express Router

const MIME_TIPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const FILE_LIMIT = 2; // Number of files per image

const storage = multer.diskStorage( {
  destination: ( req, file, cb ) => {
    const isValid = MIME_TIPE_MAP[ file.mimetype ];
    const error = isValid ? null : new Error( 'Invalid mime type' );
    const path = req.files.length < FILE_LIMIT ? 'backend/images/posts' : 'backend/images/posts/thumbnails';
    cb( error, path ); // The path destination is relative to server.js
  },
  filename: ( req, file, cb ) => {
    const ext = MIME_TIPE_MAP[ file.mimetype ];
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
        fs.unlinkSync( 'backend/images/posts/' + filename ); // .unlinkSync method is provided by Node fs package
        fs.unlinkSync( 'backend/images/posts/thumbnails/' + filename ); // .unlinkSync method is provided by Node fs package
      }
    } ).catch( e => console.error( e.message ) );
  next();
} // Custom method to delete stored file synchronously ( fs.unlink(filePath, callbackFunction) for async )

/*
 * This middleware is triggered for incoming POST request
 */
// .single( 'image' ) method is provided by Multer and extracts a single file from 'image' property
router.post( '', upload.array( 'image', FILE_LIMIT ), ( req, res, next ) => {
  const url = req.protocol + '://' + req.get( 'host' );
  const post = new Post( {
    title: req.body.title || null,
    content: req.body.content || null,
    imagePath: req.files.length ? url + '/images/' + req.files[0].filename : null
  } ); // body is a new field edited by BodyParser package

  Post.create( post ).then( post => {
    res.status( 201 ).json( {
      message: 'Post added successfully',
      post: post
    } ); // 201 new resorce was created
  } ); // .create method is provided by Mongoose to its models
  /*
  post.save().then( post => {
    res.status( 201 ).json( {
      message: 'Post added successfully',
      postId: post._id
    } ); // 201 new resorce was created
  } ); // .save is an instance method of the model provided by Mongoose
  */
} );

/*
 * This middleware replace completely an element by a new one
 * The middleware router.patch update an element with new values instead
 */
router.put( '/:id', upload.array( 'image', FILE_LIMIT ), deleteFile, ( req, res, next ) => {
  // if ( req.files.length || !req.body.imagePath ) {
  //   deleteFile( req.params.id ); // Delete image file
  // }
  const url = req.protocol + '://' + req.get( 'host' );
  const post = new Post( {
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: req.files.length ? url + '/images/' + req.files[0].filename : req.body.imagePath
  } ); // body is a new field edited by BodyParser package

  Post.updateOne( { _id: req.params.id }, post )
    .then( result => {
      res.status( 200 ).json( {
        message: 'Post replaced successful!',
      } );
    } ); // .updateOne method is provided by Mongoose to its models
} );

/*
 * This middleware fetch initial posts
 */
router.get( '', ( req, res, next ) => {
  Post.find()
    .then( posts => {
      res.status( 200 ).json( {
        message: 'Posts fetched succesfully!',
        posts: posts
      } ); // 200 code for success
    } ); // .find method is provided by Mongoose to its models
} );

/*
 * This middleware fetch specific post
 */
router.get( '/:id', ( req, res, next ) => {
  Post.findById( req.params.id )
    .then( post => {
      if ( post ) {
        res.status( 200 ).json( {
          message: 'Post fetched succesfully!',
          post: post
        } ); // 200 code for success
      } else {
        res.status( 404 ).json( {
          message: 'Post not found!',
        } ); // 404 code not found
      }
    } ); // .find method is provided by Mongoose to its models
} );

/*
 * This middleware delete an element by id
 */
router.delete( '/:id', deleteFile, ( req, res, next ) => {
  Post.deleteOne( { _id: req.params.id } )
    .then( result => {
      res.status( 200 ).json( {
        message: 'Post deleted!',
      } );
    } ); // .deleteOne method is provided by Mongoose to its models
} );

module.exports = router; // Export app