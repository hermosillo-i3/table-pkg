import React from 'react'
import InputField from "./InputField"
import {Icon} from 'semantic-ui-react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGripVertical} from "@fortawesome/free-solid-svg-icons";
import flow from 'lodash/flow'
import {ItemTypes} from './Constants'
import {formatColumn, isFunction} from "../utils/Utils";

import {DragSource, DropTarget} from 'react-dnd'
import {isColumnEditable} from "../utils/column";


const RowTarget = {
   drop(props, monitor) {

      // Obtain the dragged item
      const item = monitor.getItem()

      if (props.onDrop) {
         props.onDrop(item, props.row)
      }
   },
   canDrop(props, monitor) {
      if (props.canDrop) {
         return props.canDrop(props, monitor)
      }
      return false
   }
};

const RowSource = {
   canDrag(props, monitor) {
      if (props.canDrag) {
         return props.canDrag(props, monitor)
      }
      return false
   },

   beginDrag(props) {
      return {
         row: props.row,
         type: props.type
      }
   }
}

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
   }
}


const getItemStyle = (isDragging, draggableStyle) => ({
   // some basic styles to make the items look a bit nicer
   userSelect: 'none',
   // change background colour if dragging
   background: isDragging ? '#edf7ff' : '',
   borderLeft: isDragging ? '3px solid #1f76b7' : '',
   textAlign: isDragging ? 'left' : '',

   // styles we need to apply on draggables
   ...draggableStyle,
});

class Row extends React.Component {

   constructor(props) {
      super(props)
      this.state = {
         hasScrolled: false,
      }
   }

   componentDidUpdate = (prevProps, prevState) => {

      const shouldScroll = this.props.scrollTo === this.props.row.id;

      if (this.rowRef && shouldScroll && !this.state.hasScrolled) {
         this.rowRef.scrollIntoView()
         this.setState((prevState) => ({
            hasScrolled: true
         }))
      }

      if (prevProps.scrollTo !== this.props.scrollTo) {
         this.setState((prevState) => ({
            hasScrolled: false
         }))
      }
   }

   formatColumn = (format, value) => {
      return formatColumn(format, value)
   };

   onRowClick = row => {
      return e => {
         e.preventDefault();
         this.props.onRowClick(row)
      }
   };

   onRowExpand = row => {
      if (this.props.onRowExpand) {
         return e => {
            this.props.onRowExpand(row)
         }
      }

   };

   onRowSelect = row => {
      if (this.props.onRowSelect) {
         return e => {
            this.props.onRowSelect(row, e.ctrlKey || e.metaKey)
         }
      }
   };

   onCellClick = (column, row, colIndex, rowIndex, e) => {
      e.target.addEventListener('copy', (event) => {
         const selection = document.getSelection();
         let value = selection.toString() !== "" ? selection.toString() : row[column.assesor];
         event.clipboardData.setData('text/plain', value);
         event.preventDefault();
      });
      if (this.props.onCellClick) {
         this.props.onCellClick(column, row, colIndex, rowIndex)
      }
   };

   onCellDoubleClick = (column, row, colIndex, rowIndex, e) => {
      if (this.props.onCellDoubleClick) {
         this.props.onCellDoubleClick(column, row, colIndex, rowIndex)
      }
   };

   onCellContextMenu = (column, row, colIndex, rowIndex, e) => {
      if (this.props.onContextMenu) {
         if (column.filter) {
            e.preventDefault()
            this.props.onContextMenu(e.pageX, e.pageY, [{
               name: 'Aplicar filtro con este valor',
               icon: 'filter',
               action: () => {

                  const filterFunc = this.props.handleFilterColumn(column)
                  const colFormat = column.format ?? 'text'
                  if (colFormat === 'text' || colFormat === 'textarea') {

                     filterFunc(row[column.assesor])
                  } else if (colFormat === 'currency') {
                     filterFunc({
                        max: null,
                        min: null,
                        equal: row[column.assesor],
                     })
                  }
               }
            }])
         }

      }
   }

   shouldRenderCell = (column, row) => {
      let isValueValid = typeof row[column.assesor] === "number" ? true : (column.editable ? true : !!row[column.assesor]);
      let shouldRender = false;

      if (column.onlyItems) {
         shouldRender = row.is_item;
      } else if (column.onlyHeaders) {
         shouldRender = !row.is_item
      } else {
         shouldRender = true
      }

      return (!!isValueValid && shouldRender)
   };

