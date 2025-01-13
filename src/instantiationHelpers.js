import instanceCreator from "./esdf-extensions.js";
Symbol.esdProxy = Symbol.for("esdProxy");

export { getTraps, instanceCreator, };

function getTraps(exts) {
  return {
    get( target, key ) {
      if (key in target && target[key] instanceof Function) {
        return (...args) => target[key](...args);
      }
      
      if (key in target) {
        return target[key];
      }
      
      if (key in exts) {
        return exts[key];
      }
      
      return true;
    },
    set( _, key, value ) {
      if (typeof key !== `symbol` && key in exts) {
        exts[key] = value;
        return value ?? true;
      }
      
      return Reflect.set(...arguments);
    },
    has: (target, key) => key in exts || key in target,
  };
  
  function targetGetter(target, key, receiver) {
    if (key in target && target[key] instanceof Function) {
      return (...args) => target[key].call(target, ...args);
    }
    
    return target[key];
  }
}