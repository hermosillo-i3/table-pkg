"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _InputField = _interopRequireDefault(require("./InputField"));

var _semanticUiReact = require("semantic-ui-react");

var _reactFontawesome = require("@fortawesome/react-fontawesome");

var _freeSolidSvgIcons = require("@fortawesome/free-solid-svg-icons");

var _flow = _interopRequireDefault(require("lodash/flow"));

var _Constants = require("./Constants");

var _Utils = require("../../utils/Utils");

var _reactDnd = require("react-dnd");

var _column = require("../../utils/column");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

var RowTarget = {
  drop: function drop(props, monitor) {
    // Obtain the dragged item
    var item = monitor.getItem();

    if (props.onDrop) {
      props.onDrop(item, props.row);
    }
  },
  canDrop: function canDrop(props, monitor) {
    if (props.canDrop) {
      return props.canDrop(props, monitor);
    }

    return false;
  }
};
var RowSource = {
  canDrag: function canDrag(props, monitor) {
    if (props.canDrag) {
      return props.canDrag(props, monitor);
    }

    return false;
  },
  beginDrag: function beginDrag(props) {
    return {
      row: props.row,
      type: props.type
    };
  }
};

function collectTarget(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  };
}

function collectSource(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
    canDrag: monitor.canDrag()
  };
}

var getItemStyle = function getItemStyle(isDragging, draggableStyle) {
  return _objectSpread({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    // change background colour if dragging
    background: isDragging ? '#edf7ff' : '',
    borderLeft: isDragging ? '3px solid #1f76b7' : '',
    textAlign: isDragging ? 'left' : ''
  }, draggableStyle);
};

