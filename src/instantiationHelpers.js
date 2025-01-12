import instanceCreator from "./esdf-extensions.js";
Symbol.esdProxy = Symbol.for("esdProxy");

export { getTraps, wrapProxy, instanceCreator, };

function getTraps(exts) {
  return {
    get( target, key ) { return key in exts ? exts[key] : targetGetter(target, key); },
    set( _, key, value ) {
      if (typeof key !== `symbol` && key in exts) {
        exts[key] = value;
        return value ?? true;
      }
      
      return Reflect.set(...arguments);
    },
    has: (target, key) => key in exts || key in target,
  };
  
  function targetGetter(target, key) {
    if (key in target && target[key] instanceof Function) {
      return target[key].bind(target);
    }
    
    return target[key];
  }
}

function wrapProxy(target, traps) {
  const wrapped = new Proxy(target, traps);
  wrapped[Symbol.for(`ESD`)] = true;
  return Object.freeze(wrapped);
}