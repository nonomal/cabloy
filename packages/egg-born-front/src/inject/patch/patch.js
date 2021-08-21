import mparse from 'egg-born-mparse';

export default function (ctx, router) {
  // load route
  function loadRoute(url, cb) {
    // match
    let route = router.findMatchingRoute(url);
    if (route) return cb(route);
    // info
    const moduleInfo = mparse.parseInfo(url);
    if (!moduleInfo) return cb(null); // throw new Error('invalid url');
    // use module
    ctx.$meta.module.use(moduleInfo, () => {
      route = router.findMatchingRoute(url);
      return cb(route);
    });
  }
  // load route component
  function loadRouteComponent(url, cb) {
    loadRoute(url, route => {
      if (!route) throw new Error(`not found route: ${url}`);
      if (!route.route.async) return cb(route.route.component);
      route.route.async(
        url,
        null,
        data => {
          return cb(data.component);
        },
        () => {
          // do nothing
          //   maybe need login
        }
      );
    });
  }
  function _checkIfDirtyOfPage(pageEl) {
    if (!pageEl) return false;
    const pageVue = pageEl.__vue__;
    return pageVue.getPageDirty && pageVue.getPageDirty();
  }
  // navigate
  const navigate = router.navigate;
  router.navigate = (navigateParams, navigateOptions, cb) => {
    if (navigateOptions && navigateOptions.initial) {
      return navigate.call(router, navigateParams, navigateOptions);
    }
    ctx.$nextTick(() => {
      // url
      let url;
      if (typeof navigateParams === 'string') {
        url = navigateParams;
      } else {
        url = navigateParams.url;
      }
      // check if page content
      if (navigateParams && navigateParams.route && navigateParams.route.content) {
        // navigate
        navigate.call(router, navigateParams, navigateOptions);
        return cb && cb();
      }
      // load route
      loadRoute(url, route => {
        if (!route) return cb && cb();
        // check if loggedIn
        //   just the placeholder for logical thinking
        if (route.route.meta && route.route.meta.auth && !ctx.$meta.store.state.auth.loggedIn) {
          navigate.call(router, navigateParams, navigateOptions);
          return cb && cb();
        }
        // navigate
        navigate.call(router, navigateParams, navigateOptions);
        return cb && cb();
      });
    });
    return router;
  };
  // back
  const back = router.back;
  const _backReal = function (...args) {
    // view
    const view = router.view;
    if (view && view.$el.hasClass('eb-layout-view')) {
      if (ctx.$meta.util.historyUrlEmpty(router.history[router.history.length - 2])) {
        return router.close();
      }
    }
    return back.call(router, ...args);
  };
  router.back = (...args) => {
    // check if current page is dirty
    if (!_checkIfDirtyOfPage(router.currentPageEl)) {
      return _backReal.call(router, ...args);
    }
    const viewVue = router.view.$el[0].__vue__;
    viewVue.dialog
      .confirm(ctx.$text('PageDirtyQuitPrompt'))
      .then(() => {
        _backReal.call(router, ...args);
      })
      .catch(() => {
        // do nothing
      });
    return router;
  };
  // close
  const _closeReal = function () {
    const view = router.view;
    if (view && view.$el.hasClass('eb-layout-view')) {
      // clear hash
      if (view.params.pushState && history.state) {
        const keys = Object.keys(history.state);
        if (keys.length > 0) {
          const url = history.state[keys[keys.length - 1]].url;
          if (url === router.url) {
            window.history.go(-(view.router.history.length - 1));
            router.url = view.router.history[0];
          }
        }
      }
      // close view
      ctx.$meta.vueLayout.closeView(view);
    }
    return router;
  };
  router.close = () => {
    // check if all of pages of current view is dirty
  };

  return {
    loadRoute,
    loadRouteComponent,
  };
}
