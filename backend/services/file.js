const multer = require( 'multer' ); // Import Multer package
const fs = require( 'fs' ) // Import File System of Node.js

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

exports.storeFile = ( pathMap ) => {
  const storage = multer.diskStorage( {
    destination: ( req, file, cb ) => {
      const isValid = MIME_TYPE_MAP[ file.mimetype ];
      const error = isValid ? null : new Error( 'Invalid mime type' );
      cb( error, pathMap[ req.files.length ] );
    },
    filename: ( req, file, cb ) => {
      const ext = MIME_TYPE_MAP[ file.mimetype ];
      cb( null, file.originalname + '.' + ext );
    }
  } ); // Define how Multer stores files

  return multer( { storage: storage } ).array( 'image' );
  // .array or .single methods are provided by Multer to extract
  // one or multiple files from the property name passed
}

exports.createDirectories = ( pathMap ) => {
  return ( req, res, next ) => {
    Object.values( pathMap ).forEach( dir => {
      fs.mkdir( dir, { recursive: true }, error => {
        if ( error ) {
          return console.error( error.message );
        } // .unlink method provided by Fs to create directories
      } );
    } );
    next();
  }
};

exports.deleteFile = ( pathMap ) => {
  return ( req, res, next ) => {
    const isImageDeleted = !req.body.imagePath;
    const isImageReplaced = req.files && req.files.length;
    if ( req.data.find.imagePath && ( isImageDeleted || isImageReplaced ) ) {
      const filename = req.data.find.imagePath.split( '/' ).pop();
      Object.values( pathMap ).forEach( path => {
        fs.unlink( path + '/' + filename , error => {
          if ( error ) {
            return console.error( error.message );
          }
        } ); // .unlink method provided by Fs to delete a file async
      });
    }
    next();
  }
}


