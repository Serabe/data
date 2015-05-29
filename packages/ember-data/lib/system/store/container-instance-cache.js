import Ember from 'ember';

function ContainerInstanceCache(container) {
  this._container  = container;
  this._cache      = Ember.create(null);
}

ContainerInstanceCache.prototype = Ember.create(null);

Ember.merge(ContainerInstanceCache.prototype, {
  get(type, preferredKey, fallbacks) {
    let cache = this._cache;
    let preferredLookupKey = `${type}:${preferredKey}`;

    if (!(preferredLookupKey in cache)) {
      let instance = this.instanceFor(preferredLookupKey) || this._findInstance(type, fallbacks || []);
      if (instance) {
        cache[preferredLookupKey] = instance;
      }
    }
    return cache[preferredLookupKey];
  },

  _findInstance(type, fallbacks) {
    for (let i = 0, length = fallbacks.length; i < length; i++) {
      let fallback = fallbacks[i];
      let lookupKey = `${type}:${fallback}`;
      let instance = this.instanceFor(lookupKey);

      if (instance) {
        return instance;
      }
    }
  },

  instanceFor(key) {
    let cache = this._cache;
    if (!cache[key]) {
      let instance = this._container.lookup(key);
      if (instance) {
        cache[key] = instance;
      }
    }
    return cache[key];
  },

  destroy() {
    let cache = this._cache;
    let cacheEntries = Ember.keys(cache);

    for (let i = 0, length = cacheEntries.length; i < length; i++) {
      let cacheKey = cacheEntries[i];
      let cacheEntry = cache[cacheKey];
      if (cacheEntry) {
        cacheEntry.destroy();
      }
    }
    this._container = null;
  },

  constructor: ContainerInstanceCache,

  toString() {
    return 'ContainerInstanceCache';
  }
});

export default ContainerInstanceCache;
