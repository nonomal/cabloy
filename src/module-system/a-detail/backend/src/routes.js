module.exports = app => {
  const routes = [
    // detail
    { method: 'post', path: 'detail/create', controller: 'detail', middlewares: 'transaction',
      meta: { right: { type: 'detail', action: 1 } },
    },
    { method: 'post', path: 'detail/write', controller: 'detail', middlewares: 'transaction',
      meta: { right: { type: 'detail', action: 3 } },
    },
    { method: 'post', path: 'detail/delete', controller: 'detail', middlewares: 'transaction',
      meta: { right: { type: 'detail', action: 4 } },
    },
  ];
  return routes;
};
