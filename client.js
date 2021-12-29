let pathToCompare = window.pathToCompare ? window.pathToCompare : "/compare.js";
let rebuild = (await import(pathToCompare)).rebuild;

export const createSyncObject = async (
  object,
  call,
  loopTime = 5000,
  awaitCall = null
) => {
  let doAwaitCall = true;
  while (true) {
    updateObjKeepingRef(
      object,
      rebuild(JSON.stringify(object), await call(hash(JSON.stringify(object))))
    );
    if (doAwaitCall && awaitCall) {
      let result = await awaitCall();
      if (!result.success) doAwaitCall = false;
    } else {
      await new Promise((resolve) => setTimeout(resolve, loopTime));
    }
  }
};

const updateObjKeepingRef = (sourceObj, newObj) => {
  Object.keys(newObj).forEach((key) => {
    if (
      newObj[key] &&
      typeof newObj[key] === "object" &&
      sourceObj[key] &&
      !(newObj[key] instanceof Date)
    ) {
      updateObjKeepingRef(sourceObj[key], newObj[key]);
    } else {
      sourceObj[key] = newObj[key];
    }
  });
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
