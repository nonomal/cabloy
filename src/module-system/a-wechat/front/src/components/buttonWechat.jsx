import Vue from 'vue';
const ebAuthLoginBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAuthLoginBase;
export default {
  meta: {
    global: false,
  },
  mixins: [ebAuthLoginBase],
  data() {
    return {};
  },
  methods: {
    async disable() {
      const ctx = this.ctx;
      // in wechat
      if (!ctx.$device.wechat) return true;
      // associate
      if (this.state === 'associate') return false;
      // reload
      const reload = ctx.$store.state.auth.reload;
      if (reload) return false;
      // login direct for state=login
      await this.login();
      // throw error to interrupt
      throw new Error();
    },
    onPerformSignIn() {
      return this.login();
    },
  },
  render() {
    const imgSrc = require('../assets/img/icon64_wx_logo.png');
    return (
      <eb-button tooltip={this.provider.meta.titleLocale} propsOnPerform={this.onPerformSignIn}>
        <img src={imgSrc} />
      </eb-button>
    );
  },
};