"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _semanticUiReact = require("semantic-ui-react");

var _reactFontawesome = require("@fortawesome/react-fontawesome");

var _reactSelect = _interopRequireDefault(require("react-select"));

var _ModalForm = _interopRequireDefault(require("./ModalForm"));

var _reactCsv = require("react-csv");

var _Utils = require("../../utils/Utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var styles = {
  groupActions: {
    container: {
      display: 'inline-block',
      border: '1px solid #e8e8e8',
      borderRadius: '5px',
      marginRight: '1rem'
    },
    header: {
      fontSize: '0.7rem',
      marginLeft: '5px',
      fontWeight: 500,
      position: 'absolute',
      top: '1px',
      background: 'white',
      padding: '0 .833em',
      borderRadius: '.28571429rem'
    }
  }
};

var getHeaderText = function getHeaderText(col) {
  if (typeof col.Header === 'string') {
    return col.Header;
  } else {
    var _col$HeaderRaw;

    return (_col$HeaderRaw = col.HeaderRaw) !== null && _col$HeaderRaw !== void 0 ? _col$HeaderRaw : '';
  }
};

var userConfigurationSelectStyles = {
  option: function option(styles, _ref) {
    var data = _ref.data;
    return _objectSpread(_objectSpread({}, styles), {}, {
      color: data.color != null ? data.color : styles.color,
      cursor: data.cursor != null ? data.cursor : 'default'
    });
  }
};

