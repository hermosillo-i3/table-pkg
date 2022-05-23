"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _semanticUiReact = require("semantic-ui-react");

require("./styles/ContextMenu.scss");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var ContextMenu = function ContextMenu(props) {
  var x = props.x,
      y = props.y,
      _props$actions = props.actions,
      actions = _props$actions === void 0 ? [] : _props$actions,
      onClose = props.onClose;
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "ContextMenu",
    style: {
      top: y,
      left: x,
      backgroundColor: "white"
    }
  }, actions.map(function (action) {
    return /*#__PURE__*/_react["default"].createElement("div", {
      className: "ContextMenuRow",
      onClick: function onClick() {
        action.action();
        onClose();
      }
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "ContextMenuRowIcon"
    }, /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Icon, {
      name: action.icon
    })), /*#__PURE__*/_react["default"].createElement("div", {
      className: "ContextMenuRowContent"
    }, action.name));
  }));
};

ContextMenu.propTypes = {};
var _default = ContextMenu;
exports["default"] = _default;