var Row = /*#__PURE__*/function (_React$Component) {
  _inherits(Row, _React$Component);

  var _super = _createSuper(Row);

  function Row(props) {
    var _this;

    _classCallCheck(this, Row);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "componentDidUpdate", function (prevProps, prevState) {
      var shouldScroll = _this.props.scrollTo === _this.props.row.id;

      if (_this.rowRef && shouldScroll && !_this.state.hasScrolled) {
        _this.rowRef.scrollIntoView();

        _this.setState(function (prevState) {
          return {
            hasScrolled: true
          };
        });
      }

      if (prevProps.scrollTo !== _this.props.scrollTo) {
        _this.setState(function (prevState) {
          return {
            hasScrolled: false
          };
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "formatColumn", function (format, value) {
      return (0, _Utils.formatColumn)(format, value);
    });

    _defineProperty(_assertThisInitialized(_this), "onRowClick", function (row) {
      return function (e) {
        e.preventDefault();

        _this.props.onRowClick(row);
      };
    });

    _defineProperty(_assertThisInitialized(_this), "onRowExpand", function (row) {
      if (_this.props.onRowExpand) {
        return function (e) {
          _this.props.onRowExpand(row);
        };
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onRowSelect", function (row) {
      if (_this.props.onRowSelect) {
        return function (e) {
          _this.props.onRowSelect(row, e.ctrlKey || e.metaKey);
        };
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onCellClick", function (column, row, colIndex, rowIndex, e) {
      e.target.addEventListener('copy', function (event) {
        var selection = document.getSelection();
        var value = selection.toString() !== "" ? selection.toString() : row[column.assesor];
        event.clipboardData.setData('text/plain', value);
        event.preventDefault();
      });

      if (_this.props.onCellClick) {
        _this.props.onCellClick(column, row, colIndex, rowIndex);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onCellDoubleClick", function (column, row, colIndex, rowIndex, e) {
      if (_this.props.onCellDoubleClick) {
        _this.props.onCellDoubleClick(column, row, colIndex, rowIndex);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onCellContextMenu", function (column, row, colIndex, rowIndex, e) {
      if (_this.props.onContextMenu) {
        if (column.filter) {
          e.preventDefault();

          _this.props.onContextMenu(e.pageX, e.pageY, [{
            name: 'Aplicar filtro con este valor',
            icon: 'filter',
            action: function action() {
              var _column$format;

              var filterFunc = _this.props.handleFilterColumn(column);

              var colFormat = (_column$format = column.format) !== null && _column$format !== void 0 ? _column$format : 'text';

              if (colFormat === 'text' || colFormat === 'textarea') {
                filterFunc(row[column.assesor]);
              } else if (colFormat === 'currency') {
                filterFunc({
                  max: null,
                  min: null,
                  equal: row[column.assesor]
                });
              }
            }
          }]);
        }
      }
    });

    _defineProperty(_assertThisInitialized(_this), "shouldRenderCell", function (column, row) {
      var isValueValid = typeof row[column.assesor] === "number" ? true : column.editable ? true : !!row[column.assesor];
      var shouldRender = false;

      if (column.onlyItems) {
        shouldRender = row.is_item;
      } else if (column.onlyHeaders) {
        shouldRender = !row.is_item;
      } else {
        shouldRender = true;
      }

      return !!isValueValid && shouldRender;
    });

    _defineProperty(_assertThisInitialized(_this), "getDefaultValue", function (format) {
      switch (format) {
        case 'text':
          return '';

        case 'number':
          return 0;

        case 'currency':
          return 0;

        case 'textarea':
          return '';

        default:
          return '';
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onFocus", function (colIndex) {
      if (_this.props.onFocus) _this.props.onFocus(_this.props.index, colIndex);
    });

    _defineProperty(_assertThisInitialized(_this), "renderCell", function (column, row, isCellActive, colIndex) {
      if (_this.shouldRenderCell(column, row)) {
        var value = row[column.assesor];
        var editable = column.editable;
        var format = (0, _Utils.isFunction)(column.format) ? column.format(row) : column.format;

        if (editable) {
          if (value == null) {
            value = _this.getDefaultValue(format);
          }

          var is_editable = (0, _column.isColumnEditable)(column, row);

          if (is_editable) {
            return /*#__PURE__*/_react["default"].createElement(_InputField["default"], {
              onFocus: function onFocus() {
                return _this.onFocus(colIndex);
              },
              isFocused: isCellActive,
              format: format,
              value: value,
              limit: column.limit,
              onKeyDown: function onKeyDown(e, _ref) {
                var value = _ref.value,
                    resetValue = _ref.resetValue;

                if (_this.props.onKeyDown) {
                  _this.props.onKeyDown(e, {
                    column: column,
                    row: row,
                    value: value,
                    resetValue: resetValue
                  });
                }
              },
              onKeyDownHotKeys: _this.props.onKeyDownHotKeys,
              onUpdate: _this.props.onUpdateRow ? function (value, resetValue) {
                _this.props.onUpdateRow(column, row, value, resetValue);
              } : undefined,
              onPaste: function onPaste(e) {
                if (_this.props.onPaste) {
                  _this.props.onPaste(e, column, row);
                }
              },
              customProps: column.customProps,
              customColumnClass: column.customColumnClass
            });
          } else {
            if (column.hasOwnProperty('format')) {
              if (format === 'boolean' && value) {
                return /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Icon, {
                  style: {
                    margin: 'auto'
                  },
                  name: 'checkmark'
                });
              }

              value = _this.formatColumn(format, value);
            }

            return /*#__PURE__*/_react["default"].createElement("div", {
              className: "left-align-flex value ".concat(column.customColumnClass)
            }, /*#__PURE__*/_react["default"].createElement("span", null, value));
          }
        } else {
          if (column.hasOwnProperty('format')) {
            if (format === 'boolean' && value) {
              return /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Icon, {
                style: {
                  margin: 'auto'
                },
                name: 'checkmark'
              });
            }

            value = _this.formatColumn(format, value);
          }

          return /*#__PURE__*/_react["default"].createElement("div", {
            className: "left-align-flex value ".concat(column.customColumnClass)
          }, /*#__PURE__*/_react["default"].createElement("span", null, value));
        }
      }
    });

    _this.state = {
      hasScrolled: false
    };
    return _this;
  }

  _createClass(Row, [{
    key: "render",
    value: function render() {
      var _this2 = this,
          _columns$;

      var _this$props = this.props,
          connectDragPreview = _this$props.connectDragPreview,
          connectDragSource = _this$props.connectDragSource,
          connectDropTarget = _this$props.connectDropTarget,
          isOver = _this$props.isOver,
          isDragging = _this$props.isDragging,
          canDrag = _this$props.canDrag,
          canDrop = _this$props.canDrop,
          _this$props$allowToDr = _this$props.allowToDragRows,
          allowToDragRows = _this$props$allowToDr === void 0 ? true : _this$props$allowToDr,
          rowIndex = _this$props.index,
          row = _this$props.row,
          is_open = _this$props.is_open,
          columns = _this$props.columns,
          depth = _this$props.depth,
          cellActive = _this$props.cellActive,
          customRowClass = _this$props.customRowClass,
          ignoreItemStyle = _this$props.ignoreItemStyle,
          expandCollapseColumnIndex = _this$props.expandCollapseColumnIndex,
          isDragColumnVisible = _this$props.isDragColumnVisible,
          styleTheme = _this$props.styleTheme;
      var hasChildren = row.hasOwnProperty('_children') && row._children.length > 0; //  Styles

      var className = "Table-Row";

      if (this.props.is_selected) {
        className += " Table-Row-Selected Table-Row--depth-".concat(depth, " ").concat(row.is_item ? 'Table-Row-Item' : '');
      } else {
        if (styleTheme) {
          if (styleTheme === 'striped') {
            // check if the number is odd
            if (rowIndex % 2 === 0) {
              className += rowIndex % 2 === 0 ? " Table-Row--striped" : '';
            }
          }
        } else {
          className += " Table-Row--depth-".concat(depth);
          className += ignoreItemStyle ? " Table-Row--depth-".concat(depth) : "".concat(row.is_item ? " Table-Row-Item depth-".concat(depth) : " Table-Row--depth-".concat(depth));
          className += isOver && canDrop ? ' Table-Row-Over' : '';
        }
      }

      if (customRowClass) {
        className += ' ' + customRowClass(row);
      }

      var cDP, cDS, cDT;

      if (!allowToDragRows) {
        cDP = function cDP(item) {
          return item;
        };

        cDS = function cDS(item) {
          return item;
        };

        cDT = function cDT(item) {
          return item;
        };
      } else {
        cDP = connectDragPreview;
        cDS = connectDragSource;
        cDT = connectDropTarget;
      }

      var scrollTo = function scrollTo(ref) {
        _this2.rowRef = ref;
      };

      return cDT(cDP( /*#__PURE__*/_react["default"].createElement("tr", {
        ref: scrollTo,
        className: className + ' tr_shaded',
        onClick: this.props.onRowClick ? this.onRowClick(row) : undefined,
        key: rowIndex,
        style: getItemStyle(isDragging, null)
      }, isDragColumnVisible && cDS( /*#__PURE__*/_react["default"].createElement("td", {
        className: "\n                  ".concat(canDrag ? ' drag-drop-td on-dragging-available' : 'not-drag-drop-row', "\n                  ").concat(columns && (_columns$ = columns[0]) !== null && _columns$ !== void 0 && _columns$.freeze ? 'freeze_horizontal' : '', "\n                  "),
        onClick: this.onRowSelect(row),
        style: {
          width: 25,
          flex: "25 0 auto",
          maxWidth: 25,
          cursor: canDrag ? 'grab' : 'default'
        }
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "middle-align-flex"
      }, /*#__PURE__*/_react["default"].createElement("span", {
        className: "drag-drop-icon"
      }, /*#__PURE__*/_react["default"].createElement(_reactFontawesome.FontAwesomeIcon, {
        icon: _freeSolidSvgIcons.faGripVertical,
        size: "1x"
      }))))), columns.map(function (col, colIndex) {
        var is_editable = col.editable;

        if (is_editable) {
          is_editable = (0, _column.isColumnEditable)(col, row);
        }

        var readOnlyClass = !is_editable ? 'cell-read-only' : '';
        return col.Cell ? /*#__PURE__*/_react["default"].createElement("td", {
          onClick: function onClick(e) {
            return _this2.onCellClick(col, row, colIndex, rowIndex, e);
          },
          onDoubleClick: function onDoubleClick(e) {
            return _this2.onCellDoubleClick(col, row, colIndex, rowIndex, e);
          },
          onContextMenu: function onContextMenu(e) {
            return _this2.onCellContextMenu(col, row, colIndex, rowIndex, e);
          },
          key: colIndex,
          style: {
            width: col.width,
            flex: "".concat(col.width, " 0 auto"),
            maxWidth: col.width,
            overflow: col.overflow ? col.overflow : 'inherit'
          },
          className: "cell ".concat(cellActive === colIndex ? 'cell-active' : '', " ").concat(col.onDraggingVisible ? "on-dragging-available dragging-td-value" : "", " ").concat(col.freeze ? 'fixed freeze_horizontal' : '')
        }, /*#__PURE__*/_react["default"].createElement("div", {
          className: "flex ".concat(colIndex === expandCollapseColumnIndex && hasChildren ? "expand-column" : "", " ").concat(readOnlyClass)
        }, !row.is_item && colIndex === expandCollapseColumnIndex && /*#__PURE__*/_react["default"].createElement("div", {
          className: "Table-Column-".concat(is_open ? 'Expanded' : 'Contracted'),
          onClick: _this2.onRowExpand(row)
        }, hasChildren && (is_open ? /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Icon, {
          className: "icon-collapse",
          disabled: true,
          name: "minus square outline"
        }) : /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Icon, {
          className: "icon-expand",
          disabled: true,
          name: "plus square outline"
        }))), /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, col.Cell(row)))) : /*#__PURE__*/_react["default"].createElement("td", {
          onClick: function onClick(e) {
            return _this2.onCellClick(col, row, colIndex, rowIndex, e);
          },
          onDoubleClick: function onDoubleClick(e) {
            return _this2.onCellDoubleClick(col, row, colIndex, rowIndex, e);
          },
          onContextMenu: function onContextMenu(e) {
            return _this2.onCellContextMenu(col, row, colIndex, rowIndex, e);
          },
          key: colIndex,
          style: {
            width: col.width,
            flex: "".concat(col.width, " 0 auto"),
            maxWidth: col.width,
            overflow: col.overflow ? col.overflow : 'inherit'
          },
          className: "cell ".concat(cellActive === colIndex ? 'cell-active' : '', " ").concat(col.onDraggingVisible ? "on-dragging-available dragging-td-value" : "", " ").concat(col.freeze ? 'fixed freeze_horizontal' : '')
        }, /*#__PURE__*/_react["default"].createElement("div", {
          className: "flex ".concat(readOnlyClass, " ").concat(colIndex === expandCollapseColumnIndex && hasChildren ? "expand-column" : "")
        }, !row.is_item && colIndex === expandCollapseColumnIndex && /*#__PURE__*/_react["default"].createElement("div", {
          className: "Table-Column-".concat(is_open ? 'Expanded' : 'Contracted'),
          onClick: _this2.onRowExpand(row)
        }, hasChildren && (is_open ? /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Icon, {
          className: "icon-collapse",
          disabled: true,
          name: "minus square outline"
        }) : /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Icon, {
          className: "icon-expand",
          disabled: true,
          name: "plus square outline"
        }))), _this2.renderCell(col, row, cellActive === colIndex, colIndex)));
      }))));
    }
  }]);

  return Row;
}(_react["default"].Component);

var component = (0, _flow["default"])((0, _reactDnd.DragSource)(_Constants.ItemTypes.ROW, RowSource, collectSource), (0, _reactDnd.DropTarget)(_Constants.ItemTypes.ROW, RowTarget, collectTarget))(Row);
var _default = component;
exports["default"] = _default;