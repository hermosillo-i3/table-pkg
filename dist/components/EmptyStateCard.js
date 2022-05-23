"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactFontawesome = require("@fortawesome/react-fontawesome");

var _semanticUiReact = require("semantic-ui-react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var EmptyStateCard = function EmptyStateCard(props) {
  var isOver = props.isOver,
      canDrop = props.canDrop,
      title = props.title,
      subtitle = props.subtitle,
      icon = props.icon,
      iconRotation = props.iconRotation,
      _props$isMultiple = props.isMultiple,
      isMultiple = _props$isMultiple === void 0 ? false : _props$isMultiple,
      _props$size = props.size,
      size = _props$size === void 0 ? "medium" : _props$size;
  var iconSize;

  switch (size) {
    case 'small':
      iconSize = "2x";
      break;

    case 'medium':
      iconSize = "4x";
      break;

    case 'big':
      iconSize = "6x";
      break;

    default:
      break;
  }

  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "empty-table-card-container-".concat(size, " ").concat(isOver && canDrop ? 'is_over_zone' : '')
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "empty-table-card"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "empty-table-card-icon-".concat(size)
  }, /*#__PURE__*/_react["default"].createElement(_reactFontawesome.FontAwesomeIcon, {
    rotation: iconRotation,
    icon: icon,
    size: iconSize,
    className: "icon"
  })), isMultiple && /*#__PURE__*/_react["default"].createElement("div", {
    className: "empty-table-card-icon-multiple-".concat(size, " absolute")
  }, /*#__PURE__*/_react["default"].createElement(_reactFontawesome.FontAwesomeIcon, {
    rotation: iconRotation,
    icon: icon,
    size: iconSize,
    className: "icon"
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: "empty-table-card-icon-".concat(size, " absolute")
  }, /*#__PURE__*/_react["default"].createElement(_reactFontawesome.FontAwesomeIcon, {
    rotation: iconRotation,
    icon: icon,
    size: iconSize,
    className: "icon"
  }))), /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Header, {
    as: size === 'medium' ? 'h4' : 'h5'
  }, title, subtitle && /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Header.Subheader, null, subtitle)));
};

EmptyStateCard.propTypes = {
  isOver: _propTypes["default"].bool,
  canDrop: _propTypes["default"].bool,
  icon: _propTypes["default"].string.isRequired
};
var _default = EmptyStateCard;
exports["default"] = _default;