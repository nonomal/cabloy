const moduleInfo = module.info;
module.exports = class Cli extends module.meta.class.CliBase {
  async execute({ user }) {
    const { argv } = this.context;
    // super
    await super.execute({ user });
    // module name/info
    const moduleName = argv.module;
    argv.moduleInfo = this.helper.parseModuleInfo(moduleName);
    // check if exists
    const _module = this.helper.findModule(moduleName);
    if (!_module) {
      throw new Error(`module does not exist: ${moduleName}`);
    }
    // target dir
    const targetDir = await this.helper.ensureDir(_module.root);
    // componentName
    // const componentName=argv.componentName;
    // render
    await this.template.renderBoilerplateAndSnippets({
      targetDir,
      moduleName: moduleInfo.relativeName,
      snippetsPath: 'front/renderTableCell/snippets',
      boilerplatePath: 'front/renderTableCell/boilerplate',
    });
    // need not reload
    // ctx.app.meta.reload.now();
  }
};
