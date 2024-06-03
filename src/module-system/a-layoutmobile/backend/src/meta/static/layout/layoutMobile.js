// const moduleInfo = module.info;

const content = {
  toolbar: {
    buttons: [
      { module: 'a-layoutmobile', name: 'buttonAppMenu' },
      { module: 'a-layoutmobile', name: 'buttonAppHome' },
      { module: 'a-layoutmobile', name: 'buttonAppMine' },
    ],
  },
};
const layout = {
  atomName: 'Mobile Layout(Authenticated)',
  atomStaticKey: 'layoutMobile',
  atomRevision: 9,
  description: '',
  layoutTypeCode: 1,
  content: JSON.stringify(content),
  resourceRoles: 'root',
};
module.exports = layout;
