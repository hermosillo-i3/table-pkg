"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _semanticUiReact = require("semantic-ui-react");

var _reactHotkeys = require("react-hotkeys");

var _uuid = require("uuid");

var _Row = _interopRequireDefault(require("./Row"));

var _Settings = _interopRequireDefault(require("./Settings"));

var _NoRowsCard = _interopRequireDefault(require("./NoRowsCard"));

var _Header = _interopRequireDefault(require("./Header"));

var _DropZone = _interopRequireDefault(require("./DropZone"));

var _FilterColumn = _interopRequireDefault(require("./FilterColumn"));

var _ContextMenu = _interopRequireDefault(require("./ContextMenu"));

var _Utils = require("../../utils/Utils");

var _index = require("../../utils/index");

var _column = require("../../utils/column");

require("./styles/Table.scss");

require("./styles/Dnd.scss");

require("./styles/Toolbar.scss");

require("./styles/EmptyStateCard.scss");

var _tableUtils = require("../../utils/table-utils");

var _withDndContext = _interopRequireDefault(require("with-dnd-context"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

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

(0, _reactHotkeys.configure)({
  ignoreTags: [],
  allowCombinationSubmatches: true
});
var keyMap = {
  MOVE_UP: "up",
  MOVE_DOWN: ['down', 'enter'],
  CREATE_NEW: 'command+enter'
};
var KEY_EVENT = {
  38: 'MOVE_UP',
  40: 'MOVE_DOWN',
  13: 'MOVE_DOWN'
};

var generateRowsToExpand = function generateRowsToExpand(expandRows) {
  // Construct the object to expand the rows
  return expandRows.reduce(function (acum, row_id) {
    return _objectSpread(_objectSpread({}, acum), {}, _defineProperty({}, row_id, {
      is_open: true,
      should_render: true
    }));
  }, {});
};

var Table = /*#__PURE__*/function (_React$Component) {
  _inherits(Table, _React$Component);

  var _super = _createSuper(Table);

  function Table(props) {
    var _this;

    _classCallCheck(this, Table);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "keyBoardHandlers", {
      MOVE_UP: function MOVE_UP(event) {
        event.preventDefault();

        if (_this.state.cellActive.row - 1 >= 1) {
          _this.keyboardKeyHandleMove(-1);
        }
      },
      MOVE_DOWN: function MOVE_DOWN(event) {
        if (!(event.shiftKey && event.keyCode === 13)) {
          event.preventDefault();

          if (_this.state.cellActive.row <= _this.state.rendered_rows.length - 1) {
            _this.keyboardKeyHandleMove(1);
          }
        }
      },
      CREATE_NEW: function CREATE_NEW(event) {
        event.preventDefault();
        if (_this.props.onAddNew) _this.props.onAddNew(_this.state.cellActive.row_id);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onKeyDown", function () {
      if (_this.props.onKeyDown) {
        var _this$props;

        (_this$props = _this.props).onKeyDown.apply(_this$props, arguments);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onKeyDownHotKeys", function (e) {
      if (e.target.type === 'textarea') {
        if (!e.shiftKey && e.keyCode === _index.KEY_CODES.ENTER) {
          e.preventDefault();

          _this.keyboardKeyHandleMove(1);

          e.stopPropagation();
        }
      } else if (e.keyCode === _index.KEY_CODES.ARROW_UP || e.keyCode === _index.KEY_CODES.ARROW_DOWN || e.keyCode === _index.KEY_CODES.ENTER) {
        _this.keyBoardHandlers[KEY_EVENT[e.keyCode]](e);

        e.stopPropagation();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "keyboardKeyHandleMove", function (movePosition) {
      var rows = _this.props.rows;
      var _this$state = _this.state,
          rendered_rows = _this$state.rendered_rows,
          cellActive = _this$state.cellActive;
      var minRows = 0;
      var maxRows = rendered_rows.length;
      var cell = cellActive.cell,
          rowPosition = cellActive.row;
      var newRowIndex = rowPosition - 1;
      var newMovePosition = 0;

      var columns = _this.getVisibleColumns();

      var column = columns[cell];
      var is_editable = false;

      do {
        newRowIndex = newRowIndex + movePosition;
        newMovePosition = newMovePosition + movePosition;
        var rowId = rendered_rows[newRowIndex];
        var row = rows[rowId];
        is_editable = (0, _column.isColumnEditable)(column, row);
      } while (!is_editable && newRowIndex >= minRows && newRowIndex < maxRows);

      if (newRowIndex >= minRows && newRowIndex < maxRows) {
        _this.moveToRow(newMovePosition);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onFocusRow", function (rowIndex, cellIndex) {
      if (_this.state.cellActive.row !== rowIndex || _this.state.cellActive.cell !== cellIndex) {
        _this.setState(function (state) {
          return _objectSpread(_objectSpread({}, state), {}, {
            cellActive: _objectSpread(_objectSpread({}, state.cellActive), {}, {
              row: rowIndex,
              cell: cellIndex
            })
          });
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "moveToRow", function (movePosition) {
      _this.setState(function (state) {
        return _objectSpread(_objectSpread({}, state), {}, {
          cellActive: _objectSpread(_objectSpread({}, state.cellActive), {}, {
            row: state.cellActive.row + movePosition
          })
        });
      });
    });

    _defineProperty(_assertThisInitialized(_this), "shouldComponentUpdate", function (nextProps, nextState) {
      // const checkChange = (olds, news) => {
      //    Object.keys(olds).map((key) => {
      //       if (JSON.stringify(olds[key]) != JSON.stringify(news[key])) {
      //          console.log(`---${key}---`);
      //          console.log(olds[key]);
      //          console.log(news[key])
      //       }
      //    })
      // };
      // console.log(`----------------${this.props.type}-------------------`)
      // checkChange(this.props, nextProps)
      if (nextState.profile_selected !== _this.state.profile_selected) return true;

      if (JSON.stringify(_this.props.profiles) !== JSON.stringify(nextProps.profiles)) {
        return true;
      }

      if (JSON.stringify(_this.props.rows) !== JSON.stringify(nextProps.rows)) {
        return true;
      }

      if (_this.props.type !== nextProps.type) {
        return true;
      }

      if (JSON.stringify(_this.props.columns) !== JSON.stringify(nextProps.columns)) {
        return true;
      }

      if (JSON.stringify(_this.props.selected_rows) !== JSON.stringify(nextProps.selected_rows)) {
        return true;
      }

      if (JSON.stringify(_this.props.selected_cell) !== JSON.stringify(nextProps.selected_cell)) {
        return true;
      }

      if (JSON.stringify(_this.props.isLoading) !== JSON.stringify(nextProps.isLoading)) {
        return true;
      }

      if (JSON.stringify(_this.state.rows_extended) !== JSON.stringify(nextState.rows_extended)) {
        return true;
      }

      if (JSON.stringify(_this.state.structure) !== JSON.stringify(nextState.structure)) {
        return true;
      }

      if (JSON.stringify(_this.state.is_setting_open) !== JSON.stringify(nextState.is_setting_open)) {
        return true;
      }

      if (JSON.stringify(_this.state.column_extended) !== JSON.stringify(nextState.column_extended)) {
        return true;
      }

      if (JSON.stringify(_this.state.cellActive) !== JSON.stringify(nextState.cellActive)) {
        return true;
      }

      if (JSON.stringify(_this.props.actions) !== JSON.stringify(nextProps.actions)) {
        return true;
      }

      if (JSON.stringify(_this.state.isCtrlPressed) !== JSON.stringify(nextState.isCtrlPressed)) {
        return true;
      }

      if (_this.props.title !== nextProps.title) {
        return true;
      }

      if (_this.props.sortChange !== nextProps.sortChange) {
        return true;
      }

      if (_this.state.sortMethod !== nextState.sortMethod) {
        return true;
      }

      if (JSON.stringify(_this.props.expandRows) !== JSON.stringify(nextProps.expandRows)) {
        return true;
      }

      if (_this.state.contextMenu.x !== nextState.contextMenu.x || _this.state.contextMenu.y !== nextState.contextMenu.y) {
        return true;
      }

      return false;
    });

    _defineProperty(_assertThisInitialized(_this), "handleCtrlKeyDown", function (event) {
      var ctrlKey = event.ctrlKey,
          keyCode = event.keyCode;
      /* Key codes for mac cmd key
      * Firefox: 224
      * Opera: 17
      * WebKit browsers (Safari/Chrome): 91 (Left Command) or 93 (Right Command)
      */

      var cmdkey = keyCode === 91 || keyCode === 93 || keyCode === 17 || keyCode === 224;

      if (ctrlKey || cmdkey) {
        _this.setState({
          isCtrlPressed: true
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleCtrlKeyUp", function (event) {
      var ctrlKey = event.ctrlKey,
          keyCode = event.keyCode;
      /* Key codes for mac cmd key
      * Firefox: 224
      * Opera: 17
      * WebKit browsers (Safari/Chrome): 91 (Left Command) or 93 (Right Command)
      */

      var cmdkey = keyCode === 91 || keyCode === 93 || keyCode === 17 || keyCode === 224;

      if (!ctrlKey || cmdkey) {
        _this.setState({
          isCtrlPressed: false
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onClickOnDocument", function () {
      if (_this.state.contextMenu.visible) {
        _this.setState({
          contextMenu: {
            visible: false
          }
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "componentDidMount", function () {
      _this.updateColumnsWidth();

      _this.generateTableStructure();

      _this.createDefaultValues();

      (0, _tableUtils.addFreezeColumns)(_this.state.name);
      document.addEventListener('keydown', _this.handleCtrlKeyDown);
      document.addEventListener('keyup', _this.handleCtrlKeyUp);
      document.addEventListener('click', _this.onClickOnDocument);

      if (_this.props.isExpandByDefault) {
        _this.expandRows();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "createDefaultValues", function () {
      if (_this.props.profiles) {
        var profileDefault = _this.props.profiles.find(function (e) {
          return e.is_default;
        });

        if (_this.state.profile_selected == null && profileDefault != null) {
          _this.setState({
            profile_selected: profileDefault.id
          });
        }
      }
    });

    _defineProperty(_assertThisInitialized(_this), "componentDidUpdate", function (prevProps, prevState) {
      console.log('Did update Table', _this.props.type); // if (this.container.current.offsetWidth !== this.state.tableWidth) {
      //    // console.log(`There is a diference ${this.container.current.offsetWidth} - ${this.state.tableWidth}`)
      //    // this.updateColumnsWidth()
      // }

      if (JSON.stringify(prevProps.rows) !== JSON.stringify(_this.props.rows) || prevProps.sortChange !== _this.props.sortChange || prevState.sortMethod !== _this.state.sortMethod || JSON.stringify(prevState.column_extended) !== JSON.stringify(_this.state.column_extended)) {
        _this.generateTableStructure();

        _this.onNewRowExpand(prevProps, prevState);
      }

      if (JSON.stringify(prevProps.selected_cell) !== JSON.stringify(_this.props.selected_cell)) {
        _this.setState({
          cellActive: _objectSpread({}, _this.props.selected_cell)
        });
      }

      if (!(0, _Utils.isEqual)(prevProps.columns, _this.props.columns)) {
        _this.updateColumnsWidth({
          forceUpdate: true
        });
      }

      if (prevProps.profileSelected !== _this.props.profileSelected) {
        _this.setState({
          profile_selected: _this.props.profileSelected
        });
      }

      if (prevState.profile_selected !== _this.state.profile_selected) {
        _this.updateColumnsWidth({
          forceUpdate: true
        });
      }

      if (!(0, _Utils.isEqual)(prevProps.profiles, _this.props.profiles) && _this.props.profiles != null) {
        var profileDefault = _this.props.profiles.find(function (e) {
          return e.is_default;
        });

        if (_this.state.profile_selected == null && profileDefault != null) {
          _this.setState({
            profile_selected: profileDefault ? profileDefault.id : null
          });
        } else {
          var isProfileSelectedStillExist = _this.props.profiles.find(function (e) {
            return e.id === _this.state.profile_selected;
          }) != null;

          if (!isProfileSelectedStillExist) {
            _this.setState({
              profile_selected: profileDefault ? profileDefault.id : null
            });
          }
        }
      }

      if (JSON.stringify(prevProps.selected_rows) !== JSON.stringify(_this.props.selected_rows) && _this.props.selected_rows.length === 0) {
        _this.removePasteEvent();
      }

      if (JSON.stringify(prevState.rows_extended) !== JSON.stringify(_this.state.rows_extended) || JSON.stringify(prevState.structure) !== JSON.stringify(_this.state.structure)) {
        _this.setRenderedRows();
      }

      if (!(0, _Utils.isEqual)(prevState.column_extended, _this.state.column_extended)) {
        if (_this.props.onColumnsChange) _this.props.onColumnsChange(_this.getVisibleColumns());
      }

      if (_this.tableHeader.current && _this.container.current) {
        var isSyncingLeftScroll = false;
        var isSyncingRightScroll = false;
        var tableHeader = _this.tableHeader.current;
        var tableBody = _this.container.current;

        tableHeader.onscroll = function () {
          if (!isSyncingLeftScroll) {
            isSyncingRightScroll = true;
            tableBody.scrollLeft = this.scrollLeft;
          }

          isSyncingLeftScroll = false;
        };

        tableBody.onscroll = function () {
          if (!isSyncingRightScroll) {
            isSyncingLeftScroll = true;
            tableHeader.scrollLeft = this.scrollLeft;
          }

          isSyncingRightScroll = false;
        };
      }

      if (_this.props.expandRows !== prevProps.expandRows) {
        _this.setState({
          rows_extended: generateRowsToExpand(_this.props.expandRows)
        });
      }

      (0, _tableUtils.addFreezeColumns)(_this.state.name);
    });

    _defineProperty(_assertThisInitialized(_this), "handleChangeProfile", function (id) {
      _this.setState({
        profile_selected: id
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleCreateProfile", function (data, onClose) {
      var columnExtended = _this.state.column_extended;

      _this.props.onCreateProfile(data, columnExtended, function (id) {
        if (id != null) {
          _this.setState({
            profile_selected: id
          });
        }

        onClose();
      });
    });

    _defineProperty(_assertThisInitialized(_this), "componentWillUnmount", function () {
      document.removeEventListener('keydown', _this.handleCtrlKeyDown);
      document.removeEventListener('keyup', _this.handleCtrlKeyUp);
      document.removeEventListener('click', _this.onClickOnDocument);
    });

    _defineProperty(_assertThisInitialized(_this), "setRenderedRows", function () {
      //  It should take the structure of the table to iterate over the table.
      //  Then take rows_extended and check if the rows is open and should render.
      var getRenderedRows = function getRenderedRows(rows) {
        return rows.reduce(function (acum, structure_item) {
          var row = _objectSpread(_objectSpread({}, _this.state.rows_extended[structure_item.id]), structure_item);

          if (row.is_open && row.subrows) {
            return [].concat(_toConsumableArray(acum), [structure_item.id], _toConsumableArray(getRenderedRows(row.subrows)));
          } else {
            return [].concat(_toConsumableArray(acum), [structure_item.id]);
          }
        }, []);
      };

      var rendered_rows = getRenderedRows(_this.state.structure);

      _this.setState(function (prevState) {
        return {
          rendered_rows: rendered_rows
        };
      });
    });

    _defineProperty(_assertThisInitialized(_this), "generateColumnExtended", function () {
      //  Add Internal columns
      var _assertThisInitialize = _assertThisInitialized(_this),
          _assertThisInitialize2 = _assertThisInitialize.state,
          state = _assertThisInitialize2 === void 0 ? {} : _assertThisInitialize2;

      var columns = _this.props.includeCodeColumm ? [].concat(_toConsumableArray(_this.internal_columns), _toConsumableArray(_this.props.columns)) : _toConsumableArray(_this.props.columns);
      var profileData = {};

      if (_this.props.profiles) {
        profileData = _this.props.profiles.find(function (e) {
          return e.id === state.profile_selected;
        });
        profileData = profileData ? profileData.data : {};
      }

      return columns.reduce(function (acum, item) {
        var key = item.key || item.assesor || item.Header;
        var profileParentColumnExtended = profileData[key] || {};
        acum[key] = {};
        var hasParentOwnIsVisible = item.hasOwnProperty('is_visible');
        var hasProfileParentOwnIsVisible = profileParentColumnExtended.hasOwnProperty('is_visible');

        if (hasProfileParentOwnIsVisible) {
          acum[key].is_visible = profileParentColumnExtended.is_visible;
        } else if (hasParentOwnIsVisible) {
          acum[key].is_visible = item.is_visible;
        }

        var hasParentOwnIsFreeze = item.hasOwnProperty('freeze');
        var hasProfileParentOwnIsFreeze = profileParentColumnExtended.hasOwnProperty('freeze');

        if (hasProfileParentOwnIsFreeze) {
          acum[key].freeze = profileParentColumnExtended.freeze;
        } else if (hasParentOwnIsFreeze) {
          acum[key].freeze = item.freeze;
        }

        if ((0, _index.hasOwnProperty)(profileParentColumnExtended, 'width') && !((0, _index.hasOwnProperty)(profileParentColumnExtended, 'is_width_calculate') && profileParentColumnExtended.is_width_calculate)) {
          acum[key].width = profileParentColumnExtended.width;
          acum[key].width_base = profileParentColumnExtended.width;
        } else if (item.hasOwnProperty('width')) {
          acum[key].width = item.width;
          acum[key].width_base = item.width;
        }

        var parent = acum[key];

        if (item.hasOwnProperty('columns')) {
          var parentKey = key;

          var _iterator = _createForOfIteratorHelper(item.columns),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var column = _step.value;

              var _key = column.key || column.assesor || column.Header;

              var profileColumnExtended = profileData[_key] || {};
              acum[_key] = {
                parent: parentKey
              };

              if (acum[parentKey].children == null) {
                acum[parentKey].children = [];
              }

              acum[parentKey].children.push(_key);

              if ((0, _index.hasOwnProperty)(profileColumnExtended, 'is_visible')) {
                acum[_key].is_visible = profileColumnExtended.is_visible;
              }

              if (hasParentOwnIsVisible || hasParentOwnIsVisible) {
                acum[_key].is_visible = parent.is_visible;
              }

              if (column.hasOwnProperty('is_visible')) {
                acum[_key].is_visible = hasProfileParentOwnIsVisible != null || hasParentOwnIsVisible != null ? parent.is_visible && column.is_visible : column.is_visible;
              }

              if (profileColumnExtended.hasOwnProperty('width')) {
                acum[_key].width = profileColumnExtended.width;
                acum[_key].width_base = profileColumnExtended.width;
              } else if (column.hasOwnProperty('width')) {
                acum[_key].width = column.width;
                acum[_key].width_base = column.width;
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        }

        return acum;
      }, {});
    });

    _defineProperty(_assertThisInitialized(_this), "generateTableStructure", function () {
      //  Updates the structure of the rows.
      //  It will only be executed when component is mounted and when rows or sortChange are updated.
      var rows = _this.props.rows; //  Look for root elements (The ones with parent_id)

      var rootElements = Object.keys(rows).reduce(function (acum, key) {
        return rows[key].parent_id == null ? [].concat(_toConsumableArray(acum), [key]) : acum;
      }, []);

      var cleanCode = function cleanCode(code) {
        return (0, _index.replaceAll)(code, '\\.', '').trim();
      };

      var sortMethod = function sortMethod(a, b) {
        if (_this.props.orderByCode) return cleanCode(a.code) - cleanCode(b.code);else if (_this.state.sortMethod) return _this.state.sortMethod(a, b);else return a.order_position - b.order_position;
      };

      var column_filters = Object.keys(_this.state.column_extended).reduce(function (acum, key) {
        var ce = _this.state.column_extended[key];

        if (ce.filter_value) {
          return [].concat(_toConsumableArray(acum), [{
            key: key,
            value: ce.filter_value,
            format: ce.filter_format
          }]);
        }

        return acum;
      }, []);

      var applyFilter = function applyFilter(row) {
        return column_filters.every(function (filter) {
          var cellValue = row[filter.key];
          var filterFormat = _typeof(filter.format) === 'object' ? filter.format.type : filter.format;

          if (cellValue != null) {
            switch (filterFormat) {
              case 'text':
                return cellValue.trim() !== '' ? cellValue.toLowerCase().includes(filter.value.toLowerCase()) : false;

              case 'currency':
                var is_valid = true;
                if (filter.value.max) is_valid = cellValue >= filter.value.max;
                if (filter.value.min) is_valid = is_valid && cellValue <= filter.value.min;
                if (filter.value.equal) is_valid = is_valid && cellValue === filter.value.equal;
                return is_valid;

              case 'list':
                return cellValue.find(function (value) {
                  return value.toLowerCase().includes(filter.value.toLowerCase());
                });

              default:
                return cellValue.trim() !== '' ? cellValue.toLowerCase().includes(filter.value.toLowerCase()) : false;
            }
          } else {
            return false;
          }
        });
      };

      var generateTree = function generateTree(elements, depth) {
        var _filterOptions$includ;

        var filterOptions = _this.props.filterOptions;
        var includeChildren = (_filterOptions$includ = filterOptions.includeChildren) !== null && _filterOptions$includ !== void 0 ? _filterOptions$includ : true;
        var sortElements = elements.reduce(function (acum, element_id, index) {
          var element = rows[element_id];

          if (!element) {
            return _toConsumableArray(acum);
          } // Here applies columns filters


          if (column_filters.length > 0) {
            if (!applyFilter(element)) {
              var _element$_children;

              // If the current element is filtered
              // Check before the current element is removed if any child element is valid.
              var children = ((_element$_children = element._children) === null || _element$_children === void 0 ? void 0 : _element$_children.length) > 0 ? (0, _Utils.getAllChildren)(element._children, rows) : [];
              var isFilterSuccessOnChild = children.find(function (child) {
                return applyFilter(child);
              }) != null;
              var isFilterSuccessOnParent = false;

              if (includeChildren) {
                // Check before the current element is removed if any parent element is valid.
                var parents = (0, _Utils.getAllParents)(element, rows);
                isFilterSuccessOnParent = parents.find(function (parent) {
                  return applyFilter(parent);
                }) != null;
              }

              if (!isFilterSuccessOnParent && !isFilterSuccessOnChild) {
                // If no child nor parent element is valid, the current element is removed
                return _toConsumableArray(acum);
              }
            }
          }

          var has_position = element.hasOwnProperty('order_position') && (0, _Utils.isNumber)(element.order_position);
          var internal_columns_values = _this.props.includeCodeColumm ? {
            Internal_Table_Code: has_position ? _this.getCodeFromPosition(element.id) : _this.getCodeFromIndex(index)
          } : {};

          var item = _objectSpread(_objectSpread({
            order_position: element.order_position,
            id: element_id,
            parent_id: element.parent_id,
            code: element.code,
            depth: depth
          }, element), internal_columns_values);

          if (element.hasOwnProperty('_children')) {
            item.subrows = generateTree(element._children, depth + 1);
          }

          var newArray = [].concat(_toConsumableArray(acum), [item]);
          return newArray;
        }, []).sort(sortMethod);
        return sortElements;
      }; //  Get structure


      var structure = generateTree(rootElements, 0); //  Update internal state

      _this.setState(function (prevState) {
        return {
          structure: structure
        };
      });
    });

    _defineProperty(_assertThisInitialized(_this), "updateColumnsWidth", function () {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var callback = arguments.length > 1 ? arguments[1] : undefined;

      var _assertThisInitialize3 = _assertThisInitialized(_this),
          _assertThisInitialize4 = _assertThisInitialize3.state,
          state = _assertThisInitialize4 === void 0 ? {} : _assertThisInitialize4;

      var forceUpdate = options.forceUpdate,
          column_extended = options.column_extended;
      var columnExtended = column_extended ? column_extended : forceUpdate ? _this.generateColumnExtended() : state.column_extended;

      var columns = _this.getColumns(columnExtended);

      var offsetWidth = _this.container.current.offsetWidth;
      var columns_extended = (0, _column.generateExtraColumnProperties)({
        columns: columns,
        current_extended_columns: columnExtended,
        offsetWidth: offsetWidth
      });

      _this.setState({
        column_extended: columns_extended,
        tableWidth: _this.container.current.offsetWidth
      }, callback);
    });

    _defineProperty(_assertThisInitialized(_this), "onRowSelect", function (row, isCtrlPress) {
      var selected_rows = _this.props.selected_rows ? _this.props.selected_rows : [];
      var shouldAdd = !selected_rows.includes(row.id);

      if (_this.props.onRowSelect) {
        _this.removePasteEvent();

        _this.addPasteEvent();

        if (isCtrlPress) {
          if (shouldAdd) {
            _this.props.onRowSelect(selected_rows.concat(row.id));
          } else {
            var selectedRows = selected_rows.filter(function (srow) {
              return srow !== row.id;
            });

            if (selectedRows.length <= 0) {
              _this.removePasteEvent();
            }

            _this.props.onRowSelect(selectedRows);
          }
        } else {
          if (shouldAdd) {
            _this.props.onRowSelect([row.id]);
          } else {
            _this.props.onRowSelect([]);

            _this.removePasteEvent();
          }
        }
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onPaste", function (e) {
      if (_this.props.onPasteRows) {
        var rows = (0, _index.getClipboardTextFromExcel)(e);
        var selected_rows = _this.props.selected_rows ? _this.props.selected_rows : [];

        _this.props.onPasteRows(selected_rows, rows);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "addPasteEvent", function () {
      window.addEventListener('paste', _this.onPaste);
    });

    _defineProperty(_assertThisInitialized(_this), "removePasteEvent", function () {
      if (window.removeEventListener) {
        // For all major browsers, except IE 8 and earlier
        window.removeEventListener("paste", _this.onPaste);
      } else if (window.detachEvent) {
        // For IE 8 and earlier versions
        window.detachEvent("paste", _this.onPaste);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onRowExpand", function (row) {
      //  1.- Mark as open
      //  2.- Check if it should render its children.
      if (!row.is_item) {
        // let rendered_rows = 0;
        var children = {};

        var columns = _this.getVisibleColumns();

        if (row.subrows) {
          //  Get children and see if they should be rendered.
          children = row.subrows.reduce(function (acum, row) {
            var shouldRender = columns.reduce(function (acum, current) {
              if (current.hasOwnProperty('text_filter') && current.text_filter.length > 0) {
                var filter = current.text_filter.toString();

                var checkIfIncluded = function checkIfIncluded(row) {
                  var textToCompare = row[current.assesor].toString().toLowerCase();
                  var isIncluded = textToCompare.includes(filter.toLowerCase());
                  if (isIncluded) return true;else if (row.hasOwnProperty('subrows')) {
                    return row.subrows.reduce(function (current, row) {
                      return current || checkIfIncluded(row);
                    }, false);
                  } else {
                    return false;
                  }
                };

                var isIncluded = checkIfIncluded(row); // TODO: Revisar con Julio
                // is_filter_active = true;

                return acum && isIncluded;
              }

              return acum && true;
            }, true); // if (shouldRender) {
            //    //  Increase rendered rows
            //    rendered_rows++;
            // }

            return _objectSpread(_objectSpread({}, acum), {}, _defineProperty({}, row.id, _objectSpread(_objectSpread({}, _this.state.rows_extended[row.id]), {}, {
              should_render: shouldRender
            })));
          }, {});
        }

        _this.setState(function (prevState) {
          return {
            rows_extended: _objectSpread(_objectSpread({}, prevState.rows_extended), {}, _defineProperty({}, row.id, _objectSpread(_objectSpread({}, prevState.rows_extended[row.id]), {}, {
              is_open: prevState.rows_extended.hasOwnProperty(row.id) ? prevState.rows_extended[row.id].hasOwnProperty('is_open') ? !prevState.rows_extended[row.id].is_open : true : true,
              should_render: true
            })), children)
          };
        });
      } // //  Check if there is an extra hanlder in the parent


      if (_this.props.hasOwnProperty('onRowExpand')) {
        _this.props.onRowExpand(row);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onNewRowExpand", function (prevProps, prevState) {
      // This function is used to expand a row when an element is added to it.
      if (Object.keys(prevProps.rows).length < Object.keys(_this.props.rows).length) {
        // Check if there is a new row
        var last_row_in_props = _this.props.rows[Object.keys(_this.props.rows)[Object.keys(_this.props.rows).length - 1]];

        if (last_row_in_props.parent_id !== null) {
          // Check that the new row was not a new section
          if (_this.props.selected_rows.length === 1) {
            // Check if only one row is selected
            if (_this.state.rows_extended[_this.props.selected_rows[0]]) {
              // Check that a row has been opened at least once, this is to be able to check if the selected row is open or not
              var row = _this.state.rows_extended[_this.props.selected_rows[0]];

              if (!row.hasOwnProperty('is_open') || row.is_open === false) {
                // Check if the row is closed
                _this.onRowExpand(_this.props.rows[_this.props.selected_rows[0]]);
              }
            } else {
              var _this$props$rows$_thi;

              _this.onRowExpand((_this$props$rows$_thi = _this.props.rows[_this.props.selected_rows[0]]) !== null && _this$props$rows$_thi !== void 0 ? _this$props$rows$_thi : _this.props.rows[_this.props.selected_rows[0].id]);
            }
          }
        }
      }
    });

    _defineProperty(_assertThisInitialized(_this), "getCodeFromIndex", function (index) {
      return (0, _Utils.pad)(index + 1, 2);
    });

    _defineProperty(_assertThisInitialized(_this), "getCodeFromPosition", function (id) {
      var row = _this.props.rows[id];

      if (row.hasOwnProperty('parent_id') && row.parent_id == null) {
        //  Get parent code
        return _this.getCodeFromPosition(row.parent_id) + (0, _Utils.pad)(row.order_position, 2); //return String.fromCharCode(97 + position - 1).toUpperCase();
      }

      return (0, _Utils.pad)(row.order_position, 2);
    });

    _defineProperty(_assertThisInitialized(_this), "initGenerateRows", function () {
      var rendered_rows = [];
      var object_rows = [];
      var real_index_inge_andre = 0;

      var generateRows = function generateRows(rows, depth) {
        var columns = _this.getVisibleColumns();

        var is_filter_active = false;
        rows.forEach(function (table_row, index) {
          var row = _objectSpread(_objectSpread(_objectSpread({}, table_row), _this.props.rows[table_row.id]), _this.state.rows_extended[table_row.id]);

          if (!row) {
            return 0;
          }

          var is_open = _this.state.rows_extended.hasOwnProperty(row.id) ? _this.state.rows_extended[row.id].hasOwnProperty('is_open') ? _this.state.rows_extended[row.id].is_open : false : false;
          var shouldRender = row.parent_id == null ? true : row.hasOwnProperty('should_render') ? row.should_render : true;

          if (shouldRender) {
            real_index_inge_andre++;
            var cellActive = undefined;

            if (_this.state.cellActive.row === real_index_inge_andre) {
              cellActive = _this.state.cellActive.cell;
            }

            var is_selected = _this.props.selected_rows ? _this.props.selected_rows.includes(row.id) : false;
            rendered_rows.push( /*#__PURE__*/_react["default"].createElement(_Row["default"], {
              styleTheme: _this.props.styleTheme,
              isDragColumnVisible: _this.props.isDragColumnVisible,
              expandCollapseColumnIndex: _this.props.expandCollapseColumnIndex,
              key: row.id,
              index: real_index_inge_andre,
              row: row,
              onFocus: _this.onFocusRow,
              is_open: is_open,
              is_selected: is_selected,
              columns: columns,
              depth: depth,
              onKeyDown: _this.onKeyDown,
              onKeyDownHotKeys: _this.onKeyDownHotKeys,
              cellActive: cellActive,
              onCellClick: _this.onCellClick,
              onCellDoubleClick: _this.props.onCellDoubleClick,
              onRowClick: _this.props.onRowClick,
              onUpdateRow: _this.onUpdateRow,
              onRowExpand: _this.onRowExpand,
              onRowSelect: _this.onRowSelect,
              onPaste: _this.props.onPasteCell,
              type: _this.props.type,
              customRowClass: _this.props.customRowClass,
              ignoreItemStyle: _this.props.ignoreItemStyle,
              canDrop: _this.props.canDropInRow,
              canDrag: _this.props.canDragRow,
              onDrop: _this.props.onDropInRow,
              scrollTo: _this.props.scrollToRow,
              handleFilterColumn: _this.handleFilterColumn,
              onContextMenu: function onContextMenu(x, y, actions) {
                _this.setState(function (prevState) {
                  return {
                    contextMenu: {
                      visible: true,
                      x: x,
                      y: y,
                      actions: actions
                    }
                  };
                });
              }
            }));
            object_rows.push(row);
          } //  Check if it has subrows and it's open to render subrows.


          if (!!table_row.subrows && (is_filter_active || is_open)) {
            generateRows(table_row.subrows, depth + 1);
          }
        });
      };

      generateRows(_this.state.structure, 0); // Total row

      if (_this.props.totalRow && !_this.props.totalRow.freeze) {
        rendered_rows.unshift( /*#__PURE__*/_react["default"].createElement(_Row["default"], {
          isDragColumnVisible: _this.props.isDragColumnVisible,
          expandCollapseColumnIndex: _this.props.expandCollapseColumnIndex,
          key: -1,
          index: -1,
          row: _this.props.totalRow,
          is_open: true,
          is_selected: false,
          columns: _this.getVisibleColumns().map(function (col) {
            return _objectSpread(_objectSpread({}, col), {}, {
              editable: false
            });
          }),
          depth: -1,
          cellActive: -1,
          onPaste: _this.props.onPasteCell,
          type: _this.props.type,
          customRowClass: _this.props.customRowClass,
          ignoreItemStyle: _this.props.ignoreItemStyle
        }));
      } else if (_this.props.totalRowColumns) {
        var _this$props$totalRowC;

        var totalRowValues = (0, _index.calculateGranTotal)(object_rows, (_this$props$totalRowC = _this.props.totalRowColumns) !== null && _this$props$totalRowC !== void 0 ? _this$props$totalRowC : []);
        rendered_rows.unshift( /*#__PURE__*/_react["default"].createElement(_Row["default"], {
          isDragColumnVisible: _this.props.isDragColumnVisible,
          expandCollapseColumnIndex: _this.props.expandCollapseColumnIndex,
          key: -1,
          index: -1,
          row: _objectSpread({
            description: 'Total'
          }, totalRowValues),
          is_open: true,
          is_selected: false,
          columns: _this.getVisibleColumns().map(function (col) {
            return _objectSpread(_objectSpread({}, col), {}, {
              editable: false
            });
          }),
          depth: -1,
          cellActive: -1,
          onPaste: _this.props.onPasteCell,
          type: _this.props.type,
          customRowClass: _this.props.customRowClass,
          ignoreItemStyle: _this.props.ignoreItemStyle
        }));
      }

      return rendered_rows;
    });

    _defineProperty(_assertThisInitialized(_this), "isColumnVisible", function (name, extended_column) {
      var extendedColumn = extended_column == null ? _this.state.column_extended : extended_column;
      return extendedColumn.hasOwnProperty(name) ? extendedColumn[name].hasOwnProperty('is_visible') ? extendedColumn[name].is_visible : true : true;
    });

    _defineProperty(_assertThisInitialized(_this), "getVisibleColumns", function () {
      return _this.getColumns().filter(function (colum) {
        return _this.isColumnVisible(colum.assesor);
      });
    });

    _defineProperty(_assertThisInitialized(_this), "getColumns", function (column_extended) {
      var _assertThisInitialize5 = _assertThisInitialized(_this),
          _assertThisInitialize6 = _assertThisInitialize5.state,
          state = _assertThisInitialize6 === void 0 ? {} : _assertThisInitialize6;

      var columns = _this.props.includeCodeColumm ? [].concat(_toConsumableArray(_this.internal_columns), _toConsumableArray(_this.props.columns)) : _toConsumableArray(_this.props.columns);
      var columnExtended = column_extended != null ? column_extended : state.column_extended;
      return (0, _column.mergeColumnsWithProperties)({
        columns: columns,
        extra_columns_properties: columnExtended
      });
    });

    _defineProperty(_assertThisInitialized(_this), "getColumnsAll", function () {
      var columns = _this.props.includeCodeColumm ? [].concat(_toConsumableArray(_this.internal_columns), _toConsumableArray(_this.props.columns)) : _toConsumableArray(_this.props.columns);
      columns = (0, _column.flatColumns)(columns);
      return columns.map(function (col) {
        var new_col = _objectSpread({}, col);

        new_col.is_visible = true;

        if (_this.state.column_extended.hasOwnProperty(new_col.assesor)) {
          var col_extended = _this.state.column_extended[new_col.assesor];
          new_col = _objectSpread(_objectSpread({}, new_col), col_extended);
          new_col.is_visible = col_extended.hasOwnProperty('is_visible') ? col_extended.is_visible : true;
        }

        new_col.key = new_col.key || new_col.assesor || new_col.header;
        return new_col;
      });
    });

    _defineProperty(_assertThisInitialized(_this), "getColumnsPlain", function () {
      var columns = _this.props.includeCodeColumm ? [].concat(_toConsumableArray(_this.internal_columns), _toConsumableArray(_this.props.columns)) : _toConsumableArray(_this.props.columns);

      var mapColumnsWithExtendedProperties = function mapColumnsWithExtendedProperties(columns) {
        return columns.map(function (col) {
          var new_col = _objectSpread({}, col);

          new_col.is_visible = true;
          new_col.key = new_col.key || new_col.assesor || new_col.Header;

          if (new_col.columns) {
            new_col.columns = mapColumnsWithExtendedProperties(new_col.columns);
          }

          if (_this.state.column_extended.hasOwnProperty(new_col.key)) {
            var col_extended = _this.state.column_extended[new_col.key];
            new_col = _objectSpread(_objectSpread({}, new_col), col_extended);
            new_col.is_visible = col_extended.hasOwnProperty('is_visible') ? col_extended.is_visible : true;
          }

          return new_col;
        });
      };

      return mapColumnsWithExtendedProperties(columns);
    });

    _defineProperty(_assertThisInitialized(_this), "toggleColumn", function (column) {
      _this.setState(function (prevState) {
        var new_columns = Object.keys(prevState.column_extended).reduce(function (acum, key) {
          acum[key] = _objectSpread({}, prevState.column_extended[key]);

          if (key === column) {
            acum[key].is_visible = !_this.isColumnVisible(key);
          }

          return acum;
        }, {});

        var isColumnVisible = function isColumnVisible(column) {
          return new_columns.hasOwnProperty(column) ? new_columns[column].hasOwnProperty('is_visible') ? new_columns[column].is_visible : true : true;
        };

        var _new_columns$column = new_columns[column],
            parent = _new_columns$column.parent,
            children = _new_columns$column.children;

        if (parent != null) {
          new_columns[parent].is_visible = new_columns[parent].children.reduce(function (accum, child) {
            return isColumnVisible(child) ? true : accum;
          }, false);
        } else {
          if (children != null) {
            var _iterator2 = _createForOfIteratorHelper(children),
                _step2;

            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                var child = _step2.value;
                new_columns[child].is_visible = isColumnVisible(column);
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }
          }
        }

        return {
          column_extended: new_columns
        };
      }, function () {
        return _this.updateColumnsWidth();
      });
    });

    _defineProperty(_assertThisInitialized(_this), "expandRows", function () {
      var rows = {};

      if (_this.props.selected_rows.length > 0) {
        // To expand only the selected rows
        var rowsfromProps = _this.props.rows;

        var getAllSubrows = function getAllSubrows(row) {
          // Function to get all the subrows of the selected rows
          rows = _objectSpread(_objectSpread({}, rows), {}, _defineProperty({}, row.id, rowsfromProps[row.id]));

          if (row.hasOwnProperty('_children') && row._children.length > 0) {
            row._children.forEach(function (current_row_id) {
              getAllSubrows(rowsfromProps[current_row_id]);
            });
          }
        };

        _this.props.selected_rows.forEach(function (row_id) {
          getAllSubrows(_this.props.rows[row_id]);
        });
      } else {
        // To expand all rows
        rows = _this.props.rows;
      }

      for (var row_id in rows) {
        var row = _this.state.rows_extended[row_id];

        if (row) {
          // Check if the row has been extended
          if (!row.hasOwnProperty('is_open') || row.is_open === false) {
            // Check if the row is closed
            _this.onRowExpand(_this.props.rows[row_id]);
          }
        } else {
          // Else, just expand it
          _this.onRowExpand(_this.props.rows[row_id]);
        }
      }
    });

    _defineProperty(_assertThisInitialized(_this), "collapseRows", function () {
      var rows = {};

      if (_this.props.selected_rows.length > 0) {
        // To collapse only the selected rows
        var rowsfromProps = _this.props.rows;

        var getAllSubrows = function getAllSubrows(row) {
          // Function to get all the subrows of the selected rows
          rows = _objectSpread(_objectSpread({}, rows), {}, _defineProperty({}, row.id, rowsfromProps[row.id]));

          if (row.hasOwnProperty('_children') && row._children.length > 0) {
            row._children.forEach(function (current_row_id) {
              getAllSubrows(rowsfromProps[current_row_id]);
            });
          }
        };

        _this.props.selected_rows.forEach(function (row_id) {
          getAllSubrows(_this.props.rows[row_id]);
        });
      } else {
        // To collapse all rows
        rows = _this.props.rows;
      }

      for (var row_id in rows) {
        var row = _this.state.rows_extended[row_id];

        if (row) {
          // Check if the row has been extended
          if (row.hasOwnProperty('is_open') && row.is_open === true) {
            // Check if the row is opened
            _this.onRowExpand(_this.props.rows[row_id]);
          }
        }
      }
    });

    _defineProperty(_assertThisInitialized(_this), "toggleSettings", function () {
      _this.setState(function (prevState) {
        return {
          is_setting_open: !prevState.is_setting_open
        };
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onUpdateColumnProperties", function (name) {
      if (_this.props.onUpdateColumnProperties) {
        _this.props.onUpdateColumnProperties(_this.state.column_extended, {
          id: _this.state.profile_selected,
          name: name
        }, function (id) {
          if (id) {
            _this.setState({
              profile_selected: id
            });
          }
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleDeleteProfile", function (id) {
      if (_this.props.onDeleteProfile) {
        _this.props.onDeleteProfile(id);

        _this.toggleSettings();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onUpdateColumnWidth", function (_ref) {
      var name = _ref.name,
          columns = _ref.columns;

      var allKeys = _objectSpread(_objectSpread({}, _this.state.column_extended), columns);

      var column_extended = Object.keys(allKeys).reduce(function (acum, colkey) {
        var previousColumn = _this.state.column_extended[colkey] || {};
        var updatedColumn = columns[colkey];

        var newColumn = _objectSpread(_objectSpread({}, previousColumn), {}, {
          width: updatedColumn.width,
          is_visible: updatedColumn.is_visible,
          freeze: updatedColumn.freeze
        });

        if ((0, _index.hasOwnProperty)(updatedColumn, 'is_width_calculate') && !updatedColumn.is_width_calculate && (0, _index.hasOwnProperty)(newColumn, 'is_width_calculate')) {
          delete newColumn['is_width_calculate'];
        }

        if (updatedColumn.is_width_calculate) {
          newColumn['is_width_calculate'] = updatedColumn.is_width_calculate;
          delete newColumn['width'];
        }

        return _objectSpread(_objectSpread({}, acum), {}, _defineProperty({}, colkey, newColumn));
      }, {});

      _this.updateColumnsWidth({
        forceUpdate: true,
        column_extended: column_extended
      }, function () {
        _this.onUpdateColumnProperties(name);
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onCellClick", function (column, row, colIndex, rowIndex) {
      _this.setState({
        cellActive: {
          row_id: row.id,
          row: rowIndex,
          cell: colIndex
        }
      });

      if (_this.props.onCellClick) _this.props.onCellClick(column, row);
    });

    _defineProperty(_assertThisInitialized(_this), "selectAllRows", function (rows) {
      var selected_rows = Object.values(rows).map(function (row) {
        return row.id;
      });

      _this.props.onRowSelect(selected_rows);
    });

    _defineProperty(_assertThisInitialized(_this), "deselectAllRows", function () {
      _this.props.onRowSelect([]);
    });

    _defineProperty(_assertThisInitialized(_this), "onRemoveActive", function () {
      _this.setState({
        cellActive: {
          row: undefined,
          cell: undefined
        }
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onUpdateRow", function (column, row, value, resetValue) {
      if (_this.props.onUpdateRow) {
        _this.props.onUpdateRow(column, row, value, resetValue, _this.onRemoveActive);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleFilterColumn", function (col) {
      return function (filter_value) {
        if (filter_value === '') {
          // Collapse all rows if filter value was erased
          _this.collapseRows();
        } else {
          // Expand searched rows
          _this.expandRows();
        }

        _this.setState(function (prevState) {
          return {
            column_extended: Object.keys(prevState.column_extended).reduce(function (acum, key) {
              if (key === col.assesor) {
                return _objectSpread(_objectSpread({}, acum), {}, _defineProperty({}, col.assesor, _objectSpread(_objectSpread({}, prevState.column_extended[col.assesor]), {}, {
                  filter_format: col.format,
                  filter_value: filter_value
                })));
              }

              return _objectSpread(_objectSpread({}, acum), {}, _defineProperty({}, key, _objectSpread(_objectSpread({}, prevState.column_extended[key]), {}, {
                filter_value: null
              })));
            }, {})
          };
        });
      };
    });

    _defineProperty(_assertThisInitialized(_this), "onSubmitSettings", function (_ref2) {
      var name = _ref2.name,
          columns = _ref2.columns;

      _this.onUpdateColumnWidth({
        name: name,
        columns: columns
      });

      if (_this.props.onSubmitSettings) {
        _this.props.onSubmitSettings({
          name: name,
          columns: columns
        });
      }
    });

    _this.internal_columns = [{
      Header: 'Code',
      assesor: 'Internal_Table_Code',
      width: 100
    }];
    _this.state = {
      structure: [],
      open_rows: {},
      rows_extended: generateRowsToExpand(props.expandRows),
      column_extended: _this.generateColumnExtended(),
      tableWidth: 0,
      cellActive: {
        row: undefined,
        cell: undefined
      },
      rendered_rows: [],
      is_setting_open: false,
      isCtrlPressed: false,
      profile_selected: null,
      sortMethod: props.sort,
      name: props.name || (0, _uuid.v4)(),
      contextMenu: {
        visible: false,
        x: 0,
        y: 0,
        actions: []
      }
    };
    _this.container = /*#__PURE__*/_react["default"].createRef();
    _this.tableHeader = /*#__PURE__*/_react["default"].createRef();
    _this.tableToolbar = /*#__PURE__*/_react["default"].createRef();
    return _this;
  }

  _createClass(Table, [{
    key: "render",
    value: function render() {
      var _this2 = this,
          _groupColumns$,
          _columns$,
          _this$props4,
          _this$props4$totalRow,
          _groupColumns$2,
          _groupColumns$3;

      var _this$props2 = this.props,
          title = _this$props2.title,
          rows = _this$props2.rows,
          isLoading = _this$props2.isLoading,
          bottomToolbar = _this$props2.bottomToolbar,
          noRowsMessage = _this$props2.noRowsMessage,
          _this$props2$selected = _this$props2.selected_rows,
          selected_rows = _this$props2$selected === void 0 ? [] : _this$props2$selected,
          _this$props2$actions = _this$props2.actions,
          actions = _this$props2$actions === void 0 ? [] : _this$props2$actions,
          isDragColumnVisible = _this$props2.isDragColumnVisible,
          paddingBodyTable = _this$props2.paddingBodyTable,
          isTableHeaderHidden = _this$props2.isTableHeaderHidden,
          tableWrapperStyle = _this$props2.tableWrapperStyle;
      var isEmpty = Object.keys(rows).length === 0 && !isLoading;
      var columns = this.getVisibleColumns();
      var groupColumns = (0, _column.generateGroupColumns)(this.getColumnsPlain(), this.isColumnVisible);
      var shouldRenderTitle = selected_rows ? selected_rows.length > 0 || title : title;
      var tableOffset = 0;

      if (this.tableToolbar.current && this.tableHeader.current) {
        var offSetIKnowWhereItComeFrom = 2;
        tableOffset = this.tableToolbar.current.offsetHeight + this.tableHeader.current.offsetHeight + offSetIKnowWhereItComeFrom;
      }

      var tableStyle = {
        display: 'flex',
        flexDirection: 'column',
        fontSize: '12px',
        borderSpacing: 0,
        height: "calc(100% - ".concat(tableOffset, "px)")
      };
      var droppableStyle = {
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      };
      var emptyCellStyle = {
        width: 24,
        flex: "25 0 auto",
        maxWidth: 24
      };

      var renderColumns = function renderColumns(columns) {
        return columns.map(function (col, index) {
          var _col$sortable;

          var extended_props = _this2.state.column_extended[col.assesor];
          var sort_directon = extended_props === null || extended_props === void 0 ? void 0 : extended_props.sort_directon;
          var is_sortable = col.assesor ? (_col$sortable = col.sortable) !== null && _col$sortable !== void 0 ? _col$sortable : true : false;
          return /*#__PURE__*/_react["default"].createElement("td", {
            className: "".concat(col.Header !== '' && col.columns ? 'Table-Column-Header-Groups' : 'Table-Column-Header', " ").concat(col.freeze ? 'fixed freeze_horizontal' : ''),
            key: col.assesor || col.key,
            style: {
              width: col.width,
              flex: "".concat(col.width, " 0 auto"),
              maxWidth: col.width
            }
          }, /*#__PURE__*/_react["default"].createElement("div", {
            className: "".concat(col.Header !== '' && col.columns ? 'Table-Column-Header-Groups-Cell' : 'Table-Column-Header-Cell')
          }, /*#__PURE__*/_react["default"].createElement("div", {
            className: is_sortable ? "".concat(col.Header !== '' && col.columns ? 'Table-Column-Header-Groups-Sortable' : 'Table-Column-Header-Sortable') : null,
            style: {
              textAlign: 'center'
            },
            onClick: is_sortable ? function () {
              _this2.setState(function (prevState) {
                return {
                  column_extended: Object.keys(prevState.column_extended).reduce(function (acum, key) {
                    if (key === col.assesor) {
                      return _objectSpread(_objectSpread({}, acum), {}, _defineProperty({}, col.assesor, _objectSpread(_objectSpread({}, prevState.column_extended[col.assesor]), {}, {
                        sort_directon: prevState.column_extended[col.assesor].sort_directon === 'up' ? 'down' : 'up'
                      })));
                    }

                    return _objectSpread(_objectSpread({}, acum), {}, _defineProperty({}, key, _objectSpread(_objectSpread({}, prevState.column_extended[key]), {}, {
                      sort_directon: null
                    })));
                  }, {}),
                  sortMethod: col.sortMethod ? col.sortMethod : function (a, b) {
                    var sortUp = prevState.column_extended[col.assesor].sort_directon === 'up';

                    var clean = function clean(str) {
                      var tmp = (0, _index.replaceAll)(str, '\\/', '');
                      tmp = (0, _index.replaceAll)(tmp, '\\.', '');
                      tmp = (0, _Utils.removeSpecialCharacters)(tmp);
                      return tmp.trim();
                    };

                    var colFormat = _typeof(col.format) === 'object' ? col.format.type : col.format;

                    if (colFormat === 'currency' || colFormat === 'number') {
                      return sortUp ? a[col.assesor] - b[col.assesor] : b[col.assesor] - a[col.assesor];
                    } else {
                      return clean(a[col.assesor]) > clean(b[col.assesor]) ? sortUp ? 1 : -1 : sortUp ? -1 : 1;
                    }
                  }
                };
              });
            } : undefined
          }, typeof col.Header === 'string' ? col.Header : col.Header(), "\xA0 ", col.help_info != null && /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Popup, {
            content: col.help_info,
            trigger: /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Icon, {
              name: "help circle"
            })
          }), sort_directon != null && /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Icon, {
            color: "blue",
            name: "sort alphabet ".concat(sort_directon)
          })), !!col.filter && /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_FilterColumn["default"], {
            column_extended: _this2.state.column_extended[col.assesor],
            column: col,
            onSubmit: _this2.handleFilterColumn(col)
          }))));
        });
      };

      var _this$props3 = this.props,
          tableHeaderOptions = _this$props3.tableHeaderOptions,
          _this$props3$profiles = _this$props3.profiles,
          profiles = _this$props3$profiles === void 0 ? [] : _this$props3$profiles,
          _this$props3$shouldCr = _this$props3.shouldCreateContext,
          shouldCreateContext = _this$props3$shouldCr === void 0 ? false : _this$props3$shouldCr;
      var profile_selected = this.state.profile_selected;
      var profileSelected = profiles.find(function (e) {
        return profile_selected === e.id;
      });
      return /*#__PURE__*/_react["default"].createElement(_reactHotkeys.HotKeys, {
        handlers: this.keyBoardHandlers,
        keyMap: keyMap,
        style: _objectSpread({
          outline: 'none',
          height: '100%',
          width: '100%'
        }, tableWrapperStyle)
      }, /*#__PURE__*/_react["default"].createElement("div", {
        style: droppableStyle
      }, !isTableHeaderHidden && /*#__PURE__*/_react["default"].createElement(_Header["default"], {
        tableHeaderOptions: tableHeaderOptions,
        profiles: this.props.profiles,
        profileSelected: profile_selected,
        filter: this.props.filter,
        setRef: this.tableToolbar,
        shouldRenderTitle: shouldRenderTitle,
        selected_rows: selected_rows,
        title: title,
        actions: actions,
        toggleSettings: this.toggleSettings,
        enableProfileConfiguration: this.props.enableProfileConfiguration,
        onChangeProfile: this.handleChangeProfile,
        onCreateProfile: this.handleCreateProfile,
        columns: this.props.columns,
        rows: this.state.structure,
        allowToDownloadCVS: this.props.allowToDownloadCVS,
        rows_extended: this.state.rows_extended,
        expandRows: _objectSpread({
          displayButton: this.props.isExpandRowsButtonActive,
          isRowSelected: this.props.selected_rows.length > 0 ? true : false,
          isRowHeaderSelected: this.props.selected_rows.filter(function (row_id) {
            return _this2.props.rows[row_id] && _this2.props.rows[row_id].is_item === false;
          }).length > 0 ? true : false,
          action: this.expandRows
        }, tableHeaderOptions.expandRows || {}),
        collapseRows: _objectSpread({
          displayButton: this.props.isCollapseRowsButtonActive,
          isRowSelected: this.props.selected_rows.length > 0 ? true : false,
          isRowHeaderSelected: this.props.selected_rows.filter(function (row_id) {
            return _this2.props.rows[row_id] && _this2.props.rows[row_id].is_item === false;
          }).length > 0 ? true : false,
          action: this.collapseRows
        }, tableHeaderOptions.collapseRows || {})
      }), /*#__PURE__*/_react["default"].createElement("table", {
        className: "the-table-header ".concat(this.state.name),
        ref: this.tableHeader,
        style: {
          display: 'flex',
          flexDirection: 'column'
        }
      }, groupColumns && groupColumns.length > 0 && /*#__PURE__*/_react["default"].createElement("thead", null, /*#__PURE__*/_react["default"].createElement("tr", {
        className: "Table-Row-Header tr_shaded"
      }, isDragColumnVisible && /*#__PURE__*/_react["default"].createElement("td", {
        colSpan: "1",
        className: "".concat(groupColumns && (_groupColumns$ = groupColumns[0]) !== null && _groupColumns$ !== void 0 && _groupColumns$.freeze ? 'freeze_horizontal' : ''),
        style: emptyCellStyle
      }, " "), renderColumns(groupColumns))), /*#__PURE__*/_react["default"].createElement("thead", null, /*#__PURE__*/_react["default"].createElement("tr", {
        className: "Table-Row-Header tr_shaded"
      }, isDragColumnVisible && /*#__PURE__*/_react["default"].createElement("td", {
        colSpan: "1",
        className: "".concat(columns && (_columns$ = columns[0]) !== null && _columns$ !== void 0 && _columns$.freeze ? 'freeze_horizontal' : ''),
        style: emptyCellStyle
      }, " ", this.props.enableSelectAll && /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Button, {
        size: "large",
        compact: true,
        className: "select-all-button",
        basic: true,
        icon: selected_rows.length === Object.keys(rows).length && Object.keys(rows).length > 0 ? "check square outline" : "square outline",
        onClick: function onClick() {
          if (selected_rows.length < Object.keys(rows).length && Object.keys(rows).length) {
            _this2.selectAllRows(rows);
          } else {
            _this2.deselectAllRows();
          }
        }
      })), renderColumns(columns)), (this === null || this === void 0 ? void 0 : (_this$props4 = this.props) === null || _this$props4 === void 0 ? void 0 : (_this$props4$totalRow = _this$props4.totalRow) === null || _this$props4$totalRow === void 0 ? void 0 : _this$props4$totalRow.freeze) && /*#__PURE__*/_react["default"].createElement(_Row["default"], {
        isDragColumnVisible: this.props.isDragColumnVisible,
        expandCollapseColumnIndex: this.props.expandCollapseColumnIndex,
        key: -1,
        index: -1,
        row: this.props.totalRow,
        is_open: true,
        is_selected: false,
        columns: this.getVisibleColumns().map(function (col) {
          return _objectSpread(_objectSpread({}, col), {}, {
            editable: false
          });
        }),
        depth: -1,
        cellActive: -1,
        onPaste: this.props.onPasteCell,
        type: this.props.type,
        customRowClass: this.props.customRowClass,
        ignoreItemStyle: this.props.ignoreItemStyle
      }))), /*#__PURE__*/_react["default"].createElement("table", {
        className: "table-drag-n-drop the-table ".concat(this.props.className, " scrolly_table scrolling_table_2 ").concat(this.state.name),
        style: tableStyle,
        ref: this.container
      }, groupColumns && groupColumns.length > 0 && /*#__PURE__*/_react["default"].createElement("thead", null, /*#__PURE__*/_react["default"].createElement("tr", {
        className: "Table-Row-Header"
      }, isDragColumnVisible && /*#__PURE__*/_react["default"].createElement("td", {
        colSpan: "1",
        className: "".concat(groupColumns && (_groupColumns$2 = groupColumns[0]) !== null && _groupColumns$2 !== void 0 && _groupColumns$2.freeze ? 'freeze_horizontal' : ''),
        style: emptyCellStyle
      }, " "), renderColumns(groupColumns))), /*#__PURE__*/_react["default"].createElement("thead", null, /*#__PURE__*/_react["default"].createElement("tr", {
        className: "Table-Row-Header"
      }, isDragColumnVisible && /*#__PURE__*/_react["default"].createElement("td", {
        colSpan: "1",
        className: "".concat(groupColumns && (_groupColumns$3 = groupColumns[0]) !== null && _groupColumns$3 !== void 0 && _groupColumns$3.freeze ? 'freeze_horizontal' : ''),
        style: emptyCellStyle
      }, " "), renderColumns(columns))), /*#__PURE__*/_react["default"].createElement("tbody", {
        style: {
          display: 'table',
          padding: paddingBodyTable ? paddingBodyTable : 'none'
        }
      }, isEmpty ? /*#__PURE__*/_react["default"].createElement(_NoRowsCard["default"], {
        noRowsMessage: noRowsMessage,
        onDrop: this.props.onDropInZone,
        canDrop: this.props.canDropInZone,
        isCtrlPressed: this.state.isCtrlPressed
      }) : [/*#__PURE__*/_react["default"].createElement(_DropZone["default"], {
        key: "dropzone",
        onDrop: this.props.onDropInZone,
        canDrop: this.props.canDropInZone,
        isCtrlPressed: this.state.isCtrlPressed
      }), this.initGenerateRows()])), isLoading && /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Dimmer, {
        active: isLoading,
        inverted: true
      }, /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Loader, null, "Cargando")), bottomToolbar != null && bottomToolbar, /*#__PURE__*/_react["default"].createElement(_Settings["default"], {
        profile: profileSelected,
        isOpen: this.state.is_setting_open,
        columns: this.getColumnsPlain(),
        onClose: this.toggleSettings,
        toggleColumn: this.toggleColumn,
        onSubmit: this.onSubmitSettings,
        onConfirmDelete: this.handleDeleteProfile,
        isColumnVisible: this.isColumnVisible
      }), this.state.contextMenu.visible && /*#__PURE__*/_react["default"].createElement(_ContextMenu["default"], {
        onClose: function onClose() {
          _this2.setState({
            contextMenu: {
              visible: false
            }
          });
        },
        x: this.state.contextMenu.x,
        y: this.state.contextMenu.y,
        actions: this.state.contextMenu.actions
      })));
    }
  }]);

  return Table;
}(_react["default"].Component);

Table.propTypes = {
  className: _propTypes["default"].string,
  title: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].object]),
  styleTheme: _propTypes["default"].oneOf(['striped']),
  type: _propTypes["default"].oneOf(['Detail', 'Material', 'MaterialImport', 'LineItem', 'LineItemImport', 'LineItemDetail', 'UoM', 'EstimateItem', 'Undefined', 'MeasurementUnit', 'Package', 'PackageItem', 'BillingItem', 'Grafo', 'WBS']),
  columns: _propTypes["default"].arrayOf(_propTypes["default"].shape({
    Header: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].func]),
    assesor: _propTypes["default"].string,
    onlyItems: _propTypes["default"].bool,
    onlyHeaders: _propTypes["default"].bool,
    editable: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].bool, _propTypes["default"].func]),
    width: _propTypes["default"].number,
    is_visible: _propTypes["default"].bool,
    Cell: _propTypes["default"].func,
    format: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].object, _propTypes["default"].func]),
    filter: _propTypes["default"].bool,
    sortable: _propTypes["default"].bool,
    sortMethod: _propTypes["default"].func
  })).isRequired,
  rows: _propTypes["default"].object.isRequired,
  actions: _propTypes["default"].arrayOf(_propTypes["default"].shape({
    name: _propTypes["default"].string.isRequired,
    icon: _propTypes["default"].string,
    subIcon: _propTypes["default"].string,
    subIconPosition: _propTypes["default"].string,
    action: _propTypes["default"].func,
    position: _propTypes["default"].oneOf(['left', 'right']),
    custom_button: _propTypes["default"].func
  })),
  selected_rows: _propTypes["default"].array,
  selected_cell: _propTypes["default"].object,
  totalRow: _propTypes["default"].object,
  totalRowColumns: _propTypes["default"].array,
  onPasteRows: _propTypes["default"].func,
  onPasteCell: _propTypes["default"].func,
  onRowClick: _propTypes["default"].func,
  onRowExpand: _propTypes["default"].func,
  onRowSelect: _propTypes["default"].func,
  onCellClick: _propTypes["default"].func,
  onCellDoubleClick: _propTypes["default"].func,
  onUpdateRow: _propTypes["default"].func,
  onAddNew: _propTypes["default"].func,
  onUpdateColumnProperties: _propTypes["default"].func,
  canDragRow: _propTypes["default"].func,
  canDropInRow: _propTypes["default"].func,
  canDropInZone: _propTypes["default"].func,
  onDropInRow: _propTypes["default"].func,
  onDropInZone: _propTypes["default"].func,
  customRowClass: _propTypes["default"].func,
  isLoading: _propTypes["default"].bool,
  noRowsMessage: _propTypes["default"].object,
  includeCodeColumm: _propTypes["default"].bool,
  orderByCode: _propTypes["default"].bool,
  sort: _propTypes["default"].func,
  expandCollapseColumnIndex: _propTypes["default"].number,
  isDragColumnVisible: _propTypes["default"].bool,
  isTableHeaderHidden: _propTypes["default"].bool,
  paddingBodyTable: _propTypes["default"].string,
  expandRows: _propTypes["default"].array,
  enableSelectAll: _propTypes["default"].bool,
  tableHeaderOptions: _propTypes["default"].object,
  profiles: _propTypes["default"].array,
  enableProfileConfiguration: _propTypes["default"].bool,
  onChangeProfile: _propTypes["default"].func,

  /**
   * Gets called when the user clicks on the button
   *
   * @param {Object} data The react
   * @param {Object} columns All props of this Button
   * @param {function} onClose All props of this Button
   */
  onCreateProfile: _propTypes["default"].func,
  onDeleteProfile: _propTypes["default"].func,
  bottomToolbar: _propTypes["default"].any,
  isExpandRowsButtonActive: _propTypes["default"].bool,
  isCollapseRowsButtonActive: _propTypes["default"].bool,
  isExpandByDefault: _propTypes["default"].bool,
  scrollToRow: _propTypes["default"].number,
  allowToDownloadCVS: _propTypes["default"].bool,
  filterOptions: _propTypes["default"].object
};
Table.defaultProps = {
  className: '',
  tableHeaderOptions: {},
  actions: [],
  expandCollapseColumnIndex: 0,
  isTableHeaderHidden: false,
  isDragColumnVisible: true,
  type: 'Undefined',
  selected_rows: [],
  onRowSelect: function onRowSelect() {},
  onUpdateRow: function onUpdateRow() {},
  onUpdateColumnProperties: function onUpdateColumnProperties() {},
  isLoading: false,
  includeCodeColumm: false,
  orderByCode: false,
  noRowsMessage: {
    title: "Tabla vacia",
    subtitle: "No hay elementos cargados",
    icon: '',
    isMultiple: false
  },
  expandRows: [],
  enableSelectAll: false,
  isExpandRowsButtonActive: true,
  isCollapseRowsButtonActive: true,
  isExpandByDefault: false,
  filterOptions: {
    includeChildren: true
  }
};

var _default = (0, _withDndContext["default"])(Table);

exports["default"] = _default;