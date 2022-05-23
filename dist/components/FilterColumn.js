"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _semanticUiReact = require("semantic-ui-react");

var _react2 = _interopRequireDefault(require("cleave.js/react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var FilterColumn = function FilterColumn(props) {
  var onSubmit = props.onSubmit,
      column = props.column,
      column_extended = props.column_extended;
  var _column$format = column.format,
      format = _column$format === void 0 ? 'text' : _column$format;

  var _useState = (0, _react.useState)(''),
      _useState2 = _slicedToArray(_useState, 2),
      text = _useState2[0],
      setText = _useState2[1];

  var _useState3 = (0, _react.useState)({
    max: null,
    min: null,
    equal: null
  }),
      _useState4 = _slicedToArray(_useState3, 2),
      range = _useState4[0],
      setRange = _useState4[1];

  var colFormat = _typeof(format) === 'object' ? format.type : format;
  var column_extended_value = column_extended === null || column_extended === void 0 ? void 0 : column_extended.filter_value;
  var hasCurrencyValue = (0, _react.useMemo)(function () {
    return range.max != null || range.min != null || range.equal != null;
  }, [range]); // useEffect(() => {
  //    if (
  //       colFormat === 'currency' &&
  //       (range.max == null && range.min == null && range.equal == null)
  //    ){
  //       onSubmit(range)
  //    }
  //    // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [range])

  (0, _react.useEffect)(function () {
    if (column_extended_value != null) {
      if (colFormat === 'text' || colFormat === 'textarea') {
        setText(column_extended_value);
      } else if (colFormat === 'currency') {
        setRange(column_extended_value);
      }
    }
  }, [column_extended_value, colFormat]);

  if (colFormat === 'text' || colFormat === 'textarea' || colFormat === 'list') {
    return /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Popup, {
      on: "click",
      pinned: true,
      content: /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Input, {
        value: text,
        onChange: function onChange(e) {
          var _e$target;

          var value = e === null || e === void 0 ? void 0 : (_e$target = e.target) === null || _e$target === void 0 ? void 0 : _e$target.value;
          setText(value);

          if ((value === null || value === void 0 ? void 0 : value.length) === 0) {
            onSubmit('');
          }
        },
        onKeyDown: function onKeyDown(e) {
          if (e.keyCode === 13) {
            onSubmit(text);
          }
        },
        size: "mini",
        action: {
          icon: 'search',
          size: 'mini',
          onClick: function onClick() {
            onSubmit(text);
          }
        }
      }),
      trigger: /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Button, _extends({
        size: "mini",
        icon: "filter",
        style: {
          padding: '0.4rem'
        },
        type: 'button'
      }, text.length > 0 ? {
        color: 'orange'
      } : {}))
    });
  }

  if (colFormat === 'currency') {
    return /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Popup, {
      on: "click",
      pinned: true,
      content: /*#__PURE__*/_react["default"].createElement("div", {
        className: "FilterColumnCurrency"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "FilterColumnCurrencyGroup"
      }, /*#__PURE__*/_react["default"].createElement(FieldCurrency, {
        label: "Mayor a",
        value: range.max,
        disabled: range.equal,
        onChange: function onChange(value) {
          var newRange = _objectSpread(_objectSpread({}, range), {}, {
            max: value
          });

          setRange(newRange);

          if (value == null) {
            onSubmit(newRange);
          }
        }
      }), /*#__PURE__*/_react["default"].createElement(FieldCurrency, {
        label: "Menor a",
        value: range.min,
        disabled: range.equal,
        onChange: function onChange(value) {
          var newRange = _objectSpread(_objectSpread({}, range), {}, {
            min: value
          });

          setRange(newRange);

          if (value == null) {
            onSubmit(newRange);
          }
        }
      })), /*#__PURE__*/_react["default"].createElement("div", {
        className: "FilterColumnCurrencyGroup"
      }, /*#__PURE__*/_react["default"].createElement(FieldCurrency, {
        label: "Igual a",
        value: range.equal,
        disabled: range.max || range.min,
        onChange: function onChange(value) {
          var newRange = _objectSpread(_objectSpread({}, range), {}, {
            equal: value
          });

          setRange(newRange);

          if (value == null) {
            onSubmit(newRange);
          }
        }
      })), /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Button // disabled={range.max == null && range.min == null && range.equal == null}
      , {
        size: "tiny",
        icon: true,
        labelPosition: "left",
        fluid: true,
        onClick: function onClick() {
          onSubmit(range);
        }
      }, /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Icon, {
        name: "search",
        size: "tiny"
      }), "Buscar")),
      trigger: /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Button, _extends({
        size: "mini",
        icon: "filter",
        style: {
          padding: '0.4rem'
        }
      }, hasCurrencyValue ? {
        color: 'orange'
      } : {}))
    });
  }
};

FilterColumn.propTypes = {
  onSubmit: _propTypes["default"].func.isRequired,
  format: _propTypes["default"].string
};

var FieldCurrency = function FieldCurrency(_ref) {
  var label = _ref.label,
      value = _ref.value,
      _onChange = _ref.onChange,
      disabled = _ref.disabled;
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "FilterColumnField"
  }, /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Label, {
    size: "small"
  }, label), /*#__PURE__*/_react["default"].createElement(_react2["default"], {
    className: "InputField ".concat(disabled && 'FilterColumnInputDisabled'),
    value: value,
    disabled: disabled,
    onChange: function onChange(e) {
      var value = e.target.rawValue;

      try {
        var floatValue = parseFloat(value);

        _onChange(isNaN(floatValue) ? null : floatValue);
      } catch (error) {
        _onChange(null);
      }
    },
    onKeyDown: function onKeyDown(e) {} // onBlur={this.onBlur}
    // onFocus={this.onFocus}
    ,
    options: {
      numeral: true,
      rawValueTrimPrefix: true,
      numeralDecimalScale: 2,
      prefix: '$'
    }
  }));
};

var _default = FilterColumn;
exports["default"] = _default;