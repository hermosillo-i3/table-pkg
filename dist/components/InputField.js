"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactTextareaAutosize = _interopRequireDefault(require("react-textarea-autosize"));

var _semanticUiReact = require("semantic-ui-react");

var _es = _interopRequireDefault(require("date-fns/locale/es"));

var _reactDatepicker = _interopRequireDefault(require("react-datepicker"));

var _react2 = _interopRequireDefault(require("cleave.js/react"));

var _InputConfirm = _interopRequireDefault(require("./InputConfirm"));

var _reactNumberFormat = _interopRequireDefault(require("react-number-format"));

var _moment = _interopRequireDefault(require("moment"));

var _index = require("../../utils/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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

var InputField = /*#__PURE__*/function (_React$Component) {
  _inherits(InputField, _React$Component);

  var _super = _createSuper(InputField);

  function InputField(props) {
    var _this;

    _classCallCheck(this, InputField);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "resetValue", function () {
      _this.setState(function (prevState) {
        return {
          currentValue: prevState.previousValue
        };
      });
    });

    var currentValue = _this.props.value;

    if (_this.props.defaultValue != null) {
      currentValue = _this.props.value != null ? _this.props.value : _this.props.defaultValue;
    }

    _this.state = {
      currentValue: currentValue,
      previousValue: _this.props.value,
      caretPos: 0,
      isTextAreaMultiLineActive: false
    };
    _this.onChange = _this.onChange.bind(_assertThisInitialized(_this));
    _this.onChangeDate = _this.onChangeDate.bind(_assertThisInitialized(_this));
    _this.onBlur = _this.onBlur.bind(_assertThisInitialized(_this));
    _this.onFocus = _this.onFocus.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(InputField, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var _this2 = this;

      if (this.state.currentValue === prevState.currentValue && this.props.value !== prevState.previousValue) {
        this.setState(function (prevState) {
          return {
            currentValue: _this2.props.value,
            previousValue: _this2.props.value
          };
        });
      }

      if (this.props.isFocused !== prevProps.isFocused) {
        if (this.input && this.input.focus && this.props.isFocused) {
          this.input.focus();
        }
      }
    }
  }, {
    key: "onChange",
    value: function onChange(e) {
      var newValue = e.target.value;
      var valid = false;
      var format = this.props.format;
      var type = typeof format === 'string' ? format : format.type;
      var decimals = typeof format === 'string' ? 2 : format.decimals;
      var maxValue = typeof format === 'string' ? undefined : format.hasOwnProperty('maxValue') ? format.maxValue : undefined;
      var re, isInRange;

      switch (type) {
        case "text":
          valid = true;
          break;

        case "number":
          re = new RegExp("^-?\\d*(\\.\\d{0,".concat(decimals, "})?$"));
          newValue = newValue.replace(/^0+(?!\.|$)/, ''); // Automatically will change the newValue removing leading zeros

          isInRange = true;

          if (newValue.match(re)) {
            if (newValue === '') {
              newValue = parseFloat('0');
            } //  Convert string to float


            if (maxValue != null) {
              var floatValue = parseFloat(newValue);

              if (floatValue) {
                isInRange = floatValue <= maxValue;
              }
            }

            valid = isInRange;
          } else {
            valid = false;
          }

          break;

        case "number-with-negative":
          re = new RegExp("^-?\\d*(\\.\\d{0,".concat(decimals, "})?$"));
          isInRange = true;

          if (newValue.match(re)) {
            //  Convert string to float
            if (maxValue != null) {
              var _floatValue = parseFloat(newValue);

              isInRange = _floatValue <= maxValue;
            }

            valid = isInRange;
          } else {
            valid = false;
          }

          break;

        default:
          valid = true;
      }

      if (valid) {
        this.setState(function () {
          return {
            currentValue: newValue
          };
        });
      }
    }
  }, {
    key: "onChangeDate",
    value: function onChangeDate(date) {
      if (date) {
        //  Remove Hours to fix bug with PT,CT
        date = (0, _moment["default"])(date).format('YYYY-MM-DD');
      }

      this.setState(function (prevState) {
        return {
          currentValue: date
        };
      });

      if (this.props.onUpdate) {
        this.props.onUpdate(date, this.resetValue);
      }
    }
  }, {
    key: "onBlur",
    value: function onBlur(e) {
      var finalValue = this.state.currentValue;
      var format = this.props.format;
      var type = typeof format === 'string' ? format : format.type;

      if ((type === 'number' || type === "currency") && (finalValue && finalValue.length === 0 || !finalValue)) {
        //  This is to prevent an emtpy value
        finalValue = 0;
      }

      if (finalValue !== this.state.previousValue) {
        //  Only update the value if it has changed.
        // this.setState(() => ({ previousValue: finalValue }));
        if (this.props.onUpdate) {
          this.props.onUpdate(finalValue, this.resetValue);
        }
      }

      if (type === 'textarea') {
        this.setState(function (prevState) {
          return {
            caretPos: 0,
            isTextAreaMultiLineActive: false
          };
        });
      }
    }
  }, {
    key: "onKeyDown",
    value: function onKeyDown(e) {
      var finalValue = this.state.currentValue;
      var format = this.props.format;
      var type = typeof format === 'string' ? format : format.type;

      if ((type === 'number' || type === "currency") && (finalValue && finalValue.length === 0 || !finalValue)) {
        //  This is to prevent an emtpy value
        finalValue = 0;
      }

      if (finalValue !== this.state.previousValue) {
        //  Only update the value if it has changed.
        // this.setState(() => ({ previousValue: finalValue }));
        if (this.props.onKeyDown) {
          this.props.onKeyDown(e, {
            value: finalValue,
            resetValue: this.resetValue
          });
        }
      }
    }
  }, {
    key: "onFocus",
    value: function onFocus(e) {
      var _this$props = this.props,
          format = _this$props.format,
          onFocus = _this$props.onFocus;
      var autoSelect = format.autoSelect;
      var type = typeof format === 'string' ? format : format.type;

      if (onFocus) {
        onFocus();
      }

      if (autoSelect) {
        e.target.select();
      }

      if (type === 'textarea') {
        // Set the current caret (cursor) position to textArea
        var currentCaretPosition = this.state.caretPos;
        e.target.setSelectionRange(currentCaretPosition, currentCaretPosition);
      }
    } // Gets the current caret (cursor) position

  }, {
    key: "onCreateTextArea",
    value: function onCreateTextArea(e) {
      var range = window.getSelection().getRangeAt(0);
      var target = e.target;
      range.setStart(target, 0);
      var setPoint = range.toString().length;
      this.setState(function (prevState) {
        return {
          caretPos: setPoint
        };
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$props2 = this.props,
          isFocused = _this$props2.isFocused,
          format = _this$props2.format,
          limit = _this$props2.limit,
          _this$props2$customPr = _this$props2.customProps,
          customProps = _this$props2$customPr === void 0 ? {} : _this$props2$customPr,
          _onPaste = _this$props2.onPaste,
          maxValue = _this$props2.maxValue,
          customColumnClass = _this$props2.customColumnClass;
      var _this$state = this.state,
          currentValue = _this$state.currentValue,
          isTextAreaMultiLineActive = _this$state.isTextAreaMultiLineActive;
      var type = typeof format === 'string' ? format : format.type;
      var decimals = typeof format === 'string' ? 2 : format.decimals;

      switch (type) {
        case "textarea":
          {
            if (isFocused) {
              return /*#__PURE__*/_react["default"].createElement(_reactTextareaAutosize["default"], {
                className: "InputField ".concat(customColumnClass),
                style: {
                  resize: 'none',
                  padding: 0
                },
                inputRef: function inputRef(input) {
                  _this3.input = input;
                },
                onKeyDown: function onKeyDown(e) {
                  _this3.onKeyDown(e);

                  if (_this3.props.onKeyDownHotKeys) {
                    _this3.props.onKeyDownHotKeys(e);

                    if (e.shiftKey && e.keyCode === _index.KEY_CODES.ENTER) {
                      _this3.setState(function (prevState) {
                        return {
                          isTextAreaMultiLineActive: true
                        };
                      });
                    } else if (!e.shiftKey && e.keyCode === _index.KEY_CODES.ENTER || !isTextAreaMultiLineActive && (e.keyCode === _index.KEY_CODES.ARROW_UP || e.keyCode === _index.KEY_CODES.ARROW_DOWN)) {
                      _this3.onBlur(e);
                    }
                  }

                  ;
                },
                type: "text",
                value: this.state.currentValue,
                onChange: this.onChange,
                onBlur: this.onBlur,
                maxLength: limit,
                onFocus: this.onFocus
              });
            } else {
              return /*#__PURE__*/_react["default"].createElement("p", {
                className: "Text ".concat(customColumnClass),
                onClick: function onClick(e) {
                  return _this3.onCreateTextArea(e);
                }
              }, this.state.currentValue);
            }
          }

        case "number":
          {
            return /*#__PURE__*/_react["default"].createElement("input", {
              ref: function ref(input) {
                _this3.input = input;
              },
              className: "InputField ".concat(customColumnClass),
              type: "text",
              value: this.state.currentValue,
              onChange: this.onChange,
              onBlur: this.onBlur,
              onKeyDown: function onKeyDown(e) {
                _this3.onKeyDown(e);

                if (_this3.props.onKeyDownHotKeys) _this3.props.onKeyDownHotKeys(e);
              },
              onPaste: function onPaste(e) {
                if (_onPaste) {
                  _onPaste(e);
                }
              },
              onFocus: this.onFocus
            });
          }

        case "progress-bar":
          {
            return /*#__PURE__*/_react["default"].createElement(_InputConfirm["default"], {
              value: this.state.currentValue,
              hide: !isFocused,
              onAccept: function onAccept(value) {
                _this3.onChange({
                  target: {
                    value: value
                  }
                });

                if (_this3.props.onUpdate) {
                  _this3.props.onUpdate(value, _this3.resetValue);
                }
              },
              onKeyUp: function onKeyUp(e) {
                if (_this3.props.onKeyUp) _this3.props.onKeyUp(e);
              },
              onKeyDown: function onKeyDown(e) {
                _this3.onKeyDown(e);

                if (_this3.props.onKeyDownHotKeys) _this3.props.onKeyDownHotKeys(e);
              },
              trigger: /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Progress, {
                progress: true,
                color: "blue",
                percent: this.state.currentValue,
                className: "InputField ".concat(customColumnClass)
              }),
              appearOnClick: true
            });
          }

        case "number-with-negative":
          {
            return /*#__PURE__*/_react["default"].createElement("input", {
              ref: function ref(input) {
                _this3.input = input;
              },
              className: "InputField ".concat(customColumnClass),
              type: "text",
              value: this.state.currentValue,
              onChange: this.onChange,
              onBlur: this.onBlur,
              onFocus: this.onFocus,
              onKeyDown: function onKeyDown(e) {
                _this3.onKeyDown(e);

                if (_this3.props.onKeyDownHotKeys) _this3.props.onKeyDownHotKeys(e);
              }
            });
          }

        case "currency":
          {
            return /*#__PURE__*/_react["default"].createElement(_react2["default"], {
              className: "InputField ".concat(customColumnClass),
              value: this.state.currentValue,
              htmlRef: function htmlRef(input) {
                _this3.input = input;
              },
              onChange: function onChange(e) {
                var value = e.target.rawValue;
                var isValid = true;

                if (maxValue != null) {
                  var floatValue = parseFloat(value);
                  isValid = floatValue <= maxValue;
                }

                if (isValid) {
                  _this3.setState(function (prevState) {
                    return {
                      currentValue: value
                    };
                  });
                }
              },
              onPaste: function onPaste(e) {
                if (_onPaste) {
                  _onPaste(e);
                }
              },
              onKeyDown: function onKeyDown(e) {
                _this3.onKeyDown(e);

                if (_this3.props.onKeyDownHotKeys) _this3.props.onKeyDownHotKeys(e);
              },
              onBlur: this.onBlur,
              onFocus: this.onFocus,
              options: {
                numeral: true,
                rawValueTrimPrefix: true,
                numeralDecimalScale: decimals,
                prefix: '$'
              }
            });
          }

        case "number-format":
          {
            return /*#__PURE__*/_react["default"].createElement(_reactNumberFormat["default"], _extends({
              getInputRef: function getInputRef(input) {
                _this3.input = input;
              },
              className: "InputField ".concat(customColumnClass),
              value: this.state.currentValue,
              onBlur: this.onBlur,
              onValueChange: function onValueChange(values) {
                var value = values.value; // formattedValue = $2,223
                // value ie, 2223

                _this3.setState(function (prevState) {
                  return {
                    currentValue: value
                  };
                });
              },
              onFocus: this.onFocus,
              thousandSeparator: true,
              onKeyDown: function onKeyDown(e) {
                _this3.onKeyDown(e);

                if (_this3.props.onKeyDownHotKeys) _this3.props.onKeyDownHotKeys(e);
              },
              onPaste: function onPaste(e) {
                if (_onPaste) {
                  _onPaste(e);
                }
              }
            }, format.options));
          }

        case "text":
          {
            return /*#__PURE__*/_react["default"].createElement("input", _extends({
              className: "InputField ".concat(customColumnClass),
              ref: function ref(input) {
                _this3.input = input;
              },
              type: "text",
              value: this.state.currentValue,
              onChange: this.onChange,
              onBlur: this.onBlur,
              maxLength: limit,
              onPaste: function onPaste(e) {
                if (_onPaste) {
                  _onPaste(e);
                }
              },
              onFocus: this.onFocus,
              onKeyDown: function onKeyDown(e) {
                _this3.onKeyDown(e);

                if (_this3.props.onKeyDownHotKeys) _this3.props.onKeyDownHotKeys(e);
              }
            }, customProps));
          }

        case "select":
          {
            var _this$props$format = this.props.format,
                options = _this$props$format.options,
                placeholder = _this$props$format.placeholder,
                defaultValue = _this$props$format.defaultValue;
            var value = this.state.currentValue;

            if (defaultValue != null && defaultValue !== '') {
              value = this.state.currentValue == null || this.state.currentValue === "" ? defaultValue : this.state.currentValue;
            }

            return /*#__PURE__*/_react["default"].createElement("select", {
              defaultValue: defaultValue,
              value: value,
              className: "InputField ".concat(customColumnClass),
              placeholder: placeholder,
              onChange: this.onChange,
              onBlur: this.onBlur,
              onFocus: this.onFocus
            }, options.map(function (_ref, index) {
              var value = _ref.value,
                  key = _ref.key,
                  text = _ref.text;
              return /*#__PURE__*/_react["default"].createElement("option", {
                value: value,
                key: key ? key : index
              }, text);
            }));
          }

        case "date":
          {
            var toDate = function toDate(date) {
              if (!date) return;
              var p = date.split('-');
              p = p.map(function (i) {
                return parseInt(i);
              });
              return new Date(p[0], p[1] - 1, p[2]);
            };

            var selected = currentValue;

            if (typeof currentValue == "string") {
              selected = toDate(selected);
            } else if (typeof currentValue == "number") {
              selected = new Date(selected);
            }

            return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_reactDatepicker["default"], _extends({
              className: "InputField ".concat(customColumnClass),
              showYearDropdown: true,
              customInput: /*#__PURE__*/_react["default"].createElement("input", null),
              selected: selected,
              onChange: this.onChangeDate,
              locale: _es["default"],
              placeholderText: "Selecciona una fecha",
              dateFormat: "d MMMM, yyyy",
              isClearable: true,
              onFocus: this.onFocus,
              onKeyDown: function onKeyDown(e) {
                _this3.onKeyDown(e);

                if (_this3.props.onKeyDownHotKeys) _this3.props.onKeyDownHotKeys(e);
              }
            }, customProps)));
          }

        case "boolean":
          {
            return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, this.state.currentValue ? /*#__PURE__*/_react["default"].createElement("div", {
              className: "InputField-Boolean ".concat(customColumnClass),
              onClick: function onClick() {
                _this3.props.onUpdate(!_this3.state.currentValue, _this3.resetValue);
              }
            }, /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Icon, {
              style: {
                margin: 'auto'
              },
              name: 'checkmark'
            })) : /*#__PURE__*/_react["default"].createElement("div", {
              className: "InputField-Boolean ".concat(customColumnClass),
              onClick: function onClick() {
                _this3.props.onUpdate(!_this3.state.currentValue, _this3.resetValue);
              }
            }));
          }

        default:
          break;
      }
    }
  }]);

  return InputField;
}(_react["default"].Component);

InputField.propTypes = {
  value: _propTypes["default"].any.isRequired,
  isFocused: _propTypes["default"].bool //onBlur: PropTypes.func.isRequired

};
InputField.defaultProps = {
  format: 'text'
};
var _default = InputField;
exports["default"] = _default;