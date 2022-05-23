"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _semanticUiReact = require("semantic-ui-react");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _column = require("../../utils/column");

var _index = require("../../utils/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var Settings = function Settings(props) {
  var profile = props.profile;
  var columnsFromGroups = {}; // Flat columns to get one list of all columns including the nested columns

  var flatColumns = props.columns.reduce(function (accum, e) {
    accum.push(e);

    if (e.columns) {
      accum.push.apply(accum, _toConsumableArray(e.columns));
      e.columns.forEach(function (column) {
        columnsFromGroups = _objectSpread(_objectSpread({}, columnsFromGroups), {}, _defineProperty({}, column.key, _objectSpread(_objectSpread({}, column), {}, {
          'parent_column_key': e.key
        })));
      });
    }

    return accum;
  }, []);
  var widthState = (0, _index.convertArrayToObjectV2)(flatColumns, 'key');

  var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      isConfirmDeleteOpen = _useState2[0],
      setIsConfirmDeleteOpen = _useState2[1];

  var _useState3 = (0, _react.useState)(profile ? profile.name : ''),
      _useState4 = _slicedToArray(_useState3, 2),
      name = _useState4[0],
      setName = _useState4[1];

  var _useState5 = (0, _react.useState)(widthState),
      _useState6 = _slicedToArray(_useState5, 2),
      columns = _useState6[0],
      setColumns = _useState6[1];

  (0, _react.useEffect)(function () {
    setName(profile ? profile.name : '');
  }, [profile]);
  (0, _react.useEffect)(function () {
    var columnsFromGroups = {};
    var flatColumns = props.columns.reduce(function (accum, e) {
      accum.push(e);

      if (e.columns) {
        accum.push.apply(accum, _toConsumableArray(e.columns));
        e.columns.forEach(function (column) {
          columnsFromGroups = _objectSpread(_objectSpread({}, columnsFromGroups), {}, _defineProperty({}, column.key, _objectSpread(_objectSpread({}, column), {}, {
            'parent_column_key': e.key
          })));
        });
      }

      return accum;
    }, []);
    var widthState = (0, _index.convertArrayToObjectV2)(flatColumns, 'key');
    setColumns(widthState);
  }, [props.columns]);

  var changeWidth = function changeWidth(assesor) {
    return function (e) {
      var value = e.target.value;

      if (value.length > 0) {
        if (isNaN(value)) {
          value = 0;
        } else {
          value = parseInt(value);
        }
      }

      columns[assesor].width = value;
      columns[assesor].is_width_calculate = false;
      setColumns(_objectSpread({}, columns));
    };
  };

  var handleChangeAutoWidth = function handleChangeAutoWidth(assesor) {
    return function (e) {
      columns[assesor].is_width_calculate = !columns[assesor].is_width_calculate;
      setColumns(_objectSpread({}, columns));
    };
  };

  var handleChangeFreeze = function handleChangeFreeze(assesor) {
    return function (e) {
      var indexOfCurrentAssesor = flatColumns.findIndex(function (column) {
        return column.key === assesor;
      }); // Check the subsequent columns freeze property (Only when current freeze property is true)

      if (Object.prototype.hasOwnProperty.call(columns[assesor], 'freeze') && columns[assesor].freeze === true) {
        flatColumns = flatColumns.map(function (column) {
          // flatColumns is updated in case that is queried and the state 'columns' has not yet been updated.  
          return _objectSpread({}, columns[column.key]);
        });
        var existsAFreezeColumnAfterCurrentOne = flatColumns.slice(indexOfCurrentAssesor + 1).findIndex(function (column) {
          return Object.prototype.hasOwnProperty.call(column, 'freeze') && column.freeze === true;
        }) !== -1 ? true : false; // If there is a freeze column after the current one, it will be deactivated.

        if (existsAFreezeColumnAfterCurrentOne) {
          for (var i = indexOfCurrentAssesor + 1; i < flatColumns.length; i++) {
            columns[flatColumns[i].key].freeze = false;
          }
        }
      } // Check the previous columns freeze property (Only when current freeze property is false)


      if (indexOfCurrentAssesor > 0 && (!Object.prototype.hasOwnProperty.call(columns[assesor], 'freeze') || columns[assesor].freeze === false)) {
        // It will activate the precious columns freeze property.
        for (var _i2 = 0; _i2 < indexOfCurrentAssesor; _i2++) {
          columns[flatColumns[_i2].key].freeze = true;
        }
      } // Apply freeze property to current column


      columns[assesor].freeze = !columns[assesor].freeze; // Activate the children columns if current column is a parent of a group of columns and it is been activated

      if (columns[assesor].columns && columns[assesor].freeze) {
        var childrenColumns = columns[assesor].columns;
        childrenColumns.forEach(function (column) {
          columns[column.assesor].freeze = true;
        });
      } // Freeze properties are applied to columns


      setColumns(_objectSpread({}, columns));
    };
  };

  var checkValidValues = function checkValidValues() {
    return Object.keys(columns).reduce(function (acum, colkey) {
      return acum && typeof columns[colkey] != 'string';
    }, true);
  };

  var onClose = function onClose() {
    if (checkValidValues()) {
      props.onSubmit({
        name: name,
        columns: columns
      });
    }

    props.onClose();
  };

  var handleToggleColumn = function handleToggleColumn(key) {
    columns[key].is_visible = !columns[key].is_visible;
    setColumns(_objectSpread({}, columns));
  };

  var handleChangeName = function handleChangeName(e) {
    setName(e.target.value);
  };

  var renderColumns = function renderColumns(columns) {
    var columnsKeys = Object.keys(columns);
    return columnsKeys.map(function (key) {
      return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, {
        key: key
      }, /*#__PURE__*/_react["default"].createElement(Column, {
        data: columns[key],
        changeWidth: changeWidth,
        toggleColumn: handleToggleColumn,
        onChangeAutoWidth: handleChangeAutoWidth,
        onChangeFreeze: handleChangeFreeze,
        columnsFromGroups: columnsFromGroups
      }));
    });
  };

  var handleCancelDelete = function handleCancelDelete() {
    setIsConfirmDeleteOpen(false);
  };

  var handleConfirmDelete = function handleConfirmDelete() {
    if (props.onConfirmDelete) {
      props.onConfirmDelete(profile.id);
      setIsConfirmDeleteOpen(false);
    }
  };

  var handleDelete = function handleDelete() {
    setIsConfirmDeleteOpen(true);
  };

  var isFromProfile = profile != null;
  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Modal, {
    className: "modal-table-settings",
    open: props.isOpen,
    onClose: props.onClose,
    closeOnDimmerClick: false
  }, /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Modal.Header, null, isFromProfile ? /*#__PURE__*/_react["default"].createElement("div", {
    className: "header-table-settings"
  }, /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Input, {
    onChange: handleChangeName,
    value: name,
    className: "input-table-settings"
  }), /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Icon, {
    name: "trash",
    onClick: handleDelete
  })) : "Predeterminado"), /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Modal.Content, null, /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Table, {
    celled: true
  }, /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Table.Header, null, /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Table.Row, null, /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Table.HeaderCell, null, "Columna"), /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Table.HeaderCell, null, "Mostrar/Ocultar"), /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Table.HeaderCell, null, "Ancho de la celda"), /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Table.HeaderCell, null, "Ancho automatico"), /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Table.HeaderCell, null, "Congelar celda"))), /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Table.Body, null, renderColumns(columns)), /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Table.Footer, {
    fullWidth: true
  }, /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Table.Row, null, /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Table.HeaderCell, {
    colSpan: "5"
  }, /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Button, {
    fluid: true,
    onClick: onClose
  }, "OK"))))))), isFromProfile && /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Confirm, {
    open: isConfirmDeleteOpen,
    confirmButton: "Confirmar",
    cancelButton: "Cancelar",
    header: "\xBFEst\xE1s seguro?",
    onCancel: handleCancelDelete,
    onConfirm: handleConfirmDelete
  }));
};

