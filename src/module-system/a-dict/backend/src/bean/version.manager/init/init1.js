module.exports = function (ctx) {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class VersionInit {
    async run(options) {
      // // add role rights
      // const roleRights = [
      //   { roleName: 'system', action: 'create' },
      //   { roleName: 'system', action: 'read', scopeNames: 0 },
      //   { roleName: 'system', action: 'read', scopeNames: 'superuser' },
      //   { roleName: 'system', action: 'write', scopeNames: 0 },
      //   { roleName: 'system', action: 'write', scopeNames: 'superuser' },
      //   { roleName: 'system', action: 'delete', scopeNames: 0 },
      //   { roleName: 'system', action: 'delete', scopeNames: 'superuser' },
      //   { roleName: 'system', action: 'clone', scopeNames: 0 },
      //   { roleName: 'system', action: 'clone', scopeNames: 'superuser' },
      //   { roleName: 'system', action: 'authorize', scopeNames: 0 },
      //   { roleName: 'system', action: 'authorize', scopeNames: 'superuser' },
      //   { roleName: 'system', action: 'deleteBulk' },
      //   { roleName: 'system', action: 'exportBulk' },
      // ];
      // await this.ctx.bean.role.addRoleRightBatch({ atomClassName: 'dict', roleRights });
    }
  }

  return VersionInit;
};
