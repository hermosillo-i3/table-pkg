"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDnd = require("react-dnd");

var _Constants = require("./Constants");

var _EmptyStateCard = _interopRequireDefault(require("./EmptyStateCard"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var dropConnector = {
  drop: function drop(props, monitor) {
    // Obtain the dragged item
    var item = monitor.getItem();

    if (props.onDrop) {
      props.onDrop(item, props.row, props.isCtrlPressed);
    }
  },
  canDrop: function canDrop(props, monitor) {
    if (props.canDrop) {
      return props.canDrop(props, monitor);
    }

    return false;
  }
};

function dropCollector(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  };
}

var NoRowsCard = function NoRowsCard(_ref) {
  var noRowsMessage = _ref.noRowsMessage,
      connectDropTarget = _ref.connectDropTarget,
      isOver = _ref.isOver,
      canDrop = _ref.canDrop;
  var title = noRowsMessage ? noRowsMessage.title : 'Empty table';
  var subtitle = noRowsMessage ? noRowsMessage.subtitle : '';
  var icon = noRowsMessage ? noRowsMessage.icon : 'tools';
  var isMultiple = noRowsMessage ? noRowsMessage.isMultiple : false;
  return /*#__PURE__*/_react["default"].createElement("tr", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/_react["default"].createElement("td", {
    style: {
      margin: 'auto',
      padding: '1.5rem 0'
    }
  }, connectDropTarget( /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_EmptyStateCard["default"], {
    icon: icon,
    isOver: isOver,
    isMultiple: isMultiple,
    canDrop: canDrop,
    title: title,
    subtitle: subtitle
  })))));
};

var _default = (0, _reactDnd.DropTarget)(_Constants.ItemTypes.ROW, dropConnector, dropCollector)(NoRowsCard);

exports["default"] = _default;