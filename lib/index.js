'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Parser = require('./Parser');

var _Parser2 = _interopRequireDefault(_Parser);

var _scopeGenerator = require('./scopeGenerator');

var _scopeGenerator2 = _interopRequireDefault(_scopeGenerator);

var _postcssModulesLocalByDefault = require('postcss-modules-local-by-default');

var _postcssModulesLocalByDefault2 = _interopRequireDefault(_postcssModulesLocalByDefault);

var _postcssModulesScope = require('postcss-modules-scope');

var _postcssModulesScope2 = _interopRequireDefault(_postcssModulesScope);

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_postcssModulesScope2.default.generateScopedName = _scopeGenerator2.default;

exports.default = _postcss2.default.plugin('postcss-css-modules', function () {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var plugins = [_postcssModulesLocalByDefault2.default, _postcssModulesScope2.default];
  var parser = new _Parser2.default();

  return function (css, result) {
    var styles = (0, _postcss2.default)(plugins.concat(parser.plugin)).process(css).css;
    opts.getTokens(parser.exportTokens);
  };
});