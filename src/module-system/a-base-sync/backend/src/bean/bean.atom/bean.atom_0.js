const require3 = require('require3');
// const debug = require3('debug')('sql');
const mparse = require3('egg-born-mparse').default;

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, 'atom');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    get atomClass() {
      return ctx.bean.atomClass.module(this.moduleName);
    }

    get modelAtom() {
      return ctx.model.module(moduleInfo.relativeName).atom;
    }

    get modelAtomStar() {
      return ctx.model.module(moduleInfo.relativeName).atomStar;
    }

    get modelLabel() {
      return ctx.model.module(moduleInfo.relativeName).label;
    }

    get modelAtomLabel() {
      return ctx.model.module(moduleInfo.relativeName).atomLabel;
    }

    get modelAtomLabelRef() {
      return ctx.model.module(moduleInfo.relativeName).atomLabelRef;
    }
    get modelFile() {
      return ctx.model.module('a-file').file;
    }

    get sequence() {
      return ctx.bean.sequence.module(moduleInfo.relativeName);
    }

    get sqlProcedure() {
      return ctx.bean._getBean(moduleInfo.relativeName, 'local.procedure');
    }

    // atom and item

    // create
    async create({ atomClass, atomStage, roleIdOwner, item, options, user }) {
      options = options || {};
      // atomClass
      atomClass = await ctx.bean.atomClass.get(atomClass);
      const _atomClass = await ctx.bean.atomClass.atomClass(atomClass);
      // atomSimple
      const atomSimple = Number(Boolean(_atomClass.simple));
      // item
      item = item || {};
      item.atomStage = atomStage !== undefined ? atomStage : atomSimple;
      item.roleIdOwner = roleIdOwner;
      // atom bean
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      const beanFullName = `${_moduleInfo.relativeName}.atom.${_atomClass.bean}`;
      const res = await ctx.meta.util.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { atomClass, item, options, user },
        fn: 'create',
      });
      const { atomId, itemId } = res;
      // save itemId
      await this._update({
        atom: { id: atomId, itemId },
        user,
      });
      // notify
      this._notifyDrafts();
      // ok
      const key = { atomId, itemId };
      const returnAtom = options.returnAtom;
      if (!returnAtom) return key;
      // read
      item = await this.read({ key, user });
      return { key, atom: item };
    }

    // read
    async read({ key, options, user }) {
      options = options || {};
      const atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      if (!atomClass) ctx.throw.module(moduleInfo.relativeName, 1002);
      // atom bean
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      const _atomClass = await ctx.bean.atomClass.atomClass(atomClass);
      const beanFullName = `${_moduleInfo.relativeName}.atom.${_atomClass.bean}`;
      const item = await ctx.meta.util.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { atomClass, options, key, user },
        fn: 'read',
      });
      // ok
      return item;
    }

    // readByStaticKey
    async readByStaticKey({ atomClass, atomStaticKey, atomRevision, atomStage }) {
      const options = {
        mode: 'full',
        stage: atomStage,
        where: {
          'a.atomStaticKey': atomStaticKey,
        },
      };
      if (atomRevision !== undefined) {
        options.where['a.atomRevision'] = atomRevision;
      }
      const list = await this.select({ atomClass, options });
      return list[0];
    }

    // count
    async count({ atomClass, options, user }) {
      return await this.select({ atomClass, options, user, count: 1 });
    }

    // select
    async select({ atomClass, options, user, pageForce = true, count = 0 }) {
      if (!options) options = {};
      if (!options.where) options.where = {};
      if (!options.orders) options.orders = [];
      // atomClass
      let _atomClass;
      let _moduleInfo;
      if (atomClass) {
        atomClass = await ctx.bean.atomClass.get(atomClass);
        _atomClass = await ctx.bean.atomClass.atomClass(atomClass);
        _moduleInfo = mparse.parseInfo(atomClass.module);
      }
      // selectBefore
      if (atomClass) {
        const beanFullName = `${_moduleInfo.relativeName}.atom.${_atomClass.bean}`;
        await ctx.meta.util.executeBean({
          beanModule: _moduleInfo.relativeName,
          beanFullName,
          context: { atomClass, options, user },
          fn: 'selectBefore',
        });
      }
      // tableName
      let tableName = '';
      if (_atomClass) {
        tableName = await this.getTableName({
          atomClass,
          atomClassBase: _atomClass,
          options,
          mode: options.mode,
          user,
          action: 'select',
          count,
        });
        // 'where' should append atomClassId, such as article/post using the same table
        options.where['a.atomClassId'] = atomClass.id;
      }
      // cms
      const cms = _atomClass && _atomClass.cms;
      // forAtomUser
      const forAtomUser = this._checkForAtomUser(atomClass);
      // select
      const items = await this._list({
        tableName,
        options,
        cms,
        forAtomUser,
        user,
        pageForce,
        count,
      });
      // select items
      if (!count) {
        if (atomClass) {
          const beanFullName = `${_moduleInfo.relativeName}.atom.${_atomClass.bean}`;
          await ctx.meta.util.executeBean({
            beanModule: _moduleInfo.relativeName,
            beanFullName,
            context: { atomClass, options, items, user },
            fn: 'select',
          });
        } else {
          await ctx.bean.atomBase.select({ atomClass, options, items, user });
        }
      }
      // ok
      return items;
    }

    // write
    //   target: should be null for frontend call
    async write({ key, target, item, options, user }) {
      // atomClass
      const atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      if (!atomClass) ctx.throw.module(moduleInfo.relativeName, 1002);
      if (!key.itemId) key.itemId = atomClass.itemId;
      // atom bean
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      const _atomClass = await ctx.bean.atomClass.atomClass(atomClass);
      const beanFullName = `${_moduleInfo.relativeName}.atom.${_atomClass.bean}`;
      // basic info
      const _atomBasic = await this.modelAtom.get({ id: key.atomId });
      if (_atomBasic.atomStage !== _atomBasic.atomSimple) ctx.throw(403);
      if (_atomBasic.atomSimple) {
        if (_atomClass.history !== false) {
          //  formal -> history
          await this._copy({
            target: 'history',
            srcKey: { atomId: key.atomId },
            srcItem: null,
            destKey: null,
            options,
            user,
          });
        }
      }
      // write draft/formal(simple)
      const itemWrite = Object.assign({}, item, {
        atomId: key.atomId,
        itemId: key.itemId,
        atomSimple: _atomBasic.atomSimple,
        atomStage: _atomBasic.atomSimple ? 1 : 0,
      });
      await ctx.meta.util.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { atomClass, target, key, item: itemWrite, options, user },
        fn: 'write',
      });
      // update formal version for simple
      if (_atomBasic.atomSimple) {
        await this.modelAtom.update({
          id: key.atomId,
          atomRevision: _atomBasic.atomRevision + 1,
        });
      }
    }

    // deleteBulk
    async deleteBulk({ keys, user }) {
      const resKeys = [];
      for (const key of keys) {
        const res = await this._deleteBulk_item({ key, user });
        if (res) {
          resKeys.push(key);
        }
      }
      return { keys: resKeys };
    }

    // delete
    async delete({ key, options, user }) {
      const atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      if (!atomClass) ctx.throw.module(moduleInfo.relativeName, 1002);
      if (!key.itemId) key.itemId = atomClass.itemId;
      // atom bean
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      const _atomClass = await ctx.bean.atomClass.atomClass(atomClass);
      const beanFullName = `${_moduleInfo.relativeName}.atom.${_atomClass.bean}`;
      // atom
      const _atom = await this.modelAtom.get({ id: key.atomId });
      if (_atom.atomStage === 0) {
        // close draft
        await this.closeDraft({ key });
      } else if (_atom.atomStage === 1) {
        // delete history
        const listHistory = await this.modelAtom.select({
          where: {
            atomStage: 2,
            atomIdFormal: _atom.id,
          },
        });
        for (const item of listHistory) {
          await ctx.meta.util.executeBean({
            beanModule: _moduleInfo.relativeName,
            beanFullName,
            context: { atomClass, key: { atomId: item.id, itemId: item.itemId }, options, user },
            fn: 'delete',
          });
        }
        // delete draft
        const itemDraft = await this.modelAtom.get({
          atomStage: 0,
          atomIdFormal: _atom.id,
        });
        if (itemDraft) {
          await ctx.meta.util.executeBean({
            beanModule: _moduleInfo.relativeName,
            beanFullName,
            context: { atomClass, key: { atomId: itemDraft.id, itemId: itemDraft.itemId }, options, user },
            fn: 'delete',
          });
          // notify
          this._notifyDrafts();
        }
        // delete formal
        await ctx.meta.util.executeBean({
          beanModule: _moduleInfo.relativeName,
          beanFullName,
          context: { atomClass, key: { atomId: _atom.id, itemId: _atom.itemId }, options, user },
          fn: 'delete',
        });
      } else if (_atom.atomStage === 2) {
        // delete history self
        await ctx.meta.util.executeBean({
          beanModule: _moduleInfo.relativeName,
          beanFullName,
          context: { atomClass, key: { atomId: _atom.id, itemId: _atom.itemId }, options, user },
          fn: 'delete',
        });
      }
    }

    async submit({ key, options, user }) {
      const atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      if (!atomClass) ctx.throw.module(moduleInfo.relativeName, 1002);
      if (!key.itemId) key.itemId = atomClass.itemId;
      // atom
      const _atom = await this.modelAtom.get({ id: key.atomId });
      if (_atom.atomSimple === 1 && _atom.atomStage === 1) {
        // if simple, just return formal, so as for compatible with not simple
        return { formal: { key } };
      }
      // atom bean
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      const _atomClass = await ctx.bean.atomClass.atomClass(atomClass);
      const beanFullName = `${_moduleInfo.relativeName}.atom.${_atomClass.bean}`;
      return await ctx.meta.util.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { atomClass, key, options, user },
        fn: 'submit',
      });
    }

    async closeDraft({ key }) {
      const atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      if (!atomClass) ctx.throw.module(moduleInfo.relativeName, 1002);
      if (!key.itemId) key.itemId = atomClass.itemId;
      // atom bean
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      const _atomClass = await ctx.bean.atomClass.atomClass(atomClass);
      const beanFullName = `${_moduleInfo.relativeName}.atom.${_atomClass.bean}`;
      // draft
      const atomIdDraft = key.atomId;
      const atomDraft = await this.modelAtom.get({ id: atomIdDraft });
      const user = { id: atomDraft.userIdUpdated };
      // ** update draft from formal
      if (atomDraft.atomIdFormal) {
        await this._copy({
          target: 'draft',
          srcKey: { atomId: atomDraft.atomIdFormal },
          srcItem: null,
          destKey: key,
          user,
        });
        // update atomClosed
        await this.modelAtom.update({
          id: atomIdDraft,
          atomClosed: 1,
        });
      } else {
        // not delete draft if atomFlowId>0
        if (atomDraft.atomFlowId > 0) {
          // update atomClosed
          await this.modelAtom.update({
            id: atomIdDraft,
            atomClosed: 1,
            atomRevision: atomDraft.atomRevision - 1,
          });
        } else {
          // delete
          await ctx.meta.util.executeBean({
            beanModule: _moduleInfo.relativeName,
            beanFullName,
            context: { atomClass, key, user },
            fn: 'delete',
          });
        }
      }
      // notify
      this._notifyDrafts(user);
      this._notifyDraftsFlowing(user);
    }

    async openDraft({ key, user }) {
      // atomClass
      const atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      if (!atomClass) ctx.throw.module(moduleInfo.relativeName, 1002);
      const _atomClass = await ctx.bean.atomClass.atomClass(atomClass);
      // atom
      let atom = await this.modelAtom.get({ id: key.atomId });
      if (!atom) ctx.throw.module(moduleInfo.relativeName, 1002);
      // check simple switch
      atom = await this._checkSimpleSwitch({ atomClass, _atomClass, atom, user });
      // open draft
      let res;
      if (atom.atomSimple) {
        // simple
        res = await this._openDraft_asSimple({ atomClass, _atomClass, atom, user });
      } else {
        // not simple
        res = await this._openDraft_asSimpleZero({ atomClass, _atomClass, atom, user });
      }
      // ok
      // get atom
      const resData = res.draft || res.formal;
      const keyDraft = resData.key;
      atom = await this.modelAtom.get({ id: keyDraft.atomId });
      atom.atomId = atom.id;
      atom.module = atomClass.module;
      atom.atomClassName = atomClass.atomClassName;
      if (res.draft) {
        res.draft.atom = atom;
      } else {
        res.formal.atom = atom;
      }
      return res;
    }

    async enable({ key, user }) {
      // atomClass
      const atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      if (!atomClass) ctx.throw.module(moduleInfo.relativeName, 1002);
      if (!key.itemId) key.itemId = atomClass.itemId;
      // atom bean
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      const _atomClass = await ctx.bean.atomClass.atomClass(atomClass);
      const beanFullName = `${_moduleInfo.relativeName}.atom.${_atomClass.bean}`;
      await ctx.meta.util.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { atomClass, key, user },
        fn: 'enable',
      });
    }

    async disable({ key, user }) {
      // atomClass
      const atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      if (!atomClass) ctx.throw.module(moduleInfo.relativeName, 1002);
      if (!key.itemId) key.itemId = atomClass.itemId;
      // atom bean
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      const _atomClass = await ctx.bean.atomClass.atomClass(atomClass);
      const beanFullName = `${_moduleInfo.relativeName}.atom.${_atomClass.bean}`;
      await ctx.meta.util.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { atomClass, key, user },
        fn: 'disable',
      });
    }

    async clone({ key, user }) {
      // atomClass
      const atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      if (!atomClass) ctx.throw.module(moduleInfo.relativeName, 1002);
      // copy
      const keyDraft = await this._copy({
        target: 'clone',
        srcKey: { atomId: key.atomId },
        srcItem: null,
        destKey: null,
        user,
      });
      // ok
      // get atom
      const atom = await this.read({ key: keyDraft, user });
      // draft/formal
      const res = { key: keyDraft, atom };
      if (atom.atomStage === 0) return { draft: res };
      return { formal: res };
    }

    async exportBulk({ atomClass, options, fields, user }) {
      // atomClass
      let _atomClass;
      if (atomClass) {
        atomClass = await ctx.bean.atomClass.get(atomClass);
        _atomClass = await ctx.bean.atomClass.atomClass(atomClass);
      }
      // select
      const items = await this.select({ atomClass, options, user, pageForce: false });
      // export
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      const beanFullName = `${_moduleInfo.relativeName}.atom.${_atomClass.bean}`;
      const resExport = await ctx.meta.util.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { atomClass, options, fields, items, user },
        fn: 'exportBulk',
      });
      // file
      const resFile = await ctx.bean.file._upload({
        fileContent: resExport.data,
        meta: resExport.meta,
        user,
      });
      // ok
      return resFile;
    }

    // atom other functions

    async get({ atomId }) {
      return await this.modelAtom.get({ id: atomId });
    }

    async flow({ key, atom: { atomFlowId } }) {
      await this.modelAtom.update({
        id: key.atomId,
        atomFlowId,
      });
      // notify
      const item = await this.modelAtom.get({ id: key.atomId });
      const user = { id: item.userIdUpdated };
      this._notifyDrafts(user);
      this._notifyDraftsFlowing(user);
    }

    async star({ key, atom: { star = 1 }, user }) {
      // get
      const atom = await this.get({ atomId: key.atomId });
      if (atom.atomStage !== 1) ctx.throw.module(moduleInfo.relativeName, 1010);
      // check if exists
      let diff = 0;
      const _star = await this.modelAtomStar.get({
        userId: user.id,
        atomId: key.atomId,
      });
      if (_star && !star) {
        diff = -1;
        // delete
        await this.modelAtomStar.delete({
          id: _star.id,
        });
      } else if (!_star && star) {
        diff = 1;
        // new
        await this.modelAtomStar.insert({
          userId: user.id,
          atomId: key.atomId,
          star: 1,
        });
      }
      // starCount
      let starCount = atom.starCount;
      if (diff !== 0) {
        starCount += diff;
        await this.modelAtom.update({
          id: key.atomId,
          starCount,
        });
      }
      // notify
      this._notifyStars();
      // ok
      return { star, starCount };
    }

    async readCount({ key, atom: { readCount = 1 }, user }) {
      await this.modelAtom.query('update aAtom set readCount = readCount + ? where iid=? and id=?', [
        readCount,
        ctx.instance.id,
        key.atomId,
      ]);
    }

    async comment({ key, atom: { comment = 1 }, user }) {
      await this.modelAtom.query('update aAtom set commentCount = commentCount + ? where iid=? and id=?', [
        comment,
        ctx.instance.id,
        key.atomId,
      ]);
    }

    async attachment({ key, atom: { attachment = 1 }, user }) {
      await this.modelAtom.query('update aAtom set attachmentCount = attachmentCount + ? where iid=? and id=?', [
        attachment,
        ctx.instance.id,
        key.atomId,
      ]);
    }

    async stats({ atomIds, user }) {
      const list = [];
      for (const atomId of atomIds) {
        const res = await this.checkRightRead({ atom: { id: atomId }, user, checkFlow: true });
        if (res) {
          list.push({
            id: atomId,
            atomId,
            readCount: res.readCount,
            commentCount: res.commentCount,
            starCount: res.starCount,
          });
        }
      }
      return list;
    }

    async labels({ key, atom: { labels = null }, user }) {
      // get
      const atom = await this.get({ atomId: key.atomId });
      if (atom.atomStage !== 1) ctx.throw.module(moduleInfo.relativeName, 1010);
      // force delete
      await this.modelAtomLabel.delete({
        userId: user.id,
        atomId: key.atomId,
      });
      await this.modelAtomLabelRef.delete({
        userId: user.id,
        atomId: key.atomId,
      });
      // new
      if (labels && labels.length > 0) {
        await this.modelAtomLabel.insert({
          userId: user.id,
          atomId: key.atomId,
          labels: JSON.stringify(labels),
        });
        for (const labelId of labels) {
          await this.modelAtomLabelRef.insert({
            userId: user.id,
            atomId: key.atomId,
            labelId,
          });
        }
      }
      // notify
      this._notifyLabels();
    }

    async getLabels({ user }) {
      const data = await this.modelLabel.get({
        userId: user.id,
      });
      let labels = data ? JSON.parse(data.labels) : null;
      if (!labels || Object.keys(labels).length === 0) {
        // append default labels
        labels = {
          1: {
            color: 'red',
            text: ctx.text('Red'),
          },
          2: {
            color: 'orange',
            text: ctx.text('Orange'),
          },
        };
        await this.setLabels({ labels, user });
      }
      return labels;
    }

    async setLabels({ labels, user }) {
      const labels2 = JSON.stringify(labels);
      const res = await this.modelLabel.get({
        userId: user.id,
      });
      if (!res) {
        await this.modelLabel.insert({
          userId: user.id,
          labels: labels2,
        });
      } else {
        await this.modelLabel.update({
          id: res.id,
          labels: labels2,
        });
      }
    }

    async schema({ atomClass, schema }) {
      const validator = await this.validator({ atomClass });
      if (!validator) return null;
      return ctx.bean.validation.getSchema({ module: validator.module, validator: validator.validator, schema });
    }

    async validator({ atomClass }) {
      atomClass = await this.atomClass.get(atomClass);
      atomClass = await this.atomClass.top(atomClass);
      return await this.atomClass.validator({ atomClass });
    }

    async getTableName({ atomClass, atomClassBase, options, mode, user, action, key, count }) {
      const tableNameModes = atomClassBase.tableNameModes || {};
      let tableName;
      if (mode === 'search') {
        tableName = tableNameModes.search || tableNameModes.full || tableNameModes.default || atomClassBase.tableName;
      } else {
        tableName = tableNameModes[mode] || tableNameModes.default || atomClassBase.tableName;
      }
      if (!tableName) return tableName;
      // if function
      if (typeof tableName !== 'string') {
        tableName = await tableName({ ctx, atomClass, atomClassBase, options, mode, user, action, key, count });
      } else {
        // check if resource
        if (atomClassBase.resource) {
          const optionsResource = options && options.resource;
          if (!optionsResource) {
            tableName = `(
                  select ___a.*,
                    ___c.atomNameLocale
                    from ${tableName} ___a
                    left join aResourceLocale ___c on ___a.atomId=___c.atomId and ___c.locale='${ctx.locale}'
                )`;
          }
        }
      }
      // ok
      return tableName;
    }

    async getAtomClassId({ module, atomClassName, atomClassIdParent = 0 }) {
      ctx.app.meta.util.deprecated('ctx.bean.atom.getAtomClassId', 'ctx.bean.atomClass.get');
      const atomClass = await ctx.bean.atomClass.get({ module, atomClassName, atomClassIdParent });
      return atomClass.id;
    }
  }

  return Atom;
};