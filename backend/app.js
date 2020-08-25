const express = require( 'express' ); // Import Express Package
const bodyParser = require( 'body-parser' ); // Import Body Parser Package
const mongoose = require( 'mongoose' ); // Import Mongoose Package
const path = require( 'path' ); // Import path of Node.js
const globals = require( './globals' ); // Import Post routes
const postRoutes = require( './routes/post' ); // Import Post routes
const userRoutes = require( './routes/user' ); // Import User routes


const app = express(); // Create Express app

const PATHS = globals.CONSTANTS.PATHS;

// <password>: LixcfGOg6dwrDXrB
// <dbname>: node-angular
mongoose.connect(
  'mongodb+srv://sumbulovich:LixcfGOg6dwrDXrB@cluster0.rqulk.mongodb.net/node-angular?retryWrites=true&w=majority',
  {
    useUnifiedTopology: true,
    useNewUrlParser: true
  }
)
  .then( () => {
    console.log( 'Connected to database!' );
  } )
  .catch( () => {
    console.log( 'Connection failed!' );
  } );

/*
app.use( (req, res, next ) => {
  console.log( 'First middleware' );
  res.send( 'Hello from express!' );
  next(); // Returns a response and continue to the next middleware
} );
*/

/*
 * This middleware parses JSON data
 */
app.use( bodyParser.json() );
/*
 * This middleware is for encoded URLs
 */
app.use( bodyParser.urlencoded( { extended: false } ) );
/*
 * This middleware makes accecible /images path linking it to /image folder accesible
 */
app.use(
  path.join( '/', PATHS.IMAGES, PATHS.POSTS ),
  express.static( path.join( PATHS.ROOT, PATHS.IMAGES, PATHS.POSTS ) )
);
app.use(
  path.join( '/', PATHS.IMAGES, PATHS.POSTS, PATHS.THUMBNAILS ),
  express.static( path.join( PATHS.ROOT, PATHS.IMAGES, PATHS.POSTS, PATHS.THUMBNAILS ) )
);
/*
 * This middleware defines the Headers of the server
 */
app.use( (req, res, next ) => {
  res.setHeader(
    'Access-Control-Allow-Origin',
    '*'
  ); // Allow to access to all resources

  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Request-With, Content-Type, Accept, Authorization' // Allow custom Authorization header
  ); // Restrict the incoming request to have the defined headers

  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  ); // Restric wich methods are allowed

  next();
} );

app.use( '/api/' + PATHS.POSTS, postRoutes ); // Use Post routes with the path '/api/post'
app.use( '/api/' + PATHS.USERS, userRoutes ); // Use User routes with the path '/api/user'

module.exports = app; // Export app