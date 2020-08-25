module.exports = {
  packages: {
    'ng2-img-max': {
      ignorableDeepImportMatchers: [
        /exifr\//,
      ]
    },
    'ng2-pica': {
      ignorableDeepImportMatchers: [
        /exifr\//,
        /pica\//
      ]
    }
  }
};