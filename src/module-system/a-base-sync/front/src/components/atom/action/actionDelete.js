export default {
  methods: {
    async _onActionDelete() {
      const { ctx, action, item } = this.$props;
      // delete
      await ctx.$view.dialog.confirm();
      const key = { atomId: item.atomId, itemId: item.itemId };
      await ctx.$api.post('/a/base/atom/delete', { key });
      ctx.$meta.eventHub.$emit('atom:action', { key, action });
      // update formal
      if (item.atomStage === 0 && item.atomIdFormal) {
        ctx.$meta.eventHub.$emit('atom:action', { key: { atomId: item.atomIdFormal }, action: { name: 'save' } });
      }
      // back
      if (ctx.$pageRoute.path === '/a/basefront/atom/item') {
        ctx.$f7router.back();
      }
    },
  },
};
