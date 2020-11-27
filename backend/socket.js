module.exports = ( io ) => {
  const namespace = io.of( '/socket' )
  namespace.on( 'connection', ( socket ) => {
    socket.on( 'room', ( roomName ) => {
      socket.join( roomName );
      socket.on( 'emit', ( data ) => {
        namespace.to( roomName ).emit( 'emit', data );
      } );

      const roomClients = namespace.adapter.rooms[ roomName ].length;
      const serverClients = io.engine.clientsCount;
      console.log( `Socket: ${socket.id}\nRoom: ${roomName} (${roomClients}/${serverClients})` );
    } );
  } );
}