'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _context = require('./context');

Object.defineProperty(exports, 'AllowContext', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_context).default;
  }
});

var _allow = require('./allow');

Object.defineProperty(exports, 'Allow', {
  enumerable: true,
  get: function get() {
    return _allow.Allow;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }