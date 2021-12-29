import { compare } from "@proxtx/compare";

let objects = {};
let updateListeners = [];
let updateListeners = true;

export const returnObject = (object, prevHash) => {
  object = JSON.stringify(object);
  if (objects[prevHash]) {
    return compare(objects[prevHash], object);
  }
  objects[hash(object)] = object;
  for (let i in updateListeners) {
    updateListeners[i]();
  }
  updateListeners = [];
  return object;
};

export const awaitChange = async () => {
  if (!updateListeners) return { success: false };
  await new Promise((resolve) => updateListeners.push(resolve));
  return { success: true };
};

export const setUpdateListeners = (enabled) => (updateListeners = enabled);

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
