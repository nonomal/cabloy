const extend = require('extend2');

module.exports = function(loader, modules) {

  // all middlewares
  const ebMiddlewares = {};

  // load middlewares
  const ebMiddlewaresGlobal = loadMiddlewares(ebMiddlewares, loader, modules);

  return [ ebMiddlewares, ebMiddlewaresGlobal ];
};

function loadMiddlewares(ebMiddlewares, loader, modules) {
  const globals = [];
  // load
  Object.keys(modules).forEach(key => {
    const module = modules[key];
    // module middlewares
    if (module.main.middlewares) {
      Object.keys(module.main.middlewares).forEach(middlewareKey => {
        const middleware = module.main.middlewares[middlewareKey];
        const config = loader.app.meta.configs[module.info.relativeName];
        const middlewareConfig = config.middlewares ? config.middlewares[middlewareKey] : null;
        const options = extend(true, {}, middlewareConfig, loader.app.config.mws[middlewareKey]);
        ebMiddlewares[middlewareKey] = {
          options,
          middleware,
          key: middlewareKey,
        };
        if (options.global) globals.push(middlewareKey);
      });
    }
  });

  // global order
  // eslint-disable-next-line
  while (true) {
    if (!swap(ebMiddlewares, globals)) break;
  }

  return globals;
}

function swap(ebMiddlewares, globals) {
  let result = false;
  const globalsClone = globals.slice(0);
  globalsClone.forEach(key => {
    const item = ebMiddlewares[key];
    let deps = item.options.dependencies || [];
    if (typeof deps === 'string') deps = deps.split(',');
    deps.forEach(dep => {
      if (swapDep(globals, dep, key)) result = true;
    });
  });
  return result;
}

function swapDep(arr, a, b) {
  const indexA = arr.indexOf(a);
  const indexB = arr.indexOf(b);
  if (indexA === -1 || indexB === -1 || indexA < indexB) return false;
  arr.splice(indexB, 0, arr.splice(indexA, 1)[0]);
  return true;
}
