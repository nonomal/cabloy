export default {
  meta: {
    global: false,
  },
  props: {
    layoutManager: {
      type: Object,
    },
    layout: {
      type: Object,
    },
    blockConfig: {
      type: Object,
    },
  },
  data() {
    return {
      articleUrl: null,
    };
  },
  created() {
    this._getArticleUrl();
  },
  methods: {
    onSize(size) {
      this.$$(this.$refs.iframe).css({
        height: `${size.height}px`,
        width: `${size.width}px`,
      });
    },
    async _getArticleUrl() {
      if (this.blockConfig.iframe === false || this.layoutManager.container.mode === 'edit') {
        this.articleUrl = '';
        return;
      }
      try {
        const data = await this.$api.post('render/getArticleUrl', {
          key: { atomId: this.layoutManager.container.atomId },
        });
        this.articleUrl = (data && data.url) || '';
      } catch (err) {
        this.articleUrl = '';
      }
    },
    _renderIFrame() {
      const subnavbar = this.layoutManager.subnavbar.enable;
      const frameSrc = this.$meta.util.combineQueries(this.articleUrl, {
        __cms_iframe_random: new Date().getTime(),
      });
      return (
        <eb-box onSize={this.onSize} header subnavbar={subnavbar} class="eb-box-iframe">
          <iframe ref="iframe" src={frameSrc} seamless={true}></iframe>
        </eb-box>
      );
    },
  },
  render() {
    if (this.articleUrl === null) return null;
    if (this.articleUrl === '') return this.layoutManager.validate_render();
    return this._renderIFrame();
  },
};
