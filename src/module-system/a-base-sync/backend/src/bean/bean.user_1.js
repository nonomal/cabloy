const require3 = require('require3');
const extend = require3('extend2');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const __atomClassUser = {
    module: moduleInfo.relativeName,
    atomClassName: 'user',
  };

  class User {
    async get(where) {
      return await this.model.get(where);
    }

    async add(
      { disabled = 0, userName, realName, email, mobile, avatar, motto, locale, anonymous = 0 },
      user,
      returnKey
    ) {
      // check if incomplete information
      let needCheck;
      if (anonymous) {
        needCheck = false;
      } else if (this.config.checkUserName === true) {
        needCheck = userName || email || mobile;
      } else {
        needCheck = email || mobile;
      }
      // if exists
      if (needCheck) {
        const res = await this.exists({ userName, email, mobile });
        if (res) ctx.throw.module(moduleInfo.relativeName, 1001);
      }
      if (!user) {
        user = { id: 0 };
      }
      // create
      const itemCreate = {
        atomName: userName,
      };
      const userKey = await ctx.bean.atom.create({
        atomClass: __atomClassUser,
        item: itemCreate,
        user,
      });
      // write
      const item = {
        disabled,
        userName,
        realName,
        email,
        mobile,
        avatar,
        motto,
        locale,
        anonymous,
      };
      if (userName) {
        item.atomName = userName;
      }
      await ctx.bean.atom.write({
        key: userKey,
        item,
        user,
      });
      // submit
      await ctx.bean.atom.submit({
        key: userKey,
        options: { ignoreFlow: true },
        user,
      });
      // ok
      return returnKey ? userKey : userKey.itemId;
    }

    async exists({ userName, email, mobile }) {
      userName = userName || '';
      email = email || '';
      mobile = mobile || '';
      if (this.config.checkUserName === true) {
        if (!userName && !email && !mobile) return null;
      } else {
        if (!email && !mobile) return null;
        userName = '';
      }
      if (this.config.checkUserName === true && userName) {
        return await this.model.queryOne(
          `select * from aUser
             where iid=? and deleted=0 and ((userName=?) or (?<>'' and email=?) or (?<>'' and mobile=?))`,
          [ctx.instance.id, userName, email, email, mobile, mobile]
        );
      }
      return await this.model.queryOne(
        `select * from aUser
             where iid=? and deleted=0 and ((?<>'' and email=?) or (?<>'' and mobile=?))`,
        [ctx.instance.id, email, email, mobile, mobile]
      );
    }

    async save({ user }) {
      if (Object.keys(user).length > 1) {
        await this.model.update(user);
      }
    }

    async getFields({ removePrivacy }) {
      let fields = await this.model.columns();
      if (removePrivacy) {
        fields = extend(true, {}, fields);
        const privacyFields = ctx.config.module(moduleInfo.relativeName).user.privacyFields.split(',');
        for (const privacyField of privacyFields) {
          delete fields[privacyField];
        }
      }
      return fields;
    }

    async getFieldsSelect({ removePrivacy, alias }) {
      const fields = await this.getFields({ removePrivacy });
      return Object.keys(fields)
        .map(item => (alias ? `${alias}.${item}` : item))
        .join(',');
    }

    async list({ roleId, query, anonymous, page, removePrivacy }) {
      const roleJoin = roleId ? 'left join aUserRole b on a.id=b.userId' : '';
      const roleWhere = roleId ? `and b.roleId=${ctx.model._format(roleId)}` : '';
      const queryLike = query ? ctx.model._format({ op: 'like', val: query }) : '';
      const queryWhere = query
        ? `and ( a.userName like ${queryLike} or a.realName like ${queryLike} or a.mobile like ${queryLike} )`
        : '';
      const anonymousWhere = anonymous !== undefined ? `and a.anonymous=${ctx.model._format(anonymous)}` : '';
      const _limit = ctx.model._limit(page.size, page.index);
      // fields
      const fields = await this.getFieldsSelect({ removePrivacy, alias: 'a' });
      // sql
      const sql = `
        select ${fields} from aUser a
          ${roleJoin}
            where a.iid=? and a.deleted=0
                  ${anonymousWhere}
                  ${roleWhere}
                  ${queryWhere}
            order by a.userName asc
            ${_limit}
      `;
      return await ctx.model.query(sql, [ctx.instance.id]);
    }

    async count({ options }) {
      return await this.select({ options, count: 1 });
    }

    async select({ options, pageForce = true, count = 0 }) {
      return await this._list({ options, pageForce, count });
    }

    async selectGeneral({ params, pageForce = true, count = 0 }) {
      const { query, page } = params;
      const options = {
        where: {
          'a.anonymous': 0,
          'a.disabled': 0,
        },
        orders: [['a.userName', 'asc']],
        page,
        removePrivacy: true,
      };
      if (query) {
        options.where.__or__ = [
          { 'a.userName': { op: 'like', val: query } },
          { 'a.realName': { op: 'like', val: query } },
          { 'a.mobile': { op: 'like', val: query } },
        ];
      }
      return await this._list({ options, pageForce, count });
    }

    async _list({ options: { where, orders, page, removePrivacy }, pageForce = true, count = 0 }) {
      page = ctx.bean.util.page(page, pageForce);
      // fields
      const fields = await this.getFieldsSelect({ removePrivacy, alias: 'a' });
      // sql
      const sql = this.sqlProcedure.selectUsers({
        iid: ctx.instance.id,
        where,
        orders,
        page,
        count,
        fields,
      });
      const res = await ctx.model.query(sql);
      return count ? res[0]._count : res;
    }

    async disable({ userId, disabled }) {
      await this.model.update({ id: userId, disabled });
    }

    async delete({ userId }) {
      await ctx.bean.role.deleteAllUserRoles({ userId });
      await this.modelAuth.delete({ userId });
      await this.model.delete({ id: userId });
    }

    // roles
    async roles({ userId, page }) {
      page = ctx.bean.util.page(page, false);
      const _limit = ctx.model._limit(page.size, page.index);
      return await ctx.model.query(
        `
        select a.*,b.roleName from aUserRole a
          left join aRole b on a.roleId=b.id
            where a.iid=? and a.userId=?
            ${_limit}
        `,
        [ctx.instance.id, userId]
      );
    }
  }
  return User;
};