   getDefaultValue = (format) => {
      switch (format) {
         case 'text':
            return '';
         case 'number':
            return 0;
         case 'currency':
            return 0;
         case 'textarea':
            return ''
         default:
            return '';
      }
   };
   onFocus = (colIndex) => {
      if (this.props.onFocus)
         this.props.onFocus(this.props.index, colIndex);
   };

   renderCell = (column, row, isCellActive, colIndex) => {

      if (this.shouldRenderCell(column, row)) {
         let value = row[column.assesor];
         const {editable} = column;
         const format = isFunction(column.format) ? column.format(row) : column.format;
         if (editable) {
            if (value == null) {
               value = this.getDefaultValue(format)
            }
            const is_editable = isColumnEditable(column, row);
            if (is_editable) {
               return (
                  <InputField
                     onFocus={() => this.onFocus(colIndex)}
                     isFocused={isCellActive}
                     format={format}
                     value={value}
                     limit={column.limit}
                     onKeyDown={(e, {value, resetValue}) => {
                        if (this.props.onKeyDown) {
                           this.props.onKeyDown(e, {column, row, value, resetValue})
                        }
                     }}
                     onKeyDownHotKeys={this.props.onKeyDownHotKeys}
                     onUpdate={this.props.onUpdateRow ? (value, resetValue) => {
                        this.props.onUpdateRow(column, row, value, resetValue)
                     } : undefined}
                     onPaste={(e) => {
                        if (this.props.onPaste) {
                           this.props.onPaste(e, column, row);
                        }
                     }}
                     customProps={column.customProps}
                     customColumnClass={column.customColumnClass}
                     compressLongText={column.compressLongText}
                  />
               )
            } else {
               if (column.hasOwnProperty('format')) {
                  if (format === 'boolean' && value) {
                     return <Icon
                        style={{margin: 'auto'}}
                        name={'checkmark'}
                     />
                  }
                  value = this.formatColumn(format, value)
               }

               return <div className={`left-align-flex value ${column.customColumnClass}`}>
                  <span>{value}</span></div>;
            }


         } else {
            if (column.hasOwnProperty('format')) {
               if (format === 'boolean' && value) {
                  return <Icon
                     style={{margin: 'auto'}}
                     name={'checkmark'}
                  />
               }
               value = this.formatColumn(format, value)
            }

            return <div className={`left-align-flex value ${column.customColumnClass} expanded-column`}>
               <span className={`${column.compressLongText ? 'compress-row' : ''}`}>{value}</span></div>;
         }
      }

   };

