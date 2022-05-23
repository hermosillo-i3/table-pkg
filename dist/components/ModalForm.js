"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _formik = require("formik");

var _InputForm = _interopRequireDefault(require("./InputForm"));

var _semanticUiReact = require("semantic-ui-react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ModalForm = function ModalForm(props) {
  var _props$onSubmitButton = props.onSubmitButtonText,
      onSubmitButtonText = _props$onSubmitButton === void 0 ? 'Guardar' : _props$onSubmitButton;
  return /*#__PURE__*/_react["default"].createElement(_formik.Formik, {
    className: "modal-form",
    initialValues: props.initialValues ? _objectSpread({}, props.initialValues) : {},
    onSubmit: function onSubmit(values, _ref) {
      var setSubmitting = _ref.setSubmitting;

      if (props.onSubmit) {
        props.onSubmit(values, setSubmitting);
      } else {
        setSubmitting(false);
      }
    }
  }, function (_ref2) {
    var isSubmitting = _ref2.isSubmitting;
    return /*#__PURE__*/_react["default"].createElement(_formik.Form, {
      className: "ui form modal-form"
    }, /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Dimmer, {
      active: isSubmitting,
      inverted: true
    }, /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Loader, {
      inverted: true
    }, "Cargando")), props.fields.map(function (e) {
      if (e.pop_up) {
        return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Popup, {
          key: e.name,
          trigger: /*#__PURE__*/_react["default"].createElement(_formik.Field, _extends({
            key: e.name,
            component: _InputForm["default"]
          }, e)),
          content: e.pop_up.content,
          on: e.pop_up.on,
          position: e.pop_up.position,
          size: e.pop_up.size,
          wide: e.pop_up.wide
        }));
      }

      return /*#__PURE__*/_react["default"].createElement(_formik.Field, _extends({
        key: e.name,
        component: _InputForm["default"]
      }, e));
    }), props.children, /*#__PURE__*/_react["default"].createElement("div", {
      className: "text-right bottom-action-form"
    }, /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Button, {
      color: "green",
      type: "submit"
    }, onSubmitButtonText)));
  });
};

ModalForm.propTypes = {
  initialValues: _propTypes["default"].object,
  fields: _propTypes["default"].array,
  onSubmit: _propTypes["default"].func
};
var _default = ModalForm;
exports["default"] = _default;