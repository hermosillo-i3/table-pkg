"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Resize = /*#__PURE__*/function (_React$Component) {
  _inherits(Resize, _React$Component);

  var _super = _createSuper(Resize);

  function Resize(props) {
    var _this;

    _classCallCheck(this, Resize);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "onExpanderDraggin", function (e) {
      //e.preventDefault();
      var xpos = e.pageX;
      var ypos = e.pageY;

      if (xpos != 0) {
        var grow = _this.state.x - xpos;
        var left_div = _this.state.left_div.base + grow * -1;

        _this.setState(function (prevState) {
          return {
            left_div: _objectSpread(_objectSpread({}, prevState.left_div), {}, {
              current: left_div
            })
          };
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onExpanderEnd", function (e) {
      var xpos = e.pageX;
      var ypos = e.pageY;
      var grow = _this.state.x - xpos;
      var left_div = _this.state.left_div.base + grow * -1;

      _this.setState(function (prevState) {
        return {
          left_div: _objectSpread(_objectSpread({}, prevState.left_div), {}, {
            base: left_div
          })
        };
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onExpanderStart", function (e) {
      //e.preventDefault();
      var xpos = e.pageX;

      _this.setState(function (prevState) {
        return {
          x: xpos
        };
      });
    });

    _this.state = {
      left_div: {
        current: 100,
        base: 100
      },
      right_div: 150,
      x: 0
    };
    return _this;
  }

  _createClass(Resize, [{
    key: "render",
    value: function render() {
      var props = this.props,
          state = this.state;
      return /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          display: 'flex'
        }
      }, /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          width: "".concat(state.left_div.current, "px"),
          backgroundColor: 'red',
          position: 'relative',
          display: 'flex'
        }
      }, /*#__PURE__*/_react["default"].createElement("div", null, "Parte Izquierda"), /*#__PURE__*/_react["default"].createElement("div", {
        onDrag: this.onExpanderDraggin,
        onDragEnd: this.onExpanderEnd //onMouseEnter={this.onExpanderStart}
        ,
        onDragStart: this.onExpanderStart,
        style: {
          position: 'absolute',
          top: '0',
          right: '-15px',
          bottom: '0',
          zIndex: 10,
          width: '36px',
          display: 'inline-block',
          // backgroundColor: 'yellow',
          cursor: 'col-resize'
        }
      })), /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          width: "".concat(state.right_div, "px"),
          backgroundColor: 'blue'
        }
      }, "Parte Derecha"));
    }
  }]);

  return Resize;
}(_react["default"].Component);

exports["default"] = Resize;