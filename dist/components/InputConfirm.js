"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _semanticUiReact = require("semantic-ui-react");

var _pick = _interopRequireDefault(require("lodash/pick"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var InputConfirm = function InputConfirm(props) {
  var _useState = (0, _react.useState)(props.value),
      _useState2 = _slicedToArray(_useState, 1),
      initialValue = _useState2[0];

  var _useState3 = (0, _react.useState)(props.hide !== undefined ? props.hide : true),
      _useState4 = _slicedToArray(_useState3, 2),
      hide = _useState4[0],
      setHide = _useState4[1];

  var _useState5 = (0, _react.useState)(props.value),
      _useState6 = _slicedToArray(_useState5, 2),
      value = _useState6[0],
      setValue = _useState6[1];

  var _useState7 = (0, _react.useState)(false),
      _useState8 = _slicedToArray(_useState7, 2),
      editMode = _useState8[0],
      setEditMode = _useState8[1];

  var inputRef = (0, _react.useRef)(null);
  (0, _react.useEffect)(function () {
    setHide(props.hide);
  }, [props.hide]);
  (0, _react.useEffect)(function () {
    if (editMode) {
      setFocusInput();
    }
  }, [editMode]);
  (0, _react.useEffect)(function () {
    if (props.appearOnClick) setEditMode(true);
  }, [props.appearOnClick]);
  (0, _react.useEffect)(function () {
    if (!hide) setFocusInput();
  }, [hide]);

  var onAccept = function onAccept() {
    if (!appearOnClick) setEditMode(false);
    setHide(true);
    if (props.onAccept) props.onAccept(value);
  };

  var onCancel = function onCancel() {
    setValue(initialValue);
    if (!appearOnClick) setEditMode(false);
    setHide(true);
    if (props.onCancel) props.onCancel(initialValue);
  };

  var onKeyDown = function onKeyDown(e) {
    if (e.keyCode === 13) onAccept();
    if (e.keyCode === 2) onCancel();
    if (props.onKeyDown) props.onKeyDown(e);
  };

  var setFocusInput = function setFocusInput() {
    if (inputRef && inputRef.current) inputRef.current.focus();
  };

  var propsFilteredForInput = (0, _pick["default"])(props, ['placeholder', 'type', 'maxLength']);
  var ComponentTrigger = props.trigger,
      appearOnClick = props.appearOnClick;
  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, hide && appearOnClick && /*#__PURE__*/_react["default"].cloneElement(ComponentTrigger, {
    onClick: function onClick() {
      setHide(false);
    }
  }), (!appearOnClick || !hide) && /*#__PURE__*/_react["default"].createElement("div", {
    className: "input-confirm"
  }, /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Input, _extends({
    className: "full-size h4",
    value: value,
    onKeyDown: onKeyDown,
    onKeyUp: props.onKeyUp,
    ref: inputRef,
    onBlur: onAccept,
    onChange: function onChange(e, data) {
      setValue(e.target.value);
      setEditMode(true);
      if (props.onChange) props.onChange(e.target.value);
    }
  }, propsFilteredForInput)), /*#__PURE__*/_react["default"].createElement("div", {
    className: 'clickable actions ' + (editMode ? '' : 'hide')
  }, /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Button, {
    basic: true,
    icon: "check",
    className: "on-hover-green",
    onClick: onAccept
  }), /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Button, {
    basic: true,
    icon: 'cancel',
    className: "on-hover-red",
    onClick: onCancel
  }))));
};

InputConfirm.propTypes = {
  trigger: _propTypes["default"].node,
  appearOnClick: _propTypes["default"].bool,
  onAccept: _propTypes["default"].func,
  onKeyUp: _propTypes["default"].func,
  onKeyDown: _propTypes["default"].func,
  onCancel: _propTypes["default"].func,
  onChange: _propTypes["default"].func,
  value: _propTypes["default"].any,
  editMode: _propTypes["default"].bool
};
var _default = InputConfirm;
exports["default"] = _default;