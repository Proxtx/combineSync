let pathToCompare = window.pathToCompare ? window.pathToCompare : "/compare.js";
let rebuild = (await import(pathToCompare)).rebuild;

/**
 * Syncs an object with the server.
 * @param {Object} object The object which should be updated
 * @param {Array} call The request to the server which should execute the return object function via combine
 * @param {Integer} loopTime Time until the function refreshes the object
 * @param {Boolean} awaitCall Enable or Disable the awaitCall functionality
 */
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
      JSON.parse(
        rebuild(
          JSON.stringify(object),
          await call(hash(JSON.stringify(object)))
        )
      )
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

  Object.keys(sourceObj).forEach((key) => {
    if (!newObj[key]) delete sourceObj[key];
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
