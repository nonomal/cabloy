export default {
  data() {
    return {
    };
  },
  methods: {
    validate_getInstance() {
      return this.$refs.validate;
    },
    validate_onSubmit() {
      this.actions_onSubmit();
    },
    validate_onPerformValidate(event, options) {
      const actionName = options && options.action;
      const action = this.$utils.extend({}, this.actions_findAction('write'), { name: actionName });
      const _action = this.getDetailAction(action);
      return this.$meta.util.performAction({
        ctx: this,
        action: _action,
        item: {
          item: this.base.item,
          meta: {
            flowTaskId: this.container.flowTaskId,
          },
        },
      });
    },
    validate_render() {
      if (!this.base_ready) return null;
      return (
        <eb-validate ref="validate"
          containerMode={this.container.mode}
          readOnly={this.container.mode !== 'edit'}
          auto data={this.base.item}
          params={this.base.validateParams}
          propsOnPerform={this.validate_onPerformValidate}
          onSubmit={this.validate_onSubmit}>
        </eb-validate>
      );
    },
  },
};
