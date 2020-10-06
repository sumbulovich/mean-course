const express = require( 'express' ); // Import Express Package
const bodyParser = require( 'body-parser' ); // Import Body Parser Package
const mongoose = require( 'mongoose' ); // Import Mongoose Package
const path = require( 'path' ); // Import path of Node.js
const globals = require( './globals' ); // Import Post routes
const postRoutes = require( './routes/post' ); // Import Post routes
const userRoutes = require( './routes/user' ); // Import User routes


const app = express(); // Create Express app

// <password>: LixcfGOg6dwrDXrB
// <dbname>: node-angular
mongoose.connect(
  'mongodb+srv://sumbulovich:' +
  process.env.MONGO_ATLAS_PSW +
  '@cluster0.rqulk.mongodb.net/' +
  process.env.MONGO_DB_NAME +
  '?retryWrites=true&w=majority',
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
const PATHS = globals.CONSTANTS.PATHS;
app.use(
  path.join( '/', PATHS.IMAGES, PATHS.POSTS ),
  express.static( path.join( PATHS.ROOT, PATHS.IMAGES, PATHS.POSTS ) )
);
app.use(
  path.join( '/', PATHS.IMAGES, PATHS.POSTS, PATHS.THUMBNAILS ),
  express.static( path.join( PATHS.ROOT, PATHS.IMAGES, PATHS.POSTS, PATHS.THUMBNAILS ) )
);
app.use(
  path.join( '/', PATHS.IMAGES, PATHS.USERS ),
  express.static( path.join( PATHS.ROOT, PATHS.IMAGES, PATHS.USERS ) )
);
app.use(
  path.join( '/', PATHS.IMAGES, PATHS.USERS, PATHS.THUMBNAILS ),
  express.static( path.join( PATHS.ROOT, PATHS.IMAGES, PATHS.USERS, PATHS.THUMBNAILS ) )
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

const API = globals.CONSTANTS.API;
app.use( API.POSTS, postRoutes ); // Use Post routes with the path '/api/post'
app.use( API.USERS, userRoutes ); // Use User routes with the path '/api/user'

module.exports = app; // Export app