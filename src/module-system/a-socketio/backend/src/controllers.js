const version = require('./controller/version.js');
const io = require('./controller/io.js');
const messageClass = require('./controller/messageClass.js');
const message = require('./controller/message.js');

module.exports = app => {
  const controllers = {
    version,
    io,
    messageClass,
    message,
  };
  return controllers;
};