var Toolbar = /*#__PURE__*/function (_React$Component) {
  _inherits(Toolbar, _React$Component);

  var _super = _createSuper(Toolbar);

  function Toolbar(props) {
    var _this;

    _classCallCheck(this, Toolbar);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "handleChangeProfile", function (data) {
      var value = data.value;
      var onChangeProfile = _this.props.onChangeProfile;

      if (value === -1) {
        _this.setState({
          is_create_profile_modal_open: true
        });
      } else if (onChangeProfile) {
        onChangeProfile(value);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleCreateProfileCloseModal", function () {
      _this.setState({
        is_create_profile_modal_open: false
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleCreateProfile", function (values) {
      if (_this.props.onCreateProfile) _this.props.onCreateProfile(values, _this.handleCreateProfileCloseModal);
    });

    _defineProperty(_assertThisInitialized(_this), "getExcelRows", function () {
      var _this$props$rows;

      return (0, _Utils.convertTreeStructureToFlatArray)((_this$props$rows = _this.props.rows) !== null && _this$props$rows !== void 0 ? _this$props$rows : [], 'subrows');
    });

    _this.state = {
      is_create_profile_modal_open: false
    };
    return _this;
  }

  _createClass(Toolbar, [{
    key: "render",
    value: function render() {
      var _this$props$columns$r,
          _this$props$columns,
          _this2 = this;

      var props = this.props,
          state = this.state;
      var is_create_profile_modal_open = state.is_create_profile_modal_open;
      var shouldRenderDefaultActions = props.shouldRenderDefaultActions,
          _props$enableProfileC = props.enableProfileConfiguration,
          enableProfileConfiguration = _props$enableProfileC === void 0 ? false : _props$enableProfileC,
          _props$profiles = props.profiles,
          profiles = _props$profiles === void 0 ? [] : _props$profiles,
          profileSelected = props.profileSelected,
          _props$allowToDownloa = props.allowToDownloadCVS,
          allowToDownloadCVS = _props$allowToDownloa === void 0 ? false : _props$allowToDownloa;
      var allowToOpenSettings = props.allowToOpenSettings === undefined ? true : props.allowToOpenSettings;
      var icon_size = 'large';
      var button_style = {
        paddingTop: '.2rem',
        paddingBottom: '.2rem',
        boxShadow: 'none'
      };
      var optionsProfiles = [].concat(_toConsumableArray(profiles.map(function (e) {
        return {
          value: e.id,
          label: e.name
        };
      })), [{
        value: -1,
        label: 'Crear nuevo perfil...',
        color: '#2185d0',
        cursor: 'copy'
      }]);
      var profileSelectedOption = optionsProfiles.find(function (e) {
        return e.value === profileSelected;
      });

      if (profileSelectedOption === undefined) {
        profileSelectedOption = null;
      }

      var left_actions = [],
          right_actions = []; //  Separete actions

      for (var index = 0; index < props.actions.length; index++) {
        var action = props.actions[index];

        if (action.position === 'right') {
          right_actions.push(action);
        } else {
          left_actions.push(action);
        }
      } //  Get styles


      var left_actions_style = {
        flex: "1",
        alignItems: 'flex-start',
        display: 'flex'
      };
      var right_actions_style = {
        flex: "1",
        justifyContent: 'flex-end',
        display: 'flex'
      };

      var renderButton = function renderButton(item) {
        if (item.actions != null) {
          var styleHeader = _objectSpread({}, styles.groupActions.header);

          if (item.color) {
            styleHeader.color = item.color;
          }

          if (item.backgroundColor) {
            styleHeader.backgroundColor = item.backgroundColor;
          }

          return /*#__PURE__*/_react["default"].createElement("div", {
            style: styles.groupActions.container,
            key: item.name
          }, /*#__PURE__*/_react["default"].createElement("span", {
            style: styleHeader
          }, item.name), /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Button.Group, null, item.actions.map(function (e) {
            return renderButton(e);
          })));
        }

        if (item.custom_button) return /*#__PURE__*/_react["default"].cloneElement(item.custom_button(), {
          key: item.name
        });else return /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Popup, {
          key: item.name,
          trigger: /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Button, {
            basic: true,
            style: button_style,
            icon: item.icon !== undefined,
            size: item.icon ? "large" : "small",
            active: item.active,
            onClick: item.action,
            loading: item.loading,
            disabled: item.disabled,
            type: "button"
          }, item.icon === undefined && item.fasicon === undefined && item.name, item.subIcon ? /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Icon.Group, null, /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Icon, {
            name: item.icon,
            rotated: item.iconRotation
          }), /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Icon, {
            corner: item.subIconPosition ? item.subIconPosition : 'top right',
            name: item.subIcon
          })) : item.fasicon ? /*#__PURE__*/_react["default"].createElement(_reactFontawesome.FontAwesomeIcon, {
            icon: item.fasicon
          }) : /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Icon, {
            name: item.icon,
            rotated: item.iconRotation
          })),
          content: item.name,
          inverted: true
        });
      };

      var renderExpandRowsButton = function renderExpandRowsButton() {
        if (props.expandElements && props.expandElements.displayButton) {
          // Check if the button needs to be displayed
          if (!props.expandElements.isRowSelected) {
            // Display the button to expand all the header rows.
            return /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Popup, {
              trigger: /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Button, {
                style: button_style,
                size: icon_size,
                icon: "angle double down",
                basic: true,
                onClick: props.expandElements.action,
                type: "button"
              }),
              content: "Expandir todos los elementos",
              inverted: true
            });
          } else {
            if (props.expandElements.isRowHeaderSelected) {
              // Display the button to expand only the header rows selected.
              return /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Popup, {
                trigger: /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Button, {
                  style: button_style,
                  size: icon_size,
                  icon: "angle down",
                  basic: true,
                  onClick: props.expandElements.action,
                  type: "button"
                }),
                content: "Expandir elementos seleccionados",
                inverted: true
              });
            }
          }
        }
      };

      var renderCollapseRowsButton = function renderCollapseRowsButton() {
        if (props.collapseElements && props.collapseElements.displayButton) {
          // Check if the button needs to be displayed
          if (!props.collapseElements.isRowSelected) {
            // Display the button to collapse all the header rows.
            return /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Popup, {
              trigger: /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Button, {
                style: button_style,
                size: icon_size,
                icon: "angle double up",
                basic: true,
                onClick: props.collapseElements.action,
                type: "button"
              }),
              content: "Contraer todos los elementos",
              inverted: true
            });
          } else {
            if (props.collapseElements.isRowHeaderSelected) {
              // Display the button to collapse only the header rows selected.
              return /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Popup, {
                trigger: /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Button, {
                  style: button_style,
                  size: icon_size,
                  icon: "angle up",
                  basic: true,
                  onClick: props.collapseElements.action,
                  type: "button"
                }),
                content: "Contraer elementos seleccionados",
                inverted: true
              });
            }
          }
        }
      };

      var excelHeaders = (_this$props$columns$r = (_this$props$columns = this.props.columns) === null || _this$props$columns === void 0 ? void 0 : _this$props$columns.reduce(function (acum, col) {
        if (col.columns) {
          return [].concat(_toConsumableArray(acum), _toConsumableArray(col.columns.map(function (c) {
            return {
              label: "".concat(getHeaderText(col), "-").concat(getHeaderText(c)),
              key: c.assesor
            };
          })));
        } else {
          return [].concat(_toConsumableArray(acum), [{
            label: getHeaderText(col),
            key: col.assesor
          }]);
        }
      }, [])) !== null && _this$props$columns$r !== void 0 ? _this$props$columns$r : [];
      var excelRows = this.getExcelRows();
      return /*#__PURE__*/_react["default"].createElement("div", {
        style: this.props.style
      }, (left_actions.length > 0 || shouldRenderDefaultActions) && /*#__PURE__*/_react["default"].createElement("div", {
        style: left_actions_style,
        className: "left-actions"
      }, /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Button.Group, {
        style: {
          height: '100%'
        }
      }, left_actions.map(function (item, index) {
        return renderButton(item, index);
      }), shouldRenderDefaultActions && renderExpandRowsButton(), shouldRenderDefaultActions && renderCollapseRowsButton())), /*#__PURE__*/_react["default"].createElement("div", {
        style: right_actions_style,
        className: "right-actions"
      }, /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Button.Group, null, right_actions.map(function (item, index) {
        return renderButton(item, index);
      }), enableProfileConfiguration && /*#__PURE__*/_react["default"].createElement("div", {
        className: "react-select",
        style: {
          width: '200px',
          height: '100%'
        }
      }, /*#__PURE__*/_react["default"].createElement(_reactSelect["default"], {
        value: profileSelectedOption,
        options: optionsProfiles,
        placeholder: "Seleccione un perfil",
        styles: userConfigurationSelectStyles,
        onChange: this.handleChangeProfile
      })), allowToDownloadCVS && /*#__PURE__*/_react["default"].createElement(_reactCsv.CSVLink, {
        filename: "data.csv",
        data: excelRows,
        headers: excelHeaders
      }, /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Popup, {
        trigger: /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Button, {
          style: button_style,
          size: icon_size,
          icon: "download",
          basic: true,
          type: "button"
        }),
        content: "Exportar a Excel",
        inverted: true
      })), allowToOpenSettings && /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Popup, {
        trigger: /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Button, {
          style: button_style,
          size: icon_size,
          icon: "setting",
          basic: true,
          onClick: props.openSettings,
          type: "button"
        }),
        content: "Configuraci\xF3n",
        inverted: true
      }))), /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Modal, {
        className: "",
        open: is_create_profile_modal_open,
        onClose: function onClose() {
          return _this2.setState({
            is_create_profile_modal_open: false
          });
        }
      }, /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Modal.Header, null, "Crear nuevo perfil"), /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Modal.Content, null, /*#__PURE__*/_react["default"].createElement(_ModalForm["default"], {
        initialValues: {},
        fields: [{
          label: 'Nombre',
          name: 'name'
        }],
        onSubmit: this.handleCreateProfile
      }))));
    }
  }]);

  return Toolbar;
}(_react["default"].Component);

exports["default"] = Toolbar;