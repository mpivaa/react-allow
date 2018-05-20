'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Allow = Allow;

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _allow = require('../allow');

var _context = require('./context');

var _context2 = _interopRequireDefault(_context);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function Allow(_ref) {
  var children = _ref.children,
      roles = _ref.roles,
      IfNotAllowed = _ref.ifNotAllowed,
      overrideContext = _ref.overrideContext;


  return React.createElement(
    _context2.default.Consumer,
    null,
    function (_ref2) {
      var appContext = _ref2.context;

      var ctx = overrideContext || appContext;
      if ((0, _allow.isAllowed)(ctx, roles)) {
        return children;
      } else if (IfNotAllowed) {
        return React.createElement(IfNotAllowed, null);
      } else {
        return null;
      }
    }
  );
}