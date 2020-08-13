const express = require( 'express' ); // Import Express Package
const bodyParser = require( 'body-parser' ); // Import Body Parser Package
const mongoose = require( 'mongoose' ); // Import Mongoose Package
const path = require( 'path' );
const postRoutes = require( './routes/post' ); // Import Post routes

const app = express(); // Create Express app

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
app.use( '/images', express.static( path.join( 'backend/images/posts' ) ) );
app.use( '/images/thumbnails', express.static( path.join( 'backend/images/posts/thumbnails' ) ) );
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
    'Origin, X-Request-With, Content-Type, Accept'
  ); // Restrict the incoming request to have the definned headers

  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  ); // Restric wich methods are allowed

  next();
} );

app.use( '/api/posts', postRoutes ); // Use Post routes with the path '/api/posts'

module.exports = app; // Export app