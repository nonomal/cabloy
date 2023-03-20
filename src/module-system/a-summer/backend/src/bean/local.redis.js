const CacheBase = require('../common/cacheBase.js');

module.exports = ctx => {
  class LocalRedis extends CacheBase(ctx) {
    constructor({ cacheBase }) {
      super({ cacheBase });
      this._redisSummer = null;
    }

    async get(key) {
      const redisKey = this._getRedisKey(key);
      let value = await this.redisSummer.get(redisKey);
      if (value === undefined) {
        value = await this.layered.get(key);
        await this.redisSummer.set(redisKey, value, 'PX', this._cacheBase.redis.ttl);
      }
      return value;
    }

    get redisSummer() {
      if (!this._redisSummer) {
        this._redisSummer = ctx.app.redis.get('summer');
      }
      return this._redisSummer;
    }

    _getRedisKey(key) {
      return `${this._cacheBase.fullKey}!${key}`;
    }
  }

  return LocalRedis;
};