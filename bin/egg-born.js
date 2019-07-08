#!/usr/bin/env node

const co = require('co');
const Command = require('egg-init');
const path = require('path');
const fse = require('fs-extra');

co(function* () {

  const options = {
    name: 'egg-born',
    configName: 'egg-born-init-config',
    pkgInfo: require('../package.json'),
  };

  const command = new Command(options);

  command.printUsage = function() {
    this.log(`usage:
      - cd ${this.targetDir}
      - npm install
      - npm run dev:front
      - npm run build:front
      - npm run dev:backend
      - npm run debug:backend
      - npm run lint
      - npm run test:backend
      - npm run cov:backend
      - npm run start:backend
      - npm run stop:backend
    `);
  };

  const askForVariable = command.askForVariable;
  command.askForVariable = function* (targetDir, templateDir) {
    const locals = yield askForVariable.call(command, targetDir, templateDir);
    // targetDir
    locals.targetDir = this.targetDir.replace(/\\/gi, '/');
    // publicDir
    locals.publicDir = path.join(require('os').homedir(), 'cabloy', locals.name).replace(/\\/gi, '/');
    return locals;
  };

  const processFiles = command.processFiles;
  command.processFiles = function* (targetDir, templateDir) {
    yield processFiles.call(command, targetDir, templateDir);
    // download egg-born-module-test-cook
    const pkg = require(path.join(templateDir, 'package.json'));
    if (pkg.name === 'egg-born-template-cabloy') {
      // download
      const testCookDir = yield this.downloadBoilerplate('egg-born-module-test-cook');
      // move
      const destDir = path.join(targetDir, 'src/module');
      fse.moveSync(testCookDir, path.join(destDir, 'test-cook'));
      // delete .gitkeep
      fse.removeSync(path.join(destDir, '.gitkeep'));
    }
  };

  // run
  yield command.run(process.cwd(), process.argv.slice(2));

}).catch(err => {
  console.error(err.stack);
  process.exit(1);
});