var Column = function Column(_ref) {
  var data = _ref.data,
      changeWidth = _ref.changeWidth,
      toggleColumn = _ref.toggleColumn,
      onChangeAutoWidth = _ref.onChangeAutoWidth,
      onChangeFreeze = _ref.onChangeFreeze,
      columnsFromGroups = _ref.columnsFromGroups;
  var description = data.Header;

  if (typeof data.Header !== 'string') {
    description = data.description;
  }

  var key = (0, _column.getColumnKey)(data);
  return /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Table.Row, null, /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Table.Cell, null, description), /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Table.Cell, {
    style: {
      cursor: 'pointer'
    },
    onClick: function onClick() {
      return toggleColumn(key);
    }
  }, data.is_visible ? '✓' : 'X'), data.columns == null ? /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Table.Cell, null, /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Input, {
    fluid: true,
    onChange: changeWidth(key),
    value: data.width,
    disabled: data.is_width_calculate
  })) : /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Table.Cell, null), data.columns == null ? /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Table.Cell, {
    collapsing: true
  }, /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Checkbox, {
    fluid: "true",
    onChange: onChangeAutoWidth(key),
    checked: data.is_width_calculate
  })) : /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Table.Cell, null), columnsFromGroups[data.assesor] == null ? /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Table.Cell, {
    collapsing: true
  }, /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Checkbox, {
    fluid: "true",
    onChange: onChangeFreeze(key),
    checked: data.freeze
  })) : /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Table.Cell, null));
};

Settings.propTypes = {
  columns: _propTypes["default"].array,
  onClose: _propTypes["default"].func,
  toggleColumn: _propTypes["default"].func,
  onSubmit: _propTypes["default"].func,
  isColumnVisible: _propTypes["default"].func
};
var _default = Settings;
exports["default"] = _default;