import { compare } from "@proxtx/compare";

let objects = {};
let updateListeners = [];
let updateListenersEnabled = true;

/**
 * Compares the new object with the old object if stored
 * @param {Object} object The new object
 * @param {String} prevHash The hash of the previous object
 * @returns a comparison of the two objects
 */
export const returnObject = (object, prevHash) => {
  object = JSON.stringify(object);
  if (!objects[hash(object)]) {
    objects[hash(object)] = object;
  }
  if (objects[prevHash]) {
    return compare(objects[prevHash], object);
  }
  return compare("", object);
};

/**
 * Does not resolve the promise until a change happens
 * @returns Success
 */
export const awaitChange = async () => {
  if (!updateListenersEnabled) return { success: false };
  await new Promise((resolve) => updateListeners.push(resolve));
  return { success: true };
};

/**
 * Enable or disable update listeners
 * @param {Boolean} enabled Enable update listeners
 */
export const setUpdateListeners = (enabled) =>
  (updateListenersEnabled = enabled);

/**
 * Resolves all change listeners
 */
export const objectUpdate = () => {
  for (let i in updateListeners) {
    updateListeners[i]();
  }
  updateListeners = [];
};

const hash = (string) => {
  var hash = 0,
    i,
    chr;
  if (string.length === 0) return hash;
  for (i = 0; i < string.length; i++) {
    chr = string.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
};
