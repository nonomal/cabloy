module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  function _createProvider() {
    return {
      meta: {
        title: 'GitHub',
        mode: 'redirect',
        scene: true,
        bean: 'github',
        render: 'buttonGithub',
        validator: 'authGithub',
      },
    };
  }

  const metaAuth = {
    providers: {
      authgithub: _createProvider(),
    },
  };

  // ok
  return metaAuth;
};
