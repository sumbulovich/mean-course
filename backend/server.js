const http = require( 'http' ); // Import Node Package
const app = require( './app' ); // Import app
const debug = require( 'debug' )( 'node-angular' ); // Import debug and identifier

/*
 * Check if the port is valid
 */
const normalizePort = val => {
  var port = parseInt( val, 10 );

  if ( isNaN( port ) ) {
    return val;
  }
  if ( port >= 0 ) {
    return port;
  }
  return false;
};

/*
 * Check wich error occured
 */
const onError = error => {
  if ( error.syscall !== "listen" ) {
    throw error;
  }
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;

  switch( error.code ) {
    case "EACCES":
      console.log( bind + " requires elevaded privileges" );
      process.exit( 1 );
      break;
    case "EADORINUSE":
      console.log( bind + " is already in use" );
      process.exit( 1 );
      break;
    default:
      throw error;
  }
};

/*
 * Output where we are listening incoming request
 */
const onListening = () => {
  const addr = server.address;
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  debug( "Listening on " + bind );
};

const port = normalizePort( process.env.PORT || 3000 );
app.set( 'port', port ); // Set port

/*
const server = http.createServer( ( req, res ) => {
  res.end( 'This is my first response' );
} ); // Create server
*/
const server = http.createServer( app ); // Create Server
server.on( "error", onError );
server.on( "listening", onListening );
server.listen( port ); // Set listen port