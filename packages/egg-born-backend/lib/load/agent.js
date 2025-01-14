const path = require('path');
const AgentWorkerLoader = require('egg').AgentWorkerLoader;
const loadModules = require('../module');

module.exports = class CustomAgentWorkerLoader extends AgentWorkerLoader {
  // constructor(opt) {
  //   super(opt);
  // }
  loadConfig() {
    super.loadConfig();
    this.app.subdomainOffset = typeof this.config.subdomainOffset === 'undefined' ? 2 : this.config.subdomainOffset;
  }
  load() {
    super.load();
    // load modules
    loadModules(this);
  }
  getAppname() {
    if (!this.pkgCabloy) {
      this.pkgCabloy = require(path.join(process.cwd(), 'package.json'));
      this.pkg.name = this.pkgCabloy.name;
    }
    return this.pkgCabloy.name;
  }
};
