const Module = require('node:module');
const path = require('node:path');

const originalPathResolve = path.resolve;
path.resolve = (...segments) => {
  const resolved = originalPathResolve(...segments);
  return resolved.replace(
    `${path.sep}src${path.sep}src${path.sep}`,
    `${path.sep}src${path.sep}`
  );
};

const originalResolveFilename = Module._resolveFilename;
Module._resolveFilename = function resolveFilename(request, parent, isMain, options) {
  try {
    return originalResolveFilename.call(this, request, parent, isMain, options);
  } catch (error) {
    const parentFilename = parent?.filename;
    if (
      error?.code !== 'MODULE_NOT_FOUND'
      || typeof parentFilename !== 'string'
      || !parentFilename.includes(`${path.sep}src${path.sep}`)
      || !request.startsWith('../src/')
    ) {
      throw error;
    }

    const correctedRequest = request.replace(/^\.\.\/src\//, '../');
    return originalResolveFilename.call(this, correctedRequest, parent, isMain, options);
  }
};
