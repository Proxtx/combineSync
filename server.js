import { compare } from "@proxtx/compare";

let objects = {};
let updateListeners = [];
let updateListenersEnabled = true;

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

export const awaitChange = async () => {
  if (!updateListenersEnabled) return { success: false };
  await new Promise((resolve) => updateListeners.push(resolve));
  return { success: true };
};

export const setUpdateListeners = (enabled) =>
  (updateListenersEnabled = enabled);

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
