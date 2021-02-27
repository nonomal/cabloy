const __PATH_MESSAGE_UNIFORM = '/a/message/uniform';

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class IOMessageUniformBase extends ctx.app.meta.IOMessageBase(ctx) {

    async onPublish({ path, message, messageClass, options }) {
      // todo: will be removed
      if (ctx.config.module(moduleInfo.relativeName).message.disabled) return;
      // path
      path = __PATH_MESSAGE_UNIFORM;
      // user
      const user = { id: message.userIdTo };
      // stats
      this._notify({ messageClass, user });
      // onPublish
      return await super.onPublish({ path, message, messageClass, options });
    }

    async onSetRead({ messageClass, messageIds, all, user }) {
      // stats
      if (messageClass) {
        this._notify({ messageClass, user });
      }
      // onPublish
      return await super.onSetRead({ messageClass, messageIds, all, user });
    }

    _notify({ messageClass, user }) {
      // stats
      ctx.bean.stats.notify({
        module: moduleInfo.relativeName,
        name: 'message',
        nameSub: `${messageClass.module}_${messageClass.messageClassName}`,
        user,
      });
    }

  }
  return IOMessageUniformBase;
};