   render() {
      const {
         connectDragPreview,
         connectDragSource,
         connectDropTarget,
         isOver,
         isDragging,
         canDrag,
         canDrop,

         allowToDragRows = true,
         index: rowIndex,
         row,
         is_open,
         columns,
         depth,
         cellActive,
         customRowClass,
         ignoreItemStyle,
         expandCollapseColumnIndex,
         isDragColumnVisible,
         styleTheme
      } = this.props;


      const hasChildren = row.hasOwnProperty('_children') && row._children.length > 0

      //  Styles

      let className = `Table-Row`;

      if (this.props.is_selected) {
         className += ` Table-Row-Selected Table-Row--depth-${depth} ${row.is_item ? 'Table-Row-Item' : ''}`
      } else {
         if (styleTheme) {

            if (styleTheme === 'striped') {
               // check if the number is odd
               if (rowIndex % 2 === 0) {
                  className += rowIndex % 2 === 0 ? ` Table-Row--striped` : '';
               }
            }

         } else {
            className += ` Table-Row--depth-${depth}`;
            className += ignoreItemStyle ? ` Table-Row--depth-${depth}` : (`${row.is_item ? ` Table-Row-Item depth-${depth}` : ` Table-Row--depth-${depth}`}`);
            className += isOver && canDrop ? ' Table-Row-Over' : '';

         }
      }

      if (customRowClass) {
         className += ' ' + customRowClass(row)
      }

      let cDP, cDS, cDT;

      if (!allowToDragRows) {
         cDP = item => item
         cDS = item => item
         cDT = item => item

      } else {
         cDP = connectDragPreview
         cDS = connectDragSource
         cDT = connectDropTarget
      }

      const scrollTo = (ref) => {
         this.rowRef = ref;
      }


      return cDT(cDP(
         <tr
            ref={scrollTo}
            className={className + ' tr_shaded'}
            onClick={this.props.onRowClick ? this.onRowClick(row) : undefined}
            key={rowIndex}
            style={getItemStyle(
               isDragging,
               null
            )}
         >
            {isDragColumnVisible && cDS(
               <td
                  className={`
                  ${canDrag ? ' drag-drop-td on-dragging-available' : 'not-drag-drop-row'}
                  ${columns && columns[0]?.freeze ? 'freeze_horizontal' : ''}
                  `}
                  onClick={this.onRowSelect(row)}
                  style={{
                     width: 25,
                     flex: `25 0 auto`,
                     maxWidth: 25,
                     cursor: canDrag ? 'grab' : 'default',
                  }}
               >
                  <div className="middle-align-flex">
                     <span className="drag-drop-icon">
                        <FontAwesomeIcon icon={faGripVertical} size="1x"/>
                     </span>
                  </div>
               </td>
            )}

            {columns.map((col, colIndex) => {
               let is_editable = col.editable
               if (is_editable) {
                  is_editable = isColumnEditable(col, row);
               }
               const readOnlyClass = !is_editable ? 'cell-read-only' : '';
               const columnClass = col.columnClass ? isFunction(col.columnClass) ? col.columnClass(col, row) : col.columnClass : '';
               return (col.Cell ? (
                     <td
                        onClick={(e) => this.onCellClick(col, row, colIndex, rowIndex, e)}
                        onDoubleClick={(e) => this.onCellDoubleClick(col, row, colIndex, rowIndex, e)}
                        onContextMenu={(e) => this.onCellContextMenu(col, row, colIndex, rowIndex, e)}
                        key={colIndex}
                        style={{
                           width: col.width,
                           flex: `${col.width} 0 auto`,
                           maxWidth: col.width,
                           overflow: col.overflow ? col.overflow : 'inherit'
                        }}
                        className={`cell ${columnClass} ${cellActive === colIndex ? 'cell-active' : ''} ${col.onDraggingVisible ? "on-dragging-available dragging-td-value" : ""} ${col.freeze ? 'fixed freeze_horizontal' : ''}`}
                     >
                        <div
                           className={`flex ${colIndex === expandCollapseColumnIndex && hasChildren ? "expand-column" : ""} ${readOnlyClass}`}>
                           {!row.is_item && colIndex === expandCollapseColumnIndex &&
                              <div className={`Table-Column-${is_open ? 'Expanded' : 'Contracted'}`}
                                   onClick={this.onRowExpand(row)}>
                                 {hasChildren && (
                                    is_open ? (
                                       <Icon className="icon-collapse" disabled
                                             name='minus square outline'/>
                                    ) : (
                                       <Icon className="icon-expand" disabled
                                             name='plus square outline'/>
                                    )
                                 )}


                              </div>
                           }
                           {<React.Fragment>{col.Cell(row)}</React.Fragment>}
                        </div>
                     </td>

                  ) : (
                     <td
                        onClick={(e) => this.onCellClick(col, row, colIndex, rowIndex, e)}
                        onDoubleClick={(e) => this.onCellDoubleClick(col, row, colIndex, rowIndex, e)}
                        onContextMenu={(e) => this.onCellContextMenu(col, row, colIndex, rowIndex, e)}
                        key={colIndex}
                        style={{
                           width: col.width,
                           flex: `${col.width} 0 auto`,
                           maxWidth: col.width,
                           overflow: col.overflow ? col.overflow : 'inherit'
                        }}
                        className={`cell ${columnClass} ${cellActive === colIndex ? 'cell-active' : ''} ${col.onDraggingVisible ? "on-dragging-available dragging-td-value" : ""} ${col.freeze ? 'fixed freeze_horizontal' : ''}`}
                     >
                        <div
                           className={`flex ${readOnlyClass} ${colIndex === expandCollapseColumnIndex && hasChildren ? "expand-column" : ""}`}>

                           {!row.is_item && colIndex === expandCollapseColumnIndex &&
                              <div className={`Table-Column-${is_open ? 'Expanded' : 'Contracted'}`}
                                   onClick={this.onRowExpand(row)}>
                                 {hasChildren && (
                                    is_open ? (
                                       <Icon className="icon-collapse" disabled
                                             name='minus square outline'/>
                                    ) : (
                                       <Icon className="icon-expand" disabled
                                             name='plus square outline'/>
                                    )
                                 )}


                              </div>
                           }
                           {this.renderCell(col, row, cellActive === colIndex, colIndex)}
                        </div>

                     </td>
                  )

               )
            })}
         </tr>
      ))
   }
}

const component = flow(
   DragSource(ItemTypes.ROW, RowSource, collectSource),
   DropTarget(ItemTypes.ROW, RowTarget, collectTarget)
)(Row)
export default component;
