'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Provider = exports.Consumer = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _lodash = require('lodash');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var initialValues = {
  context: null
};

var ReactContext = React.createContext(initialValues);
var Consumer = ReactContext.Consumer;

var Provider = function (_React$Component) {
  _inherits(Provider, _React$Component);

  function Provider() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Provider);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Provider.__proto__ || Object.getPrototypeOf(Provider)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      context: _this.props.defaultContext
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Provider, [{
    key: 'getContext',
    value: function getContext(parentContext) {
      if (this.isControlled()) {
        if (parentContext) {
          return _extends({}, parentContext, this.props.context);
        } else {
          return this.props.context;
        }
      } else {
        return this.state.context;
      }
    }
  }, {
    key: 'isControlled',
    value: function isControlled() {
      return true || !(0, _lodash.isNil)(this.props.context);
    }
  }, {
    key: 'getProviderValue',
    value: function getProviderValue(parentContext) {
      var _this2 = this;

      return {
        context: this.getContext(parentContext),
        updateContext: function updateContext(context) {
          if (!_this2.isControlled()) {
            _this2.setState({ context: context });
          }
          if ((0, _lodash.isFunction)(_this2.props.onContextChange)) {
            _this2.props.onContextChange(context);
          }
        }
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      return React.createElement(
        ReactContext.Consumer,
        null,
        function (_ref2) {
          var context = _ref2.context;

          return React.createElement(
            ReactContext.Provider,
            { value: _this3.getProviderValue(context) },
            _this3.props.children
          );
        }
      );
    }
  }]);

  return Provider;
}(React.Component);

exports.Consumer = Consumer;
exports.Provider = Provider;
exports.default = { Consumer: Consumer, Provider: Provider };