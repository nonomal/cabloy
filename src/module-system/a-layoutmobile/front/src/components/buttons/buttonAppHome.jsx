// export
export default {
  installFactory,
};

// installFactory
function installFactory(_Vue) {
  const Vue = _Vue;
  const ebLayoutButtonBase = Vue.prototype.$meta.module.get('a-layoutmobile').options.mixins.ebLayoutButtonBase;
  return {
    mixins: [ebLayoutButtonBase],
    data() {
      return {};
    },
    created() {
      this.$meta.eventHub.$on('home:open', this.onHomeOpen);
    },
    beforeDestroy() {
      this.$meta.eventHub.$off('home:open', this.onHomeOpen);
    },
    mounted() {
      this.openAppMenu();
    },
    methods: {
      onHomeOpen() {
        this.onPerform();
      },
      onPerform() {
        this.setTabActive();
      },
      openAppMenu() {
        const view = this.getView();
        this.$meta.vueLayout.app_openHome({ view });
      },
    },
    render() {
      return (
        <eb-link
          class={this.buttonClass}
          iconMaterial={this.buttonIcon && this.buttonIcon.material}
          iconF7={this.buttonIcon && this.buttonIcon.f7}
          text={this.buttonLabel}
          propsOnPerform={this.onPerform}
        ></eb-link>
      );
    },
  };
}