const path = require( 'path' ); // Import path of Node.js
const globals = require( '../globals' ); // Import Post routes
const Post = require( '../models/post' ); // Import Mongoose Post model

const PATHS = globals.CONSTANTS.PATHS;

/*
 * This middleware creates a new element
 */
exports.createPost = ( req, res, next ) => {
  let imagePath = '';
  if ( req.files.length ) {
    imagePath = `${req.protocol}://${req.get( 'host' )}/` +
      path.join( PATHS.IMAGES, PATHS.POSTS, req.files[0].filename )
  }

  const post = new Post( {
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.data.tokenPayload.userId,
    created: new Date()
  } ); // body is a new field edited by BodyParser package

  Post.create( post )
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
 * This middleware replace update an element
 */
exports.updatePost = ( req, res, next ) => {
  let imagePath = req.body.imagePath;
  if ( req.files.length ) {
    imagePath = `${req.protocol}://${req.get( 'host' )}/` +
      path.join( PATHS.IMAGES, PATHS.POSTS, req.files[0].filename );
  }
  const post = new Post( {
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  } ); // body is a new field edited by BodyParser package

  Post.updateOne( { _id: req.params.id, creator: req.data.tokenPayload.userId }, post )
    .then( result => {
      if ( result.n === 0 ) {
        res.status( 401 ).json( { message: 'Not authorized user!' } );
        return;
      }
      res.status( 200 ).json( { message: 'Post replaced successful!' } );
    } ) // .updateOne method is provided by Mongoose to its models
    .catch( error => {
      res.status( 500 ).json( {  message: 'Updating Post failed!' } );
    } );
}

/*
 * This middleware fetch initial elements
 */
exports.getPosts = ( req, res, next ) => {
  const page = { pageIndex: +req.query.pageindex, pageSize: +req.query.pagesize };
  let totalPosts;
  Post.countDocuments() // .count method is provided by Mongoose to count the number of entries
    .then( count => {
      totalPosts = count;
      const postQuery = Post.find(); // .find method is provided by Mongoose to its models
      if( page.pageSize ) {
        page.pageIndex = page.pageIndex >= 0 ? page.pageIndex : Math.ceil( totalPosts / page.pageSize ) - 1;
        postQuery
          .skip( page.pageSize * page.pageIndex )
          .limit( page.pageSize );
      }
      return postQuery;
    } )
    .then( posts => { // It's possible chain multiple promises
      res.status( 200 ).json( {
        message: 'Posts fetched successfully!',
        posts: posts,
        totalPosts: totalPosts,
        pageIndex: page.pageIndex
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
  Post.findById( req.params.id )
    .then( post => {
      if ( !post ) {
        res.status( 404 ).json( { message: 'Post not found!' } ); // 404 code for not found
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
 * This middleware find a specific element
 */
exports.findPost = ( req, res, next ) => {
  Post.findById( req.params.id )
    .then( post => {
      req.data = { ...req.data, ...{ find: post } };
      next();
    } ) // .find method is provided by Mongoose to its models
    .catch( error => {
      res.status( 500 ).json( { message: 'Finding Post failed!' } );
    } );
}

/*
 * This middleware delete a specific element
 */
exports.deletePost = ( req, res, next ) => {
  Post.deleteOne( { _id: req.params.id,  creator: req.data.tokenPayload.userId } )
    .then( result => {
      if ( result.n === 0 ) {
        res.status( 401 ).json( { message: 'Not authorized user!' } );
        return;
      }
      res.status( 200 ).json( { message: 'Post deleted successful!' } );
    } ) // .deleteOne method is provided by Mongoose to its models
    .catch( error => {
      res.status( 500 ).json( { message: 'Deleting Post failed!' } );
    } );
}