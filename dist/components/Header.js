"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _semanticUiReact = require("semantic-ui-react");

var _Toolbar = _interopRequireDefault(require("./Toolbar"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var TableHeader = function TableHeader(_ref) {
  var profileSelected = _ref.profileSelected,
      onCreateProfile = _ref.onCreateProfile,
      onChangeProfile = _ref.onChangeProfile,
      enableProfileConfiguration = _ref.enableProfileConfiguration,
      profiles = _ref.profiles,
      filter = _ref.filter,
      setRef = _ref.setRef,
      shouldRenderTitle = _ref.shouldRenderTitle,
      _ref$shouldRenderDefa = _ref.shouldRenderDefaultActions,
      shouldRenderDefaultActions = _ref$shouldRenderDefa === void 0 ? true : _ref$shouldRenderDefa,
      _ref$selected_rows = _ref.selected_rows,
      selected_rows = _ref$selected_rows === void 0 ? [] : _ref$selected_rows,
      title = _ref.title,
      actions = _ref.actions,
      toggleSettings = _ref.toggleSettings,
      expandRows = _ref.expandRows,
      collapseRows = _ref.collapseRows,
      allowToOpenSettings = _ref.allowToOpenSettings,
      className = _ref.className,
      _ref$tableHeaderOptio = _ref.tableHeaderOptions,
      tableHeaderOptions = _ref$tableHeaderOptio === void 0 ? {} : _ref$tableHeaderOptio,
      rows = _ref.rows,
      columns = _ref.columns,
      allowToDownloadCVS = _ref.allowToDownloadCVS,
      rows_extended = _ref.rows_extended;
  var toolBarStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '0.5rem 1rem'
  };
  var headerStyle = {
    margin: '0px'
  };
  var bodyToolbarStyle = {
    display: 'flex',
    flexGrow: 1,
    flexWrap: 'wrap'
  };
  var isFilterActive = filter != null;
  var isRowSelected = selected_rows.length > 0;
  var isIndicatorActive = isFilterActive || isRowSelected;
  var shouldRenderToolbar = tableHeaderOptions.shouldRenderToolbar != null ? tableHeaderOptions.shouldRenderToolbar : true;

  if (tableHeaderOptions.shouldRenderDefaultActions != null) {
    shouldRenderDefaultActions = tableHeaderOptions.shouldRenderDefaultActions;
  }

  return /*#__PURE__*/_react["default"].createElement("div", {
    ref: setRef,
    style: toolBarStyle,
    className: "table-toolbar ".concat(isIndicatorActive ? "row-selected" : "", " ").concat(className)
  }, shouldRenderTitle && /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, isIndicatorActive ? /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Header, {
    style: headerStyle,
    as: "h4",
    color: "red"
  }, isRowSelected > 0 ? "".concat(selected_rows.length, " elemento(s) seleccionados") : "", isFilterActive ? filter.text : "") : /*#__PURE__*/_react["default"].createElement(_semanticUiReact.Header, {
    style: headerStyle,
    as: "h3"
  }, title)), shouldRenderToolbar && /*#__PURE__*/_react["default"].createElement(_Toolbar["default"], {
    style: bodyToolbarStyle,
    title: title,
    shouldRenderDefaultActions: shouldRenderDefaultActions,
    actions: actions,
    openSettings: toggleSettings,
    expandElements: expandRows,
    collapseElements: collapseRows,
    allowToOpenSettings: allowToOpenSettings,
    toolbarOptions: tableHeaderOptions.toolbarOptions,
    profiles: profiles,
    profileSelected: profileSelected,
    onChangeProfile: onChangeProfile,
    enableProfileConfiguration: enableProfileConfiguration,
    onCreateProfile: onCreateProfile,
    rows: rows,
    columns: columns,
    allowToDownloadCVS: allowToDownloadCVS,
    rows_extended: rows_extended
  }));
};

var _default = /*#__PURE__*/_react["default"].memo(TableHeader);

exports["default"] = _default;