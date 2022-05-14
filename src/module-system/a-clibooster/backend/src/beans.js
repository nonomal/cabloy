const versionManager = require('./bean/version.manager.js');
const cliDefaultDemo = require('./bean/cli.default.demo.js');
const cliDefaultList = require('./bean/cli.default.list.js');
const cliTokenAdd = require('./bean/cli.token.add.js');
const cliTokenDelete = require('./bean/cli.token.delete.js');
const cliTokenList = require('./bean/cli.token.list.js');
const cliToolsBabel = require('./bean/cli.tools.babel.js');
const cliToolsIcons = require('./bean/cli.tools.icons.js');
const cliCreateSuite = require('./bean/cli.create.suite.js');
const cliCreateModule = require('./bean/cli.create.module.js');
const cliCreateAtom = require('./bean/cli.create.atom.js');
const cliCreateController = require('./bean/cli.create.controller.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // cli
    'cli.default.demo': {
      mode: 'ctx',
      bean: cliDefaultDemo,
    },
    'cli.default.list': {
      mode: 'ctx',
      bean: cliDefaultList,
    },
    'cli.token.add': {
      mode: 'ctx',
      bean: cliTokenAdd,
    },
    'cli.token.delete': {
      mode: 'ctx',
      bean: cliTokenDelete,
    },
    'cli.token.list': {
      mode: 'ctx',
      bean: cliTokenList,
    },
    'cli.tools.babel': {
      mode: 'ctx',
      bean: cliToolsBabel,
    },
    'cli.tools.icons': {
      mode: 'ctx',
      bean: cliToolsIcons,
    },
    'cli.create.suite': {
      mode: 'ctx',
      bean: cliCreateSuite,
    },
    'cli.create.module': {
      mode: 'ctx',
      bean: cliCreateModule,
    },
    'cli.create.atom': {
      mode: 'ctx',
      bean: cliCreateAtom,
    },
    'cli.create.controller': {
      mode: 'ctx',
      bean: cliCreateController,
    },
  };
  return beans;
};