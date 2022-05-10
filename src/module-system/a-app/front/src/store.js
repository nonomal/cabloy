const __appKeyDefault = 'a-app:appDefault';
const __appKeyBase = 'a-app:appBase';
const __atomClassApp = {
  module: 'a-app',
  atomClassName: 'app',
};

export default function (Vue) {
  const query = Vue.prototype.$utils.parseUrlQuery();

  Vue.prototype.$meta.eventHub.$on('auth:login', data => {
    Vue.prototype.$meta.store.commit('a/app/clearUserInfo', data);
  });

  return {
    state: {
      // user
      currentInner: {
        appKey: null,
        appLanguage: null,
      },
      appItemsAll: null,
      // global
      appItems: {},
    },
    getters: {
      current(state) {
        // appKey
        const appKey = state.currentInner.appKey || query.appKey || __appKeyDefault;
        // appLanguage
        const appLanguage = state.currentInner.appLanguage || query.appLanguage || Vue.prototype.$meta.util.getLocale();
        // user
        const user = Vue.prototype.$meta.store.state.auth.user;
        const userOp = user && user.op;
        const userStatus = !userOp || userOp.anonymous ? 'anonymous' : 'authenticated';
        // layout
        const layout = Vue.prototype.$meta.vueApp.layout;
        // ok
        return {
          appKey,
          appLanguage,
          userStatus,
          layout,
        };
      },
      appItemCurrent(state, getters) {
        return state.appItems[getters.current.appKey];
      },
      presetConfigCurrent(state, getters) {
        const appItem = getters.appItemCurrent;
        if (!appItem) return null;
        // preset config
        return __getPresetConfig({ appItem, current: getters.current });
      },
    },
    mutations: {
      clearUserInfo(state) {
        // clear
        // maybe fallback to appDefault from appTools
        if (state.currentInner.appKey === __appKeyDefault) {
          state.currentInner.appKey = null;
        }
        state.appItemsAll = null;
      },
      setCurrent(state, { appKey, appLanguage }) {
        if (appKey) state.currentInner.appKey = appKey;
        if (appLanguage) state.currentInner.appLanguage = appLanguage;
      },
      setAppItem(state, { appKey, appItem }) {
        state.appItems = {
          ...state.appItems,
          [appKey]: appItem,
        };
      },
      setAppItemsAll(state, { appItems }) {
        state.appItemsAll = appItems;
      },
    },
    actions: {
      async getPresetConfigCurrent({ state, getters, commit, dispatch }) {
        // force appItem exists
        const appItem = await dispatch('getAppItemCurrent');
        if (!appItem) {
          // fallback to appDefault
          commit('setCurrent', { appKey: __appKeyDefault });
          await dispatch('getAppItemCurrent');
        }
        // current
        return getters.presetConfigCurrent;
      },
      async getPresetConfigDefault({ state, dispatch }) {
        return await dispatch('getPresetConfig', { appKey: __appKeyDefault });
      },
      async getAppItemCurrent({ state, getters, dispatch }) {
        return await dispatch('getAppItem', { appKey: getters.current.appKey });
      },
      async getPresetConfig({ state, getters, dispatch }, { appKey }) {
        // force appItem exists
        const appItem = await dispatch('getAppItem', { appKey });
        if (!appItem) return null; // maybe no access right
        return __getPresetConfig({ appItem, current: getters.current });
      },
      async getAppItem({ state, commit, dispatch }, { appKey }) {
        let appItem = state.appItems[appKey];
        if (appItem) return appItem;
        appItem = await __fetchAppItem({ Vue, appKey });
        if (!appItem) return null; // maybe no access right
        appItem.content = appItem.content ? JSON.parse(appItem.content) : null;
        // get base app
        if (appKey !== __appKeyBase) {
          const appItemBase = await dispatch('getAppItem', { appKey: __appKeyBase });
          appItem.content = Vue.prototype.$meta.util.extend({}, appItemBase.content, appItem.content);
        }
        commit('setAppItem', { appKey, appItem });
        return appItem;
      },
      async getAppItemsAll({ state, commit }) {
        if (state.appItemsAll) return state.appItemsAll;
        const res = await Vue.prototype.$meta.api.post('/a/base/resource/select', {
          atomClass: __atomClassApp,
          options: {
            orders: [
              ['f.appSorting', 'asc'],
              ['f.createdAt', 'asc'],
            ],
          },
        });
        const appItems = res.list;
        commit('setAppItemsAll', { appItems });
        return appItems;
      },
    },
  };
}

function __getPresetConfig({ appItem, current }) {
  const presetConfig = appItem.content.presets[current.userStatus][current.layout];
  return presetConfig[current.appLanguage] || presetConfig;
}

async function __fetchAppItem({ Vue, appKey }) {
  try {
    const appItem = await Vue.prototype.$meta.api.post('/a/base/resource/read', {
      atomStaticKey: appKey,
      options: {
        //  locale: false, // should return locale info
      },
    });
    return appItem;
  } catch (err) {
    if (err.code === 401 || err.code === 403) {
      return null;
    }
    throw err;
  }
}
