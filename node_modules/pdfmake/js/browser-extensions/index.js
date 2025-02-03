"use strict";

exports.__esModule = true;
exports.default = void 0;
var _base = _interopRequireDefault(require("../base"));
var _OutputDocumentBrowser = _interopRequireDefault(require("./OutputDocumentBrowser"));
var _URLBrowserResolver = _interopRequireDefault(require("./URLBrowserResolver"));
var _fs = _interopRequireDefault(require("fs"));
var _configurator = _interopRequireDefault(require("core-js/configurator"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// core-js: Polyfills will be used only if natives completely unavailable.
(0, _configurator.default)({
  useNative: ['Promise']
});
let defaultClientFonts = {
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf'
  }
};
class pdfmake extends _base.default {
  constructor() {
    super();
    this.urlResolver = new _URLBrowserResolver.default(this.virtualfs);
    this.fonts = defaultClientFonts;
  }
  addFontContainer(fontContainer) {
    this.addVirtualFileSystem(fontContainer.vfs);
    this.addFonts(fontContainer.fonts);
  }
  addVirtualFileSystem(vfs) {
    for (let key in vfs) {
      if (vfs.hasOwnProperty(key)) {
        let data;
        let encoding;
        if (typeof vfs[key] === 'object') {
          data = vfs[key].data;
          encoding = vfs[key].encoding || 'base64';
        } else {
          data = vfs[key];
          encoding = 'base64';
        }
        _fs.default.writeFileSync(key, data, encoding);
      }
    }
  }
  _transformToDocument(doc) {
    return new _OutputDocumentBrowser.default(doc);
  }
}
var _default = exports.default = new pdfmake();