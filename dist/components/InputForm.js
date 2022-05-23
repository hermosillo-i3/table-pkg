"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _capitalize = _interopRequireDefault(require("lodash/capitalize"));

var _index = require("../../utils/index");

var _es = _interopRequireDefault(require("date-fns/locale/es"));

var _reactDatepicker = _interopRequireDefault(require("react-datepicker"));

var _semanticUiReact = require("semantic-ui-react");

var _reactSelect = _interopRequireDefault(require("react-select"));

var _react2 = _interopRequireDefault(require("cleave.js/react"));

var _TodoList = _interopRequireDefault(require("./TodoList"));

var _CheckboxList = _interopRequireDefault(require("./CheckboxList"));

var _ColorList = _interopRequireDefault(require("./ColorList"));

var _excluded = ["field", "type", "withLabel", "options", "label", "fileExtensions", "includeEmptyOption", "readOnly", "checkLabel", "fileStyle", "isIgnoringTouched", "decimals", "form"];

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var _default = function _default(_ref) {
  var field = _ref.field,
      _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'text' : _ref$type,
      _ref$withLabel = _ref.withLabel,
      withLabel = _ref$withLabel === void 0 ? true : _ref$withLabel,
      options = _ref.options,
      label = _ref.label,
      fileExtensions = _ref.fileExtensions,
      _ref$includeEmptyOpti = _ref.includeEmptyOption,
      includeEmptyOption = _ref$includeEmptyOpti === void 0 ? false : _ref$includeEmptyOpti,
      _ref$readOnly = _ref.readOnly,
      readOnly = _ref$readOnly === void 0 ? false : _ref$readOnly,
      checkLabel = _ref.checkLabel,
      fileStyle = _ref.fileStyle,
      isIgnoringTouched = _ref.isIgnoringTouched,
      decimals = _ref.decimals,
      _ref$form = _ref.form,
      touched = _ref$form.touched,
      errors = _ref$form.errors,
      setFieldValue = _ref$form.setFieldValue,
      setFieldError = _ref$form.setFieldError,
      setFieldTouched = _ref$form.setFieldTouched,
      props = _objectWithoutProperties(_ref, _excluded);

  return /*#__PURE__*/_react["default"].createElement("div", {
    style: props.style
  }, withLabel ? /*#__PURE__*/_react["default"].createElement("div", {
    className: "Modal_form_field_label",
    htmlFor: field.name
  }, label ? label : (0, _index.replaceAll)((0, _capitalize["default"])(field.name), '_', ' ')) : /*#__PURE__*/_react["default"].createElement("div", {
    className: "Modal_form_field_label"
  }), function () {
    var style;

    if (isIgnoringTouched) {
      style = errors[field.name] ? _objectSpread(_objectSpread({}, props.inputStyle), {}, {
        border: 'solid 1px red'
      }) : _objectSpread({}, props.inputStyle);
    } else {
      style = touched[field.name] && errors[field.name] ? _objectSpread(_objectSpread({}, props.inputStyle), {}, {
        border: 'solid 1px red'
      }) : _objectSpread({}, props.inputStyle);
    }

    if (readOnly) {
      style = _objectSpread({
        background: '#eeeeee'
      }, style);
    }

    switch (type) {
      case 'date':
        return /*#__PURE__*/_react["default"].createElement(_reactDatepicker["default"], _extends({
          locale: _es["default"],
          selected: field.value
        }, field, props, {
          onChange: function onChange(date) {
            var onChange = props.onChange;
            if (onChange) onChange(date);
            setFieldTouched(field.name, true);
            setFieldValue(field.name, date);
          }
        }));

      case 'select':
        return /*#__PURE__*/_react["default"].createElement("select", _extends({
          className: "Modal_form_field_input"
        }, field, props, {
          onChange: function onChange(e) {
            var value = e.target.value;
            if (props.onChange) props.onChange(value);
            setFieldValue(field.name, value);
            setFieldTouched(field.name, true);
          },
          disabled: readOnly,
          style: _objectSpread({}, style)
        }), includeEmptyOption && /*#__PURE__*/_react["default"].createElement("option", {
          key: undefined,
          value: undefined
        }), options && options.map(function (opt) {
          return /*#__PURE__*/_react["default"].createElement("option", {
            key: opt.value,
            value: opt.value,
            disabled: opt.disabled ? opt.disabled : false
          }, opt.label);
        }));

      case 'select-multiple':
        return /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Dropdown, _extends({}, field, props, {
          validate: function validate(value) {
            var validate = props.validate;
            if (validate) validate(value);
          },
          fluid: true,
          multiple: true,
          selection: true,
          options: options,
          onChange: function onChange(_, data) {
            var onChange = props.onChange;
            if (onChange) onChange(data.value);
            setFieldValue(field.name, data.value);
          },
          onBlur: function onBlur(_, data) {
            var onBlur = props.onBlur;
            if (onBlur) onBlur(data.value);
            setFieldValue(field.name, data.value);
          }
        }));

      case 'react-select':
        return /*#__PURE__*/_react["default"].createElement(_reactSelect["default"], _extends({}, field, props, {
          onChange: function onChange(data) {
            var onChange = props.onChange;
            if (onChange) onChange(data.value);
            setFieldValue(field.name, data);
          },
          options: options
        }));

      case 'textarea':
        return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("textarea", _extends({
          className: "Modal_form_field_input",
          style: touched[field.name] && errors[field.name] ? {
            border: 'solid 1px red'
          } : null
        }, field, {
          value: field.value || undefined
        }, props)));

      case 'check':
        return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Checkbox, _extends({}, field, props, {
          label: checkLabel ? checkLabel : label,
          defaultChecked: field.value,
          onChange: function onChange(_, data) {
            var onChange = props.onChange;
            if (onChange) onChange(data.checked);
            setFieldValue(field.name, data.checked);
          }
        })));

      case 'check-list':
        return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_CheckboxList["default"], _extends({}, field, props, {
          value: field.value,
          onChange: function onChange(value) {
            var onChange = props.onChange;
            if (onChange) onChange(value);
            setFieldValue(field.name, value);
          }
        })));

      case 'check-radio-group':
        return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Form.Group, {
          grouped: true
        }, label && /*#__PURE__*/_react["default"].createElement("div", {
          className: "Modal_form_field_label"
        }, label), options && options.map(function (opt) {
          var _opt$checked;

          return /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Form.Radio, {
            label: opt.label,
            value: opt.value,
            checked: (_opt$checked = opt.checked) !== null && _opt$checked !== void 0 ? _opt$checked : false,
            onChange: function onChange(_, data) {
              var onChange = props.onChange;
              if (onChange) onChange(data.value);
            }
          });
        })));

      case 'todo-list':
        return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_TodoList["default"], _extends({}, field, props, {
          list: field.value,
          onChange: function onChange(list) {
            var onChange = props.onChange;
            if (onChange) onChange(list);
            setFieldValue(field.name, list);
          }
        })));

      case 'color-list':
        return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_ColorList["default"], _extends({}, field, props, {
          onChange: function onChange(color) {
            var onChange = props.onChange;
            if (onChange) onChange(color);
            setFieldValue(field.name, color);
          }
        })));

      case 'file':
        return /*#__PURE__*/_react["default"].createElement("div", {
          style: _objectSpread({
            display: 'flex'
          }, fileStyle)
        }, /*#__PURE__*/_react["default"].createElement("input", _extends({}, field, props, {
          className: "Modal_form_field_input",
          style: touched[field.name] && errors[field.name] ? {
            border: 'solid 1px red'
          } : null,
          value: field.value ? field.value.filename : '',
          readOnly: true
        })), /*#__PURE__*/_react["default"].createElement("input", {
          type: "file",
          style: {
            display: 'none'
          },
          className: "inputfile",
          id: "embedpollfileinput".concat(field.name),
          accept: fileExtensions ? fileExtensions.join(',') : undefined,
          onChange: function onChange(event) {
            if (event.target.files.length > 0) {
              var filename = event.target.files[0].name;
              var content = event.target.files[0];
              setFieldValue(field.name, {
                filename: filename,
                content: content
              });
            }
          }
        }), /*#__PURE__*/_react["default"].createElement("label", {
          htmlFor: "embedpollfileinput".concat(field.name),
          className: "Form_field_label ui icon button"
        }, /*#__PURE__*/_react["default"].createElement("i", {
          className: "ui search icon"
        })));

      case "currency":
        {
          return /*#__PURE__*/_react["default"].createElement(_react2["default"], {
            style: _objectSpread({
              textAlign: 'left'
            }, style),
            className: "Modal_form_field_input",
            value: field.value // htmlRef={(input) => {
            //    this.input = input
            // }}
            ,
            onChange: function onChange(e) {
              var value = e.target.rawValue ? e.target.rawValue.length > 0 ? e.target.rawValue : 0 : 0;
              var isValid = true;

              if (props.maxValue != null) {
                var floatValue = parseFloat(value);
                isValid = floatValue <= props.maxValue;
              }

              var newValue;

              if (isValid) {
                newValue = value;
              } else {
                newValue = props.maxValue;
              }

              if (props.onChange) props.onChange(newValue);
              setFieldValue(field.name, newValue);
              setFieldTouched(field.name, true);
            },
            readOnly: readOnly,
            options: {
              numeral: true,
              rawValueTrimPrefix: true,
              numeralDecimalScale: decimals !== null && decimals !== void 0 ? decimals : 2,
              prefix: '$'
            }
          });
        }

      case "numerical":
        {
          return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("input", _extends({
            className: "Modal_form_field_input",
            type: type,
            style: style
          }, field, {
            value: field.value || '',
            readOnly: readOnly
          }, props, {
            onChange: function onChange(e) {
              var value = e.target.value;
              var regex = /^[0-9]{0,2}$/;

              if (regex.exec(value)) {
                setFieldValue(field.name, value);
                if (props.onChange) props.onChange(value);
                setFieldTouched(field.name, true);
              }
            }
          })));
        }

      case "float":
        {
          return /*#__PURE__*/_react["default"].createElement(_react2["default"], {
            style: _objectSpread({
              textAlign: 'left'
            }, style),
            className: "Modal_form_field_input",
            value: field.value,
            onChange: function onChange(e) {
              var value = e.target.rawValue ? e.target.rawValue.length > 0 ? e.target.rawValue : 0 : 0;
              var isValid = true;

              if (props.maxValue != null) {
                var floatValue = parseFloat(value);
                isValid = floatValue <= props.maxValue;
              }

              var newValue;

              if (isValid) {
                newValue = value;
              } else {
                newValue = props.maxValue;
              }

              if (props.onChange) props.onChange(newValue);
              setFieldValue(field.name, newValue);
              setFieldTouched(field.name, true);
            },
            readOnly: readOnly,
            options: {
              numeral: true,
              rawValueTrimPrefix: true,
              numeralDecimalScale: 2
            }
          });
        }

      case "percentage":
        return /*#__PURE__*/_react["default"].createElement(_react2["default"], {
          style: _objectSpread({
            textAlign: 'left'
          }, style),
          className: "Modal_form_field_input",
          value: field.value,
          onChange: function onChange(e) {
            var MAX_VALUE = 100;
            var value = e.target.rawValue ? e.target.rawValue.length > 0 ? e.target.rawValue : undefined : undefined;
            var isValid = true;

            if (MAX_VALUE != null && value) {
              var floatValue = parseFloat(value);
              isValid = floatValue <= MAX_VALUE;
            }

            var newValue;

            if (isValid) {
              newValue = value;
            } else {
              newValue = MAX_VALUE;
            }

            if (props.onChange) props.onChange(newValue);
            setFieldValue(field.name, newValue);
            setFieldTouched(field.name, true);
          },
          onKeyDown: function onKeyDown(e) {
            var value = e.target.rawValue ? e.target.rawValue.length > 0 ? e.target.rawValue : undefined : undefined;

            if (e.key === 'Backspace' && value) {
              e.currentTarget.setSelectionRange((value === null || value === void 0 ? void 0 : value.length) - 1, value === null || value === void 0 ? void 0 : value.length);
            }
          },
          readOnly: readOnly,
          options: {
            numeral: true,
            numeralPositiveOnly: true,
            numeralIntegerScale: 3,
            numeralDecimalScale: decimals || 2,
            numeralDecimalMark: '.',
            prefix: '%',
            tailPrefix: true,
            rawValueTrimPrefix: true
          }
        });

      default:
        return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("input", _extends({
          className: "Modal_form_field_input",
          type: type,
          style: style
        }, field, {
          value: field.value || '',
          readOnly: readOnly
        }, props, {
          onChange: function onChange(e) {
            var value = e.target.value;

            if (type === "number") {
              value = parseInt(value);
            }

            if (props.onChange) props.onChange(value);
            setFieldTouched(field.name, true);
            setFieldValue(field.name, value);
          }
        })));
    }
  }(), isIgnoringTouched ? errors[field.name] && /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      color: 'red'
    }
  }, errors[field.name]) : touched[field.name] && errors[field.name] && /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      color: 'red'
    }
  }, errors[field.name]));
};

exports["default"] = _default;