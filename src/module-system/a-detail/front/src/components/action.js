export default {
  meta: {
    global: false,
  },
  methods: {
    async onAction({ ctx, action, item }) {
      // atomKey
      const atomKey = { atomId: item.atomId };
      // key
      const key = { detailId: item.detailId, detailItemId: item.detailItemId };
      // detailClass
      const detailClass = {
        module: item.module,
        detailClassName: item.detailClassName,
      };
      // do
      if (action.name === 'create' || action.action === 'create') {
        return await this._onActionCreate({ ctx, action, item, atomKey, detailClass });
      } else if (action.name === 'delete') {
        // delete
        await ctx.$view.dialog.confirm();
        // delete
        await ctx.$api.post('/a/detail/detail/delete', { key });
        // event
        ctx.$meta.eventHub.$emit('detail:action', { atomKey, detailClass, key, action });
        // back
        if (ctx.$f7route.path === '/a/detail/detail/item') {
          ctx.$f7router.back();
        }
      } else if (action.name === 'save') {

      } else if (action.name === 'write') {
        const url = ctx.$meta.util.replaceTemplate('/a/detail/detail/item?mode=edit&detailId={{detailId}}&detailItemId={{detailItemId}}', item);
        ctx.$view.navigate(url, action.navigateOptions);
      } else if (action.name === 'clone') {
        // clone
        try {
          const keyDest = await ctx.$api.post('/a/detail/detail/clone', { key });
          const _item = {
            ...item,
            detailId: keyDest.detailId,
            detailItemId: keyDest.detailItemId,
          };
          // event
          ctx.$meta.eventHub.$emit('detail:action', { atomKey, detailClass, key: keyDest, action: { name: 'create' } });
          // open
          const url = ctx.$meta.util.replaceTemplate('/a/detail/detail/item?mode=edit&detailId={{detailId}}&detailItemId={{detailItemId}}', _item);
          ctx.$view.navigate(url, action.navigateOptions);
        } catch (err) {
          if (err.code === 422) {
            throw new Error(err.message[0].message);
          }
          throw err;
        }
      }
    },
    async _onActionCreate({ ctx, action, item, atomKey, detailClass }) {
      // create
      const key = await ctx.$api.post('/a/detail/detail/create', {
        atomKey,
        detailClass,
        item,
      });
      // event
      ctx.$meta.eventHub.$emit('detail:action', { atomKey, detailClass, key, action });
      // menu
      if (action.menu === 1 || (action.actionComponent || action.actionPath)) {
        item = ctx.$utils.extend({}, item, key);
        // write
        const actionsAll = await ctx.$store.dispatch('a/base/getDetailActions');
        let actionWrite = actionsAll[item.module][item.detailClassName].write;
        actionWrite = ctx.$utils.extend({}, actionWrite);
        await ctx.$meta.util.performAction({ ctx, action: actionWrite, item });
      }
      // just return key
      return key;
    },
  },
};
