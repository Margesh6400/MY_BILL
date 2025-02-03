"use strict";

exports.__esModule = true;
exports.isEmptyObject = isEmptyObject;
exports.isNumber = isNumber;
exports.isObject = isObject;
exports.isPositiveInteger = isPositiveInteger;
exports.isString = isString;
exports.isValue = isValue;
/**
 * @param {any} variable
 * @returns {boolean}
 */
function isString(variable) {
  return typeof variable === 'string' || variable instanceof String;
}

/**
 * @param {any} variable
 * @returns {boolean}
 */
function isNumber(variable) {
  return typeof variable === 'number' || variable instanceof Number;
}

/**
 * @param {any} variable
 * @returns {boolean}
 */
function isPositiveInteger(variable) {
  if (!isNumber(variable) || !Number.isInteger(variable) || variable <= 0) {
    return false;
  }
  return true;
}

/**
 * @param {any} variable
 * @returns {boolean}
 */
function isObject(variable) {
  return variable !== null && !Array.isArray(variable) && !isString(variable) && !isNumber(variable) && typeof variable === 'object';
}

/**
 * @param {any} variable
 * @returns {boolean}
 */
function isEmptyObject(variable) {
  return isObject(variable) && Object.keys(variable).length === 0;
}

/**
 * @param {any} variable
 * @returns {boolean}
 */
function isValue(variable) {
  return variable !== undefined && variable !== null;
}