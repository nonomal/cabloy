export default {
  props: {
    groupId: {
      type: String,
    },
    views: {
      type: Array,
    },
    viewsPopup: {
      type: Array,
    },
  },
  computed: {
    groups() {
      return this.$parent.$parent.$parent;
    },
    layout() {
      return this.groups.layout;
    },
    size() {
      return this.layout.size;
    },
  },
  methods: {
    onViewReady(view) {
      // view
      const _view = this.views.find(item => item.id === view.id);
      // route
      this.$meta.vueLayout._patchRouter.loadRouteComponent(_view.url, routeComponent => {
        if (!routeComponent) throw new Error(`not found route: ${_view.url}`);
        // width
        const meta = routeComponent.meta;
        const sizeWill = (meta && meta.size) || 'small';
        const sizeFixed = (meta && meta.sizeFixed) || false;
        // title
        let title;
        const viewIndex = parseInt(this.$$(view.$el).data('index'));
        if (viewIndex === 0) {
          title = meta && meta.title;
          if (title) title = this.$text(title);
        }
        // size
        _view.sizeWill = sizeWill;
        _view.sizeFixed = sizeFixed;
        // reLayout
        this.reLayout();
        // callback must not be null
        _view.callback({ view, title });
        delete _view.callback;
      });
    },
    resize() {
      this.$nextTick(() => {
        this._reLayout();
      });
    },
    reLayout() {
      this.$nextTick(() => {
        this._reLayout();
      });
    },
    _combineViewSize(view, indexCurrent) {
      let sizeWill = view.sizeWill;
      const sizeFixed = view.sizeFixed;
      // check if fixed
      if (sizeFixed) return sizeWill;
      // try
      if ((sizeWill === 'small' || sizeWill === 'medium') && this.views.length === 1) {
        sizeWill = 'large';
      } else if (
        sizeWill === 'small' &&
        this.views.length === 2 &&
        indexCurrent === 0 &&
        this.views[indexCurrent + 1].sizeWill === 'small' &&
        this.layout.enoughLarge
      ) {
        sizeWill = 'medium';
      } else if (
        sizeWill === 'small' &&
        this.views.length >= 2 &&
        indexCurrent === this.views.length - 1 &&
        this.views[indexCurrent - 1].sizeWill !== 'small' &&
        !this.layout.enoughLarge &&
        this.layout.enoughMedium
      ) {
        sizeWill = 'medium';
      } else if (
        sizeWill === 'medium' &&
        this.views.length >= 2 &&
        indexCurrent === this.views.length - 1 &&
        this.views[indexCurrent - 1].sizeWill !== 'small' &&
        this.layout.enoughLarge
      ) {
        sizeWill = 'large';
      } else if (
        sizeWill === 'large' &&
        this.views.length > indexCurrent + 1 &&
        this.views[indexCurrent + 1].sizeWill === 'small'
      ) {
        sizeWill = 'medium';
      }
      // adjust
      if (sizeWill === 'large') {
        return this.layout.enoughLarge ? 'large' : this.layout.enoughMedium ? 'medium' : 'small';
      }
      if (sizeWill === 'medium') {
        return this.layout.enoughMedium ? 'medium' : 'small';
      }
      return 'small';
    },
    _reLayout() {
      // space
      let space = this.size.width;
      let spacing = 0;
      for (let i = this.views.length - 1; i >= 0; i--) {
        // width
        const viewSize = this._combineViewSize(this.views[i], i);
        const width = this.size[viewSize];
        // space
        const space2 = space - width - spacing;
        if (space2 >= 0) {
          space = space2;
          spacing = this.layout.sizeSpacing;
        } else {
          break;
        }
      }
      // sidebar
      const sidebarLeft = this.layout._sidebarWidth('left');

      // left
      let left = parseInt(this.size.width - space / 2);
      spacing = 0;
      for (let i = this.views.length - 1; i >= 0; i--) {
        const view = this.$refs[this.views[i].id];
        // width
        const viewSize = this._combineViewSize(this.views[i], i);
        const width = this.size[viewSize];
        // space
        left -= width + spacing;
        spacing = this.layout.sizeSpacing;
        // check
        if (left >= 0) {
          const newStyle = {
            left: `${left + sidebarLeft}px`,
          };
          this.$$(view.$el).css(newStyle);
          this.$$(view.$el).removeClass('view-hide');
        } else {
          this.$$(view.$el).addClass('view-hide');
        }
      }
    },
    __getViewIndex(viewId) {
      return this.views.findIndex(item => item.id === viewId);
    },
    onViewTitle(viewId, data) {
      const viewIndex = this.__getViewIndex(viewId);
      if (viewIndex === 0) {
        this.groups.onViewTitle(this.groupId, data.title);
      }
    },
    getView(viewId) {
      return this.$refs[viewId];
    },
    _renderViews() {
      const children = [];
      if (!this.views) return children;
      for (let index = 0; index < this.views.length; index++) {
        const view = this.views[index];
        const viewSize = this._combineViewSize(view, index);
        const viewSizeExtent = {
          width: this.size[viewSize],
          height: this.size.main,
        };
        //
        const _viewAttrs = {
          id: view.id,
          name: view.id,
          init: false,
          pushState: false,
          stackPages: true,
          pushStateOnLoad: false,
          preloadPreviousPage: false,
          'data-index': index,
          'data-size': viewSize,
        };
        const _viewProps = {
          size: viewSize,
          sizeExtent: viewSizeExtent,
        };
        const _viewStyle = {
          width: `${viewSizeExtent.width}px`,
        };
        const _viewEvents = {
          'view:ready': view => {
            this.onViewReady(view);
          },
          'view:title': data => {
            this.onViewTitle(view.id, data);
          },
        };
        const staticClass = `eb-layout-group-view eb-layout-view ${this.layout._combineViewSizeClass(viewSize)}`;
        children.push(
          <eb-view
            ref={view.id}
            id={view.id}
            key={view.id}
            staticClass={staticClass}
            attrs={_viewAttrs}
            props={_viewProps}
            style={_viewStyle}
            on={_viewEvents}
          ></eb-view>
        );
      }
      return children;
    },
  },
  render() {
    return <div>{this._renderViews()}</div>;
  },
};