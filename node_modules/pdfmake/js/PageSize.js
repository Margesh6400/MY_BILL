"use strict";

exports.__esModule = true;
exports.normalizePageMargin = normalizePageMargin;
exports.normalizePageSize = normalizePageSize;
var _standardPageSizes = _interopRequireDefault(require("./standardPageSizes"));
var _variableType = require("./helpers/variableType");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function normalizePageSize(pageSize, pageOrientation) {
  function isNeedSwapPageSizes(pageOrientation) {
    if ((0, _variableType.isString)(pageOrientation)) {
      pageOrientation = pageOrientation.toLowerCase();
      return pageOrientation === 'portrait' && size.width > size.height || pageOrientation === 'landscape' && size.width < size.height;
    }
    return false;
  }
  function pageSizeToWidthAndHeight(pageSize) {
    if ((0, _variableType.isString)(pageSize)) {
      let size = _standardPageSizes.default[pageSize.toUpperCase()];
      if (!size) {
        throw new Error(`Page size ${pageSize} not recognized`);
      }
      return {
        width: size[0],
        height: size[1]
      };
    }
    return pageSize;
  }

  // if pageSize.height is set to auto, set the height to infinity so there are no page breaks.
  if (pageSize && pageSize.height === 'auto') {
    pageSize.height = Infinity;
  }
  let size = pageSizeToWidthAndHeight(pageSize || 'A4');
  if (isNeedSwapPageSizes(pageOrientation)) {
    // swap page sizes
    size = {
      width: size.height,
      height: size.width
    };
  }
  size.orientation = size.width > size.height ? 'landscape' : 'portrait';
  return size;
}
function normalizePageMargin(margin) {
  if ((0, _variableType.isNumber)(margin)) {
    margin = {
      left: margin,
      right: margin,
      top: margin,
      bottom: margin
    };
  } else if (Array.isArray(margin)) {
    if (margin.length === 2) {
      margin = {
        left: margin[0],
        top: margin[1],
        right: margin[0],
        bottom: margin[1]
      };
    } else if (margin.length === 4) {
      margin = {
        left: margin[0],
        top: margin[1],
        right: margin[2],
        bottom: margin[3]
      };
    } else {
      throw new Error('Invalid pageMargins definition');
    }
  }
  return margin;
}