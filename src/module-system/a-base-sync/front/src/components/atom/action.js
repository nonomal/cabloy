import ActionCreate from './action/actionCreate.js';
import ActionDelete from './action/actionDelete.js';
import ActionWrite from './action/actionWrite.js';

export default {
  meta: {
    global: false,
  },
  mixins: [
    ActionCreate, //
    ActionDelete,
    ActionWrite,
  ],
  props: {
    ctx: {
      type: Object,
    },
    action: {
      type: Object,
    },
    item: {
      type: Object,
    },
  },
  methods: {
    async onAction() {
      const { action } = this.$props;
      if (action.name === 'create' || action.action === 'create') {
        return await this._onActionCreate();
      } else if (action.name === 'delete') {
        return await this._onActionDelete();
      } else if (action.name === 'save') {
        // save
        const key = { atomId: item.atomId, itemId: item.itemId };
        await ctx.$api.post('/a/base/atom/write', { key, item });
        ctx.$meta.eventHub.$emit('atom:action', { key, action });
        // toast
        return ctx.$text('Saved');
      } else if (action.name === 'submit') {
        // submit
        await ctx.$view.dialog.confirm();
        const key = { atomId: item.atomId, itemId: item.itemId };
        const data = await ctx.$api.post('/a/base/atom/writeSubmit', { key, item });
        if (data.formal) {
          // delete draft
          if (item.atomStage === 0) {
            ctx.$meta.eventHub.$emit('atom:action', { key, action: { name: 'delete' } });
          }
          // update formal
          ctx.$meta.eventHub.$emit('atom:action', { key: data.formal.key, action: { name: 'save' } });
          // back
          ctx.$f7router.back();
        } else {
          // flow
          const flow = data.flow;
          // update draft
          ctx.$meta.eventHub.$emit('atom:action', { key, action: { name: 'save' } });
          // navigate replace self
          const url = `/a/flowtask/flow?flowId=${flow.id}`;
          ctx.$view.navigate(url, {
            target: '_self',
            reloadCurrent: true,
          });
        }
      } else if (action.name === 'write') {
        return await this._onActionWrite();
      } else if (action.name === 'clone') {
        // clone
        await ctx.$view.dialog.confirm();
        try {
          const key = { atomId: item.atomId, itemId: item.itemId };
          const data = await ctx.$api.post('/a/base/atom/clone', { key });
          const keyDraft = data.draft.key;
          const _item = {
            ...item,
            atomId: keyDraft.atomId,
            itemId: keyDraft.itemId,
          };
          const url = ctx.$meta.util.replaceTemplate('/a/basefront/atom/item?mode=edit&atomId={{atomId}}&itemId={{itemId}}', _item);
          let navigateOptions = action.navigateOptions;
          if (ctx.$pageRoute.path === '/a/basefront/atom/item') {
            navigateOptions = { target: '_self' };
          }
          ctx.$view.navigate(url, navigateOptions);
        } catch (err) {
          if (err.code === 422) {
            throw new Error(err.message[0].message);
          }
          throw err;
        }
      } else if (action.name === 'history') {
        const atomIdFormal = item.atomStage === 1 ? item.atomId : item.atomIdFormal;
        if (!atomIdFormal) return;
        // options
        const options = {
          where: {
            'a.atomIdFormal': atomIdFormal,
          },
          stage: 'history',
        };
        // params
        // const params = {
        //   pageTitle: `${this.$text('History')}: ${item.atomName}`,
        // };
        // queries
        const queries = {
          module: item.module,
          atomClassName: item.atomClassName,
          options: JSON.stringify(options),
          // params: JSON.stringify(params),
        };
        const url = ctx.$meta.util.combineQueries('/a/basefront/atom/list', queries);
        ctx.$view.navigate(url, {
          // target: '_self'
        });
      } else if (action.name === 'formal') {
        await this._onActionRead({ ctx, item, atomId: item.atomIdFormal });
      } else if (action.name === 'draft') {
        await this._onActionRead({ ctx, item, atomId: item.atomIdDraft });
      } else if (action.name === 'selectLocale') {
        return await this._onActionSelectLocale({ ctx, action, item });
      } else if (action.name === 'selectResourceType') {
        return await this._onActionSelectResourceType({ ctx, action, item });
      } else if (action.name === 'enable') {
        const key = { atomId: item.atomId, itemId: item.itemId };
        return await this._onActionEnable({ ctx, key });
      } else if (action.name === 'disable') {
        const key = { atomId: item.atomId, itemId: item.itemId };
        return await this._onActionDisable({ ctx, key });
      } else if (action.name === 'workflow') {
        const flowId = item.atomFlowId;
        const url = `/a/flowtask/flow?flowId=${flowId}`;
        ctx.$view.navigate(url, {});
      }
    },
    async _onActionRead({ ctx, item, atomId }) {
      const actionsAll = await ctx.$store.dispatch('a/base/getActions');
      let actionRead = actionsAll[item.module][item.atomClassName].read;
      actionRead = ctx.$utils.extend({}, actionRead);
      await ctx.$meta.util.performAction({ ctx, action: actionRead, item: { atomId } });
    },

    async _onActionSelectLocale({ ctx, action, item }) {
      if (item && item.module && item.atomClassName) {
        const atomClasses = await ctx.$store.dispatch('a/base/getAtomClasses');
        const atomClass = atomClasses[item.module][item.atomClassName];
        // not support language
        if (!atomClass.language) {
          return null;
        }
      }
      // only one
      const locales = await ctx.$store.dispatch('a/base/getLocales');
      if (locales.length === 1) {
        return locales[0];
      }
      // choose
      return new Promise((resolve, reject) => {
        const hostEl = ctx.$view.getHostEl();
        const targetEl = action.targetEl;
        const buttons = [
          {
            text: ctx.$text('SelectLanguageTip'),
            label: true,
          },
        ];
        let resolved = false;
        function onButtonClick(locale) {
          resolved = true;
          resolve(locale);
        }
        for (const locale of locales) {
          buttons.push({
            text: locale.title,
            onClick: () => {
              onButtonClick(locale);
            },
          });
        }
        const actions = ctx.$f7.actions.create({ hostEl, buttons, targetEl });
        function onActionsClosed() {
          actions.destroy();
          if (!resolved) {
            resolved = true;
            reject(new Error());
          }
        }
        actions.open().once('actionsClosed', onActionsClosed).once('popoverClosed', onActionsClosed);
      });
    },
    async _onActionSelectResourceType({ ctx, action /* , item*/ }) {
      const resourceTypes = await ctx.$store.dispatch('a/base/getResourceTypes');
      // choose
      return new Promise((resolve, reject) => {
        const hostEl = ctx.$view.getHostEl();
        const targetEl = action.targetEl;
        const buttons = [
          {
            text: ctx.$text('SelectResourceTypeTip'),
            label: true,
          },
        ];
        let resolved = false;
        function onButtonClick(locale) {
          resolved = true;
          resolve(locale);
        }
        for (const key in resourceTypes) {
          const resourceType = resourceTypes[key];
          buttons.push({
            text: resourceType.titleLocale,
            onClick: () => {
              onButtonClick(key);
            },
          });
        }
        const actions = ctx.$f7.actions.create({ hostEl, buttons, targetEl });
        function onActionsClosed() {
          actions.destroy();
          if (!resolved) {
            resolved = true;
            reject(new Error());
          }
        }
        actions.open().once('actionsClosed', onActionsClosed).once('popoverClosed', onActionsClosed);
      });
    },
    async _onActionEnable({ ctx, key }) {
      await ctx.$api.post('/a/base/atom/enable', { key });
      ctx.$meta.eventHub.$emit('atom:action', { key, action: { name: 'save' } });
    },
    async _onActionDisable({ ctx, key }) {
      await ctx.$api.post('/a/base/atom/disable', { key });
      ctx.$meta.eventHub.$emit('atom:action', { key, action: { name: 'save' } });
    },
  },
};
