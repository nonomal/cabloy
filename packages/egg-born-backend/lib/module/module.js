const glob = require('glob');
const semver = require('semver');
const chalk = require('chalk');
const mparse = require('egg-born-mparse').default;
const policy = require('./policy.js');
const util = require('./util.js');

module.exports = function(loader) {

  // all modules
  const ebModules = loader.app.meta.modules = {};
  const ebModulesArray = loader.app.meta.modulesArray = [];

  // parse/order modules
  orderModules(parseModules(loader));
  // load modules
  loadModules();
  // log modules
  logModules();

  function logModules() {
    if (loader.app.meta.inAgent) {
      for (const module of ebModulesArray) {
        console.log(module.info.fullName);
      }
    }
  }

  function loadModules() {
    for (const module of ebModulesArray) {
      module.main = loader.loadFile(module.file, loader.app, module);
    }
  }

  function orderModules(modules) {
    // 'a-version' first
    _pushModule(modules, 'a-version');
    // others
    for (const key in modules) {
      if (key !== 'a-version') {
        _pushModule(modules, key);
      }
    }
  }

  function _pushModule(modules, moduleRelativeName) {
    // module
    const module = modules[moduleRelativeName];
    if (module.__ordering) return;
    module.__ordering = true;

    // dependencies
    _orderDependencies(modules, module);

    // push this
    ebModules[moduleRelativeName] = module;
    ebModulesArray.push(module);
  }

  function _orderDependencies(modules, module) {
    if (!module.package.eggBornModule || !module.package.eggBornModule.dependencies) return;

    const dependencies = module.package.eggBornModule.dependencies;
    for (const key in dependencies) {
      const subModule = modules[key];
      if (!subModule) {
        console.warn(chalk.cyan(`module ${key} not exists`));
        process.exit(0);
      }

      const subModuleVersion = dependencies[key];
      if (semver.lt(subModule.package.version, subModuleVersion)) {
        console.warn(chalk.cyan(`module ${key} is old`));
        process.exit(0);
      }

      _pushModule(modules, key);
    }
  }

  function parseModules(loader) {
    // project first, then nodeModules
    return _parseModules(_parseModules({}, policy.projectModules, loader), policy.nodeModules, loader);
  }

  function _parseModules(modules, policy, loader) {
    const files = glob.sync(`${policy.modulesPath}*${policy.jsPath}`);
    files.forEach(file => {
      const pos1 = policy.modulesPath.length;
      const pos2 = file.indexOf('/', pos1);
      const name = file.substr(pos1, pos2 - pos1);

      const info = mparse.parseInfo(name);
      if (!modules[info.relativeName]) {
        const pkg = util.lookupPackage(file);
        modules[info.relativeName] = { file, name, info, pkg, package: require(pkg) };
      }
    });
    return modules;
  }

  return ebModules;
};
