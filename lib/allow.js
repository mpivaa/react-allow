'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.setupAllow = setupAllow;
exports.isAllowed = isAllowed;

var _lodash = require('lodash');

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

var config = exports.config = {
  levels: ['app'],
  default: 'app',
  aliases: {
    'a': 'app'
  }
};

function setupAllow(newConfig) {
  exports.config = config = _extends({}, config, newConfig);
}

function isAllowed(ctx, allowedRoles) {
  if (isValidContext(ctx)) {
    return (0, _lodash.some)(parseRoles(allowedRoles), function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          level = _ref2[0],
          role = _ref2[1];

      if (isValidContext(ctx)) {
        return checkRole([level, role], ctx);
      }
      return false;
    });
  } else {
    return false;
  }
}

function checkRole(_ref3, ctx) {
  var _ref4 = _slicedToArray(_ref3, 2),
      level = _ref4[0],
      role = _ref4[1];

  var roleOnLevel = getRoleOnLevel(level, ctx);
  if (!(0, _lodash.isNil)(roleOnLevel)) {
    return role === "*" || roleOnLevel === role;
  } else {
    return false;
  }
}

function parseRoles(allowedRoles) {
  return (0, _lodash.map)(allowedRoles, function (composedRole) {
    var _composedRole$split = composedRole.split(':'),
        _composedRole$split2 = _toArray(_composedRole$split),
        level = _composedRole$split2[0],
        role = _composedRole$split2[1],
        ignore = _composedRole$split2.slice(2);

    var expandedLevel = expandLevel(level);
    return [expandedLevel, role];
  });
}

function getRoleOnLevel(level, ctx) {
  var user = ctx.user;

  if (level === config.default) {
    return (0, _lodash.get)(user, ['roles', level], null);
  } else {
    var id = (0, _lodash.get)(ctx, [level, 'id'], null);
    return (0, _lodash.get)(user, ['roles', level, id], null);
  }
}

function expandLevel(level) {
  if (!(0, _lodash.isNil)(config.aliases[level])) {
    return config.aliases[level];
  } else {
    return level;
  }
}

function isValidContext(ctx) {
  return !(0, _lodash.isEmpty)(ctx) && !(0, _lodash.isNil)(ctx) && !(0, _lodash.isNil)(ctx.user);
}