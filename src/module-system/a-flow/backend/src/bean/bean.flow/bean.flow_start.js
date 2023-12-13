module.exports = ctx => {
  const moduleInfo = module.info;
  class Flow {
    async startByKey({ flowDefKey, flowAtomId, flowAtomClassId, flowVars, flowUserId, startEventId }) {
      // fullKey
      const { fullKey } = ctx.bean.flowDef._combineFullKey({ flowDefKey });
      // get flow def
      const flowDef = await ctx.bean.flowDef.getByKey({ flowDefKey });
      if (!flowDef) ctx.throw.module(moduleInfo.relativeName, 1001, fullKey);
      if (flowDef.atomDisabled === 1) ctx.throw.module(moduleInfo.relativeName, 1002, fullKey);
      return await this._start({ flowDef, flowAtomId, flowAtomClassId, flowVars, flowUserId, startEventId });
    }

    async startById({ flowDefId, flowAtomId, flowAtomClassId, flowVars, flowUserId, startEventId }) {
      // get flow def
      const flowDef = await ctx.bean.flowDef.getById({ flowDefId });
      if (!flowDef) ctx.throw.module(moduleInfo.relativeName, 1001, flowDefId);
      if (flowDef.atomDisabled === 1) ctx.throw.module(moduleInfo.relativeName, 1002, flowDef.atomStaticKey);
      return await this._start({ flowDef, flowAtomId, flowAtomClassId, flowVars, flowUserId, startEventId });
    }

    async _start({ flowDef, flowAtomId, flowAtomClassId, flowVars, flowUserId, startEventId }) {
      // flowInstance
      const flowInstance = this._createFlowInstance({ flowDef });
      // start
      await flowInstance.start({ flowAtomId, flowAtomClassId, flowVars, flowUserId, startEventId });
      // ok
      return flowInstance;
    }

    _createFlowInstance({ flowDef }) {
      const flowInstance = ctx.bean._newBean(`${moduleInfo.relativeName}.local.flow.flow`, {
        flowDef,
      });
      return flowInstance;
    }
  }

  return Flow;
};
