import { getValueByPath, getPropByPath } from 'element-ui/src/utils/util';

export const getObjByPath = (obj, str) =>
  // getPropByPath(obj, str).v;
  {
    if (!str) return obj;
    const pathArr = str.split('.');
    let _obj = obj;
    while (pathArr.length) {
      let a = _obj[pathArr.shift()];
      _obj = pathArr.length && !a ? {} : a;
      //   if (_obj === undefined && pathArr.length) {
      //     console.error('你获取的对象为undefined，对应的prop为' + str);
      //     _obj = {};
      //   }
    }

    return _obj;
  };

/**通过path(格式为key1.key2.key3)对obj进行赋值和获取操作  */
export const objByPath = (obj, path) => {
  return {
    /**获取的是原对象下的值 */
    get() {
      return getObjByPath(obj, path);
    },
    /**对原对象下的key进行赋值 */
    set(val) {
      const pathArr = path.split('.');
      const lastKey = pathArr.pop();
      //   if (/isCode/.test(path)) {
      //     console.log('path', path);
      //     console.log('lastKey', lastKey);
      //     console.log(pathArr.join('.'));
      //   }

      let _obj = obj;
      while (pathArr.length) {
        const currPath = pathArr.shift();
        let a = _obj[currPath];
        if (a) {
          _obj = a;
        } else {
          _obj[currPath] = {};
          _obj = _obj[currPath];
        }
        // _obj = a ? a : (_obj = { [currPath]: {} });
      }
      _obj[lastKey] = val;
    },
  };
};

let time = {};
export function debounce(eventName, fn, delay = 1000) {
  function _debounce() {
    if (time[eventName] !== null) clearTimeout(time[eventName]);
    time[eventName] = setTimeout(fn, delay);
  }
  return _debounce;
}
