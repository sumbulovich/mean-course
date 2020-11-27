const path = require( 'path' ); // Import path of Node.js
const globals = require( '../globals' ); // Import Post routes
const Post = require( '../models/post' ); // Import Mongoose Post model

const PATHS = globals.CONSTANTS.PATHS;

/*
 * This middleware creates a new element
 */
exports.createPost = ( req, res, next ) => {
  let postImagePath = '';
  if ( req.files.length ) {
    postImagePath = `${req.protocol}://${req.get( 'host' )}/` +
      path.join( PATHS.IMAGES, PATHS.POSTS, req.files[0].filename )
  }

  const update = new Post( {
    title: req.body.title,
    content: req.body.content,
    imagePath: postImagePath,
    creator: req.data.tokenPayload.userId,
    created: new Date()
  } ); // body is a new field edited by BodyParser package

  Post.create( update )
    .then( post => {
      res.status( 201 ).json( {
        message: 'Post created successfully',
        post: post
      } ); // 201 new resource was created
    } ) // .create method is provided by Mongoose to its models
    .catch( error => {
      res.status( 500 ).json( {
        message: 'Process failed!',
      } );
    } );
  /*
  post.save().then( post => {
    res.status( 201 ).json( {
      message: 'Post added successfully',
      postId: post._id
    } ); // 201 new resource was created
  } ); // .save is an instance method of the model provided by Mongoose
  */
}

/*
 * This middleware update an element
 */
exports.updatePost = ( req, res, next ) => {
  let imagePath = req.body.imagePath;
  if ( req.files.length ) {
    imagePath = `${req.protocol}://${req.get( 'host' )}/` +
      path.join( PATHS.IMAGES, PATHS.POSTS, req.files[0].filename );
  }
  const update = new Post( {
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  } ); // body is a new field edited by BodyParser package
  const conditions = { _id: req.params.id, creator: req.data.tokenPayload.userId };
  Post.findOneAndUpdate( conditions, update )
    .then( oldPost => {
      if ( !oldPost ) {
        res.status( 401 ).json( { message: 'Not authorized user!' } );
        return;
      }
      req.data = { ...req.data, ...{ previousDocument: oldPost } };
      const newPost = { ...oldPost.toJSON(), ...update.toJSON() };
      res.status( 200 ).json( {
         message: 'Post replaced successful!',
         post: newPost
      } );
      next();
    } ) // .updateOne method is provided by Mongoose to its models
    .catch( error => {
      res.status( 500 ).json( {  message: 'Updating Post failed!' } );
    } );
}

/*
 * This middleware fetch initial elements
 */
exports.getPosts = ( req, res, next ) => {
  let totalPosts;
  const conditions = { pageIndex: +req.query.pageindex, pageSize: +req.query.pagesize };
  Post.countDocuments() // .count method is provided by Mongoose to count the number of entries
    .then( count => {
      totalPosts = count;
      const findQuery = Post.find(); // .find method is provided by Mongoose to its models
      if( conditions.pageSize ) {
        conditions.pageIndex = conditions.pageIndex >= 0 ? conditions.pageIndex : Math.ceil( totalPosts / conditions.pageSize ) - 1;
        findQuery
          .skip( conditions.pageSize * conditions.pageIndex )
          .limit( conditions.pageSize );
      }
      return findQuery;
    } )
    .then( posts => { // It's possible chain multiple promises
      res.status( 200 ).json( {
        message: 'Posts fetched successfully!',
        posts: posts,
        totalPosts: totalPosts,
        pageIndex: conditions.pageIndex
      } ); // 200 code for success
    } )
    .catch( error => {
      res.status( 500 ).json( { message: 'Fetching Post failed!' } );
    } );
}

/*
 * This middleware fetch a specific element
 */
exports.getPost = ( req, res, next ) => {
  const conditions = req.params.id;
  Post.findById( conditions )
    .then( post => {
      if ( !post ) {
        res.status( 404 ).json( { message: 'Post not found!' } );
        // 404 code for not found
        return;
      }
      res.status( 200 ).json( {
        message: 'Post fetched successfully!',
        post: post
      } ); // 200 code for success
    } ) // .find method is provided by Mongoose to its models
    .catch( error => {
      res.status( 500 ).json( { message: 'Fetching Post failed!' } );
    } );
}

/*
 * This middleware delete a specific element
 */
exports.deletePost = ( req, res, next ) => {
  const conditions = { _id: req.params.id,  creator: req.data.tokenPayload.userId };
  Post.findOneAndDelete( conditions )
    .then( oldPost => {
      if ( !oldPost ) {
        res.status( 401 ).json( { message: 'Not authorized user!' } );
        return;
      }
      req.data = { ...req.data, ...{ previousDocument: oldPost } };
      res.status( 200 ).json( {
        message: 'Post deleted successful!',
        post: oldPost
      } );
      next();
    } ) // .deleteOne method is provided by Mongoose to its models
    .catch( error => {
      res.status( 500 ).json( { message: 'Deleting Post failed!' } );
    } );
}