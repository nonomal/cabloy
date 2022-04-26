module.exports = app => {
  class Atom extends app.meta.AtomBase {
    async create({ atomClass, item, options, user }) {
      // super
      const key = await super.create({ atomClass, item, options, user });
      // add {{atomClassName}}
      const res = await this.ctx.model.{{atomClassName}}.insert({
        atomId: key.atomId,
      });
      // return key
      return { atomId: key.atomId, itemId: res.insertId };
    }

    async read({ atomClass, options, key, user }) {
      // super
      const item = await super.read({ atomClass, options, key, user });
      if (!item) return null;
      // meta
      this._getMeta(item);
      // ok
      return item;
    }

    async select({ atomClass, options, items, user }) {
      // super
      await super.select({ atomClass, options, items, user });
      // meta
      for (const item of items) {
        this._getMeta(item);
      }
    }

    async write({ atomClass, target, key, item, options, user }) {
      // super
      await super.write({ atomClass, target, key, item, options, user });
      // update {{atomClassName}}
      const data = await this.ctx.model.{{atomClassName}}.prepareData(item);
      data.id = key.itemId;
      await this.ctx.model.{{atomClassName}}.update(data);
    }

    async delete({ atomClass, key, options, user }) {
      // super
      await super.delete({ atomClass, key, options, user });
      // delete {{atomClassName}}
      await this.ctx.model.{{atomClassName}}.delete({
        id: key.itemId,
      });
    }

    _getMeta(item) {
      const meta = this._ensureItemMeta(item);
      // meta.flags
      if (item.detailsCount > 0) {
        meta.flags.push(item.detailsCount);
      }
      // meta.summary
      meta.summary = item.description;
    }
  }

  return Atom;
};
