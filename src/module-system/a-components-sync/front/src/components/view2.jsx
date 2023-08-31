import Vue from 'vue';
import ViewAppMethods from '../common/view/viewAppMethods.js';
import ViewDirty from '../common/view/viewDirty.js';
import ViewModal from '../common/view/viewModal.js';
const f7View = Vue.options.components['f7-view'].extendOptions;
export default {
  meta: {
    global: true,
  },
  name: 'eb-view',
  mixins: [ViewAppMethods, ViewDirty, ViewModal],
  extends: f7View,
  props: {
    size: {
      type: String,
      default: 'small',
    },
    sizeExtent: {
      type: Object,
    },
  },
  methods: {
    getHostEl() {
      const view = this.$$(this.$el);
      const views = view.parents('.views');
      return views.length > 0 ? views : view;
    },
    navigate(url, options) {
      let _options = options || {};
      if (!_options.ctx) {
        // _options = this.$utils.extend({}, _options, { ctx: this });
        _options = Object.assign({}, _options, { ctx: this });
      }
      this.$meta.vueLayout.navigate(url, _options);
    },
    getSizeExtent() {
      return this.sizeExtent;
      // not valid if the group of views is hidden
      // const view = this.$$(this.$el);
      // const size = {
      //   width: view.width(),
      //   height: view.height(),
      // };
      // return size;
    },
    close() {
      this.$f7router.close();
    },
    inPanel() {
      const view = this.$$(this.$el);
      return view.is('.eb-layout-panel-view');
    },
    returnTo(returnTo, options) {
      if (!returnTo) {
        const modeIfEmpty = (options && options.modeIfEmpty) || 'back';
        if (modeIfEmpty === 'back') {
          this.$f7router.back();
        } else {
          this.$view.close();
        }
      } else if (returnTo.indexOf('http://') === 0 || returnTo.indexOf('https://') === 0) {
        window.location.assign(returnTo);
      } else {
        const navigateOptions = (options && options.navigateOptions) || { target: '_self', reloadCurrent: true };
        this.$view.navigate(returnTo, navigateOptions);
      }
    },
  },
  mounted() {
    const self = this;
    const el = self.$refs.el;
    self.$f7ready(f7Instance => {
      if (self.props.init) return;
      self.routerData.instance = f7Instance.views.create(
        el,
        Object.assign(
          {
            on: {
              init: self.onViewInit,
            },
          },
          noUndefinedProps(self.$options.propsData || {})
        )
      );
      self.f7View = self.routerData.instance;
      self.f7View.on('swipebackMove', self.onSwipeBackMove);
      self.f7View.on('swipebackBeforeChange', self.onSwipeBackBeforeChange);
      self.f7View.on('swipebackAfterChange', self.onSwipeBackAfterChange);
      self.f7View.on('swipebackBeforeReset', self.onSwipeBackBeforeReset);
      self.f7View.on('swipebackAfterReset', self.onSwipeBackAfterReset);
      // viewReady
      this.$emit('view:ready', self);
    });
  },
  beforeDestroy() {
    const self = this;
    self.$emit('view:destroy', self);
  },
  render() {
    const _h = this.$createElement;
    const self = this;
    const props = self.props;
    const { id, style, tab, main, tabActive, className } = props;
    const classes = this.$vuef7.utils.classNames(
      className,
      'view',
      {
        'view-main': main,
        'tab-active': tabActive,
        tab,
      },
      this.$vuef7.mixins.colorClasses(props)
    );
    const domPages = self.state.pages.map(page => {
      const PageComponent = page.component;
      return _h(PageComponent, {
        key: page.id,
        props: page.props,
      });
    });
    const domModals = self._renderModals(_h);
    return _h(
      'div',
      {
        ref: 'el',
        style,
        class: classes,
        attrs: {
          id,
        },
      },
      [this.$slots.default, domPages, domModals]
    );
  },
};

function noUndefinedProps(obj) {
  const o = {};
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] !== 'undefined') o[key] = obj[key];
  });
  return o;
}
