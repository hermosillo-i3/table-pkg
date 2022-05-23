"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var colorButtonStyle = {
  display: 'flex',
  margin: '0 8px 8px 0',
  width: '48px',
  height: '32px',
  borderRadius: '4px',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer'
};
var iconStyle = {
  margin: 0,
  height: '17px',
  color: 'white',
  display: 'block',
  ':hover': {
    opacity: '0.8'
  }
};
var listColorsStyle = {
  display: 'flex',
  flexBasis: '100%',
  flexWrap: 'wrap'
};

var ColorList = function ColorList(props) {
  var colors = props.colors,
      onChange = props.onChange,
      value = props.value;
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: listColorsStyle
  }, colors.map(function (color) {
    return /*#__PURE__*/_react["default"].createElement("div", {
      style: colorButtonStyle,
      className: "bg-base ".concat(color, " hover-opacity"),
      key: color,
      onClick: function onClick() {
        return onChange(color);
      }
    }, /*#__PURE__*/_react["default"].createElement("i", {
      className: "icon ".concat(value === color ? 'check' : ''),
      style: iconStyle
    }));
  }));
};

ColorList.propTypes = {
  colors: _propTypes["default"].array.isRequired,
  onChange: _propTypes["default"].func.isRequired
};
var _default = ColorList;
exports["default"] = _default;