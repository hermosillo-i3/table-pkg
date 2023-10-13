import React, { useEffect, useMemo } from 'react'
import InputField from "./InputField"
import {Icon} from 'semantic-ui-react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ItemTypes} from './Constants'
import {formatColumn as formatColumnUtils, isFunction} from "../utils/Utils";

import {
   useDrag, 
   useDrop, 
   // connectDragPreview
} from 'react-dnd'
import {isColumnEditable} from "../utils/column";

const faGripVertical = {
   prefix: 'fas',
   iconName: 'grip-vertical',
   icon: [320, 512, [], "f58e", "M40 352l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zm192 0l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zM40 320c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0zM232 192l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zM40 160c-22.1 0-40-17.9-40-40L0 72C0 49.9 17.9 32 40 32l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0zM232 32l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40z"]
};


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

const shouldRenderCell = (column, row) => {
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

const getDefaultValue = (format) => {
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

const rowFunctionComponent = (props) => {
   const {
      canDrag,
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
      shouldShowSelectIcon,
      styleTheme,
      is_selected,
   } = props;
   const [hasScrolled, setHasScrolled] = React.useState(false);
   const [rowRef, setRowRef] = React.useState(null);
   
   useEffect(() => {
      const shouldScroll = props.scrollTo === row.id;
      if (rowRef && shouldScroll && !hasScrolled) {
         rowRef.scrollIntoView({behavior: 'smooth'});
         setHasScrolled(true);
      }
   }, [row, props.scrollTo]);

   useEffect(() => {
      setHasScrolled(false);
   }, [props.scrollTo]);


   const className = useMemo(() => {
      let classname = 'Table-Row';
      if (props.is_selected) {
         classname += ` Table-Row-Selected Table-Row--depth-${depth} ${row.is_item ? 'Table-Row-Item' : ''}`
      } else {
         if (styleTheme) {

            if (styleTheme === 'striped') {
               // check if the number is odd
               if (rowIndex % 2 === 0) {
                  classname += rowIndex % 2 === 0 ? ` Table-Row--striped` : '';
               }
            }

         } else {
            classname += ` Table-Row--depth-${depth}`;
            classname += ignoreItemStyle ? ` Table-Row--depth-${depth}` : (`${row.is_item ? ` Table-Row-Item depth-${depth}` : ` Table-Row--depth-${depth}`}`);
            classname += isOver && canDrop ? ' Table-Row-Over' : '';

         }
      }
      
      return classname;
   }, [props.is_selected, customRowClass, styleTheme]);

   // Definimos los hooks useDrag y useDrop
   const [{ isDragging }, connectDragSource] = useDrag({
      type: ItemTypes.ROW,
      item: {
        row: row,
        type: props.type,
      },
      canDrag: (monitor) => {
        return props.canDrag ? props.canDrag(props, monitor) : false;
      },
      item: () => {
        return {
          row: row,
          type: props.type,
        };
      },
    });

    const [{ canDrop, isOver }, connectDropTarget] = useDrop({
      accept: ItemTypes.ROW,
      drop: (item) => {
        if (props.onDrop) {
          props.onDrop(item, row);
        }
      },
      canDrop: (monitor) => {
        return props.canDrop ? props.canDrop(props, monitor) : false;
      },
    });

   const {
      // cDP, 
      cDS, 
      cDT
   } = useMemo(() => {
      // let cDP;
      let cDS, cDT;
 
       if (!allowToDragRows) {
         //  cDP = item => item
          cDS = item => item
          cDT = item => item
 
       } else {
         //  cDP = connectDragPreview
          cDS = connectDragSource
          cDT = connectDropTarget
       }

      return {
         // cDP,
         cDS,
         cDT
      }
   }, [allowToDragRows]);

   const formatColumn = (format, value) => {
      return formatColumnUtils(format, value);
   }

   const onRowClick = (row) => {
      return (e) => {
         if (props.onRowClick) {
            e.preventDefault();
            props.onRowClick(row, e)
         }
      }
   }

   const onRowExpand = (row) => {
      if (props.onRowExpand) {
         return (e) => {
            props.onRowExpand(row, e)
         }
      }
   }

   const onRowSelect = (row) => {
      if (props.onRowSelect) {
         return (e) => {
            props.onRowSelect(row, e.ctrlKey || e.metaKey)
         }
      }
   }

   const onCellClick = (column, row, colIndex, rowIndex, e) => {
      e.target.addEventListener('copy', (event) => {
         const selection = document.getSelection();
         let value = selection.toString() !== "" ? selection.toString() : row[column.assesor];
         event.clipboardData.setData('text/plain', value);
         event.preventDefault();
      });
      if (props.onCellClick) {
         props.onCellClick(column, row, colIndex, rowIndex)
      }
   };

   const onCellDoubleClick = (column, row, colIndex, rowIndex, e) => {
      if (props.onCellDoubleClick) {
         props.onCellDoubleClick(column, row, colIndex, rowIndex)
      }
   };

   const onCellContextMenu = (column, row, colIndex, rowIndex, e) => {
      if (props.onContextMenu) {
         if (column.filter) {
            e.preventDefault()
            props.onContextMenu(e.pageX, e.pageY, [{
               name: 'Aplicar filtro con este valor',
               icon: 'filter',
               action: () => {

                  const filterFunc = props.handleFilterColumn(column)
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


   const hasChildren = row.hasOwnProperty('_children') && row._children.length > 0
   const onFocus = (colIndex) => {
      if (props.onFocus)
         props.onFocus(props.index, colIndex);
   };

   const renderCell = (column, row, isCellActive, colIndex) => {
 
      if (shouldRenderCell(column, row)) {
         let value = row[column.assesor];
         const {editable} = column;
         const format = isFunction(column.format) ? column.format(row) : column.format;
         if (editable) {
            if (value == null) {
               value = getDefaultValue(format)
            }
            const is_editable = isColumnEditable(column, row);
            if (is_editable) {
               return (
                  <InputField
                     onFocus={() => onFocus(colIndex)}
                     isFocused={isCellActive}
                     format={format}
                     value={value}
                     limit={column.limit}
                     onKeyDown={(e, {value, resetValue}) => {
                        if (props.onKeyDown) {
                           props.onKeyDown(e, {column, row, value, resetValue})
                        }
                     }}
                     onKeyDownHotKeys={props.onKeyDownHotKeys}
                     onUpdate={props.onUpdateRow ? (value, resetValue) => {
                        props.onUpdateRow(column, row, value, resetValue)
                     } : undefined}
                     onPaste={(e) => {
                        if (props.onPaste) {
                           props.onPaste(e, column, row);
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
                  value = formatColumn(format, value)
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
               value = formatColumn(format, value)
            }

            return <div className={`left-align-flex value ${column.customColumnClass} expanded-column`}>
               <span className={`${column.compressLongText ? 'compress-row' : ''}`}>{value}</span></div>;
         }
      }

   };

    const scrollTo = (ref) => {
      setRowRef(ref);
   }

    return cDT(
      // cDP(
      <tr
         ref={scrollTo}
         className={className + ' tr_shaded'}
         onClick={props.onRowClick ? onRowClick(row) : undefined}
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
               onClick={onRowSelect(row)}
               style={{
                  width: 25,
                  flex: `25 0 auto`,
                  maxWidth: 25,
                  cursor: canDrag ? 'grab' : 'default',
               }}
            >
               <div className="middle-align-flex">
               {canDrag && <span className="drag-drop-icon">
                     <FontAwesomeIcon icon={faGripVertical} size="1x"/>
                  </span>}
                  {(!canDrag && shouldShowSelectIcon) && <>
                        {is_selected ? 
                        <Icon color = 'black' name={'check square outline'}/> : 
                        <Icon color = {row.is_item ? 'black' : 'white'} name={'square outline'}/>}
                     </>}
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
                     onClick={(e) => onCellClick(col, row, colIndex, rowIndex, e)}
                     onDoubleClick={(e) => onCellDoubleClick(col, row, colIndex, rowIndex, e)}
                     onContextMenu={(e) => onCellContextMenu(col, row, colIndex, rowIndex, e)}
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
                                onClick={onRowExpand(row)}>
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
                     onClick={(e) => onCellClick(col, row, colIndex, rowIndex, e)}
                     onDoubleClick={(e) => onCellDoubleClick(col, row, colIndex, rowIndex, e)}
                     onContextMenu={(e) => onCellContextMenu(col, row, colIndex, rowIndex, e)}
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
                                onClick={onRowExpand(row)}>
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
                        {renderCell(col, row, cellActive === colIndex, colIndex)}
                     </div>

                  </td>
               )

            )
         })}
      </tr>
   // )
   )
}

export default rowFunctionComponent;
