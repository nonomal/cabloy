const schemas = require('./meta/validation/schemas.js');
const staticLayouts = require('./meta/static/layouts.js');
const staticResources = require('./meta/static/resources.js');
const meta = {
  base: {
    atoms: {},
    statics: {
      'a-baselayout.layout': {
        items: staticLayouts,
      },
      'a-base.resource': {
        items: staticResources,
      },
    },
  },
  validation: {
    validators: {},
    keywords: {},
    schemas,
  },
  index: {
    indexes: {},
  },
};
module.exports = meta;
