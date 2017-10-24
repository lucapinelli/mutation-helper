import deepMerge from 'deepmerge';

/**
 * A collection of methods to mutate objects and arrays without modifying the source.
 */

/**
 * Deep merge the given objects.
 */
const merge = (...objects) => {
  return deepMerge.all(objects);
};

/**
 * @private
 */
const _getMetaPath = (field) => {
  const path = [];
  field.split('.').forEach(item => {
    const indexes = item.match(/\[\d+\]/g);
    if (!indexes) {
      if (!item.match(/^[\w\d-_]+$/)) {
        throw new Error('Invalid property accessor: ' + field + ' (' + item + ')');
      }
      path.push({ type: 'object', accessor: item });
    } else {
      if (!item.endsWith(indexes.join(''))) {
        throw new Error('Invalid syntax: ' + field);
      }
      const first = item.replace(indexes.join(''), '');
      if (first) {
        if (!first.match(/^[\w\d-_]+$/)) {
          throw new Error('Invalid property accessor: ' + field + ' (' + first + ')');
        }
        path.push({ type: 'object', accessor: first });
      }
      path.push(...indexes.map(v => ({ type: 'array', accessor: parseInt(v.substring(1, v.length - 1), 10) })));
    }
  });
  let prev = null;
  path.forEach(item => {
    if (prev) {
      item.prev = prev;
      prev.next = item;
    }
    prev = item;
  });
  return path;
};

/**
 * Returns a new object with the specified property updated using the given value.
 *
 * @param object the object to update.
 * @param field the path of the field to update.
 * @param value the value to set.
 * @return an immutable object
 */
const set = (object, field, value) => {
  const path = _getMetaPath(field);
  return _set(object, path, value);
};
const _arraySet = (array, index, value) => {
  const mutable = [ ...array ];
  mutable[index] = value;
  return mutable;
};
const _set = (object, path, value) => {
  if (!object) {
    throw new Error('invalid argument ' + object);
  }
  const { type, accessor, next } = path.shift();
  if (path.length === 0) {
    if (type === 'object') {
      return {...object, [accessor]: value};
    } else {
      return _arraySet(object, accessor, value);
    }
  }
  if (!object[accessor] || typeof object[accessor] !== 'object') {
    const init = next.type === 'object' ? {} : [];
    object = Array.isArray(object) ? _arraySet(object, accessor, init) : {...object, [accessor]: init};
  }
  const nextValue = _set(object[accessor], path, value);
  return Array.isArray(object) ? _arraySet(object, accessor, nextValue) : {...object, [accessor]: nextValue};
};

/**
 * Return the value of the specified field (null safe).
 *
 * @param object the object.
 * @param field the path of the field to get.
 * @return the value of the specified field.
 */
const get = (object, field) => {
  if (!object) {
    return undefined;
  }
  const path = _getMetaPath(field);
  let next = object;
  const last = path.pop();
  path.forEach((meta) => {
    if (next) {
      next = next[meta.accessor];
    }
  });
  return next ? next[last.accessor] : undefined;
};

/*
 * Array
 */

/**
 * @private
 */
const _apply = (array, methodName, ...args) => {
  if (!Array.isArray(array)) {
    throw new Error('the first argument is not an array: ' + array + '.');
  }
  const newArray = [...array];
  newArray[methodName](...args);
  return newArray;
};

const pop = (array) => { return _apply(array, 'pop'); };
const push = (array, ...args) => { return _apply(array, 'push', ...args); };
const reverse = (array, ...args) => { return _apply(array, 'reverse', ...args); };
const shift = (array, ...args) => { return _apply(array, 'shift', ...args); };
const sort = (array, ...args) => { return _apply(array, 'sort', ...args); };
const splice = (array, ...args) => { return _apply(array, 'splice', ...args); };
const unshift = (array, ...args) => { return _apply(array, 'unshift', ...args); };

export {
  merge,
  get,
  set,
  /* array */
  pop,
  push,
  reverse,
  shift,
  sort,
  splice,
  unshift
};
