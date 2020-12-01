module.exports = ( io ) => {
  io = io.of( '/socket' ); // namespace
  io.on( 'connection', ( socket ) => {
    socket.emit( 'connected', socket.id ); // emit to same socket

    socket.on( 'join', ( room ) => {
      socket.join( room );
      io = io.to( room ); // room
      socket.emit( 'joined', socket.id );
      // const roomClients = io.adapter.rooms[ room ].length;
      // const serverClients = io.server.engine.clientsCount;
      // console.log( `Socket: ${socket.id}\nRoom: ${room} (${roomClients}/${serverClients})` );
    } );

    socket.on( 'emit', () => {
      io.emit( 'emitted', socket.id ); // emit to all sockets
    } );
  } );
}