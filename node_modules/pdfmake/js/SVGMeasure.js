"use strict";

exports.__esModule = true;
exports.default = void 0;
var _xmldoc = _interopRequireDefault(require("xmldoc"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Strip unit postfix, parse number, but return undefined instead of NaN for bad input
 *
 * @param {string} textVal
 * @returns {?number}
 */
const stripUnits = textVal => {
  let n = parseFloat(textVal);
  if (typeof n !== 'number' || isNaN(n)) {
    return undefined;
  }
  return n;
};

/**
 * Make sure it's valid XML and the root tage is <svg/>, returns xmldoc DOM
 *
 * @param {string} svgString
 * @returns {object}
 */
const parseSVG = svgString => {
  let doc;
  try {
    doc = new _xmldoc.default.XmlDocument(svgString);
  } catch (err) {
    throw new Error('SVGMeasure: ' + err);
  }
  if (doc.name !== "svg") {
    throw new Error('SVGMeasure: expected <svg> document');
  }
  return doc;
};
class SVGMeasure {
  constructor() {}
  measureSVG(svgString) {
    let doc = parseSVG(svgString);
    let docWidth = stripUnits(doc.attr.width);
    let docHeight = stripUnits(doc.attr.height);
    if ((docWidth === undefined || docHeight === undefined) && typeof doc.attr.viewBox === 'string') {
      let viewBoxParts = doc.attr.viewBox.split(/[,\s]+/);
      if (viewBoxParts.length !== 4) {
        throw new Error("Unexpected svg viewbox format, should have 4 entries but found: '" + doc.attr.viewBox + "'");
      }
      if (docWidth === undefined) {
        docWidth = stripUnits(viewBoxParts[2]);
      }
      if (docHeight === undefined) {
        docHeight = stripUnits(viewBoxParts[3]);
      }
    }
    return {
      width: docWidth,
      height: docHeight
    };
  }
  writeDimensions(svgString, dimensions) {
    let doc = parseSVG(svgString);
    doc.attr.width = "" + dimensions.width;
    doc.attr.height = "" + dimensions.height;
    return doc.toString();
  }
}
var _default = exports.default = SVGMeasure;