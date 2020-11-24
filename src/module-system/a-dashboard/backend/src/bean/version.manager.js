module.exports = app => {

  class Version extends app.meta.BeanBase {

    async update(options) {
      if (options.version === 1) {
        // create table: aDashboardProfile
        const sql = `
          CREATE TABLE aDashboardProfile (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            profileName varchar(255) DEFAULT NULL,
            profileValue json DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);
      }

      if (options.version === 2) {
        // alter table: aDashboardProfile
        // remove: userId/profileName/profileValue
        // add: atomId description
        let sql = `
          ALTER TABLE aDashboardProfile
            DROP COLUMN userId,
            DROP COLUMN profileName,
            DROP COLUMN profileValue,
            ADD COLUMN atomId int(11) DEFAULT '0',
            ADD COLUMN description varchar(255) DEFAULT NULL
          `;
        await this.ctx.model.query(sql);

        // create table: aDashboardProfileContent
        sql = `
          CREATE TABLE aDashboardProfileContent (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            itemId int(11) DEFAULT '0',
            content JSON DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        // create table: aDashboardProfileUser
        sql = `
          CREATE TABLE aDashboardProfileUser (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            profileDefault int(11) DEFAULT '0',
            profileAtomId int(11) DEFAULT '0',
            profileName varchar(255) DEFAULT NULL,
            content JSON DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        // create view: aDashboardProfileViewFull
        sql = `
          CREATE VIEW aDashboardProfileViewFull as
            select a.*,b.content from aDashboardProfile a
              left join aDashboardProfileContent b on a.id=b.itemId
        `;
        await this.ctx.model.query(sql);

      }

    }

    async init(options) {
      if (options.version === 1) {
        // roleFunctions: widgets
        const roleWidgets = [
          { roleName: null, name: 'widgetAbout' },
        ];
        await this.ctx.bean.role.addRoleFunctionBatch({ roleFunctions: roleWidgets });
      }

      if (options.version === 2) {
        // add role rights
        const roleRights = [
          { roleName: 'system', action: 'create' },
          { roleName: 'system', action: 'read', scopeNames: 0 },
          { roleName: 'system', action: 'read', scopeNames: 'superuser' },
          { roleName: 'system', action: 'write', scopeNames: 0 },
          { roleName: 'system', action: 'write', scopeNames: 'superuser' },
          { roleName: 'system', action: 'delete', scopeNames: 0 },
          { roleName: 'system', action: 'delete', scopeNames: 'superuser' },
          { roleName: 'system', action: 'clone', scopeNames: 0 },
          { roleName: 'system', action: 'clone', scopeNames: 'superuser' },
          { roleName: 'system', action: 'deleteBulk' },
          { roleName: 'system', action: 'exportBulk' },
          { roleName: 'root', action: 'read', scopeNames: 'superuser' },
        ];
        await this.ctx.bean.role.addRoleRightBatch({ atomClassName: 'profile', roleRights });
      }
    }

    async test() { }

  }

  return Version;
};
