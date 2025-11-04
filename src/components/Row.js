import React, { useEffect, useMemo } from 'react'
import InputField from "./InputField"
import {Icon, Popup} from 'semantic-ui-react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ItemTypes} from './Constants'
import {formatColumn as formatColumnUtils, isFunction, formatForSelect} from "../utils/Utils";

import {
   useDrag,
   useDrop,
   // connectDragPreview
   useDragDropManager,
} from 'react-dnd'
import {isColumnEditable} from "../utils/column";

const faGripVertical = {
   prefix: 'fas',
   iconName: 'grip-vertical',
   icon: [320, 512, [], "f58e", "M40 352l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zm192 0l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zM40 320c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0zM232 192l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zM40 160c-22.1 0-40-17.9-40-40L0 72C0 49.9 17.9 32 40 32l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0zM232 32l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40z"]
};


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
   let isValueValid = false;
   switch(typeof row[column.assesor]) {
      case 'number':
         isValueValid = true;
         break;
      case 'boolean':
         isValueValid = true;
         break;
      default:
         isValueValid = column.editable ? true : !!row[column.assesor]
   }
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
      allowNewRowSelectionProcess,
      addReadOnlyStyle,
   } = props;
   const [hasScrolled, setHasScrolled] = React.useState(false);
   const [rowRef, setRowRef] = React.useState(null);
   const [className, setClassName] = React.useState('Table-Row');
   const [hoveredCellIndex, setHoveredCellIndex] = React.useState(null);

   useEffect(() => {
      const shouldScroll = props.scrollTo === row.id;
      if (rowRef && shouldScroll && !hasScrolled) {
         rowRef.scrollIntoView({behavior: 'smooth'});
         setHasScrolled(true);
      }
   }, [row, props.scrollTo, rowRef]);

   useEffect(() => {
      setHasScrolled(false);
   }, [props.scrollTo]);


   // Definimos los hooks useDrag y useDrop
   const [{ isDragging, canDrag }, connectDragSource] = useDrag({
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
      collect: (monitor) => ({
         isDragging: monitor.isDragging(),
         canDrag: props.canDrag ? props.canDrag(props, monitor) : false,
      }),
   });

   const [{isOver, canDrop}, connectDropTarget] = useDrop({
      accept: ItemTypes.ROW,
      drop: (item) => {
         if (props.onDrop) {
            props.onDrop(item, row);
         }
      },
      canDrop: (item, monitor) => {
         const canBeDropped = props.canDrop ? props.canDrop(props, item) : false;
         return canBeDropped
      },
      collect: (monitor) => ({
         isOver: monitor.isOver({ shallow: true }),
         canDrop: (props.canDrop && monitor.getItem()) ? props.canDrop(props, monitor.getItem()) : false,
      }),
   });

   useEffect(() => {
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
         }

         if (canDrop && isOver) {
            classname += ' Table-Row-Over'
         }
      }

      if (customRowClass) {
         classname += ' ' + customRowClass(row)
      }

      if (addReadOnlyStyle && row.is_item) {
         classname += ' Table-Row-ReadOnly'
      }

      setClassName(classname);
   }, [props.is_selected, styleTheme, rowIndex, row.is_item, depth, customRowClass, isOver, canDrop, addReadOnlyStyle]);

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
            e.stopPropagation();
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
         // Check if click is on a Popover
         const isPopoverClick = e.target.closest('[data-popover], .ui.popup');
         if (props.allowNewRowSelectionProcess && !isPopoverClick) {
            props.onRowSelect(row, e.ctrlKey || e.metaKey)
         }
      }
   };

   const onCellDoubleClick = (column, row, colIndex, rowIndex, e) => {
      if (props.onCellDoubleClick) {
         props.onCellDoubleClick(column, row, colIndex, rowIndex)
      }
   };

   const onCellContextMenu = (column, row, colIndex, rowIndex, e) => {
      if (props.onContextMenu) {
         const colFormat =
            typeof column.format === "object"
               ? column.format.type
               : column.format;
         const validFormatsToApplyFilter = ["text", "textarea", "currency", "search", "number", "percentage"];
         if (column.filter && validFormatsToApplyFilter.includes(colFormat)) {
            e.preventDefault();
            props.onContextMenu(e.pageX, e.pageY, [
               {
                  name: "Aplicar filtro con este valor",
                  icon: "filter",
                  action: () => {
                     const filterFunc = props.handleFilterColumn(column);

                     if (colFormat === "text" || colFormat === "textarea") {
                        filterFunc(row[column.assesor]);
                     } else if (colFormat === "currency") {
                        filterFunc({
                           max: null,
                           min: null,
                           equal: row[column.assesor],
                        });
                     } else if (colFormat === "search") {
                        filterFunc([row[column.assesor]]);
                     } else if (colFormat === "number" || colFormat === "percentage") {
                        // For numeric formats, find the appropriate range for this value
                        const cellValue = row[column.assesor];
                        
                        // Get default ranges based on format type
                        const getDefaultRanges = () => {
                           if (colFormat === 'percentage') {
                              return [
                                 { start: 0, end: 25, label: '0%-25%' },
                                 { start: 26, end: 50, label: '26%-50%' },
                                 { start: 51, end: 75, label: '51%-75%' },
                                 { start: 76, label: '76%+' }
                              ];
                           } else {
                              return [
                                 { start: 0, end: 7, label: '0-7' },
                                 { start: 8, end: 15, label: '8-15' },
                                 { start: 16, label: '16+' }
                              ];
                           }
                        };
                        
                        const ranges = column.format?.ranges || getDefaultRanges();
                        
                        // Find the range that contains this value
                        const matchingRange = ranges.find(range => {
                           if (range.end !== undefined) {
                              // Standard range with start and end
                              return cellValue >= range.start && cellValue <= range.end;
                           } else {
                              // Start-only range (greater than or equal)
                              return cellValue >= range.start;
                           }
                        });
                        
                        if (matchingRange) {
                           filterFunc(matchingRange);
                        }
                     }
                  },
               },
            ]);
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
                  <div
                     onMouseEnter={() => setHoveredCellIndex(colIndex)}
                     onMouseLeave={() => setHoveredCellIndex(null)}
                     onClick={(e) => {
                        // Only prevent row selection if clicking directly on input elements
                        const isDirectInputClick = e.target.matches('input, textarea, select') || 
                           e.target.closest('.InputField, .react-datepicker-wrapper, .table-datepicker-wrapper, .cleave-input, .InputField-Boolean');
                        if (isDirectInputClick) {
                           e.stopPropagation();
                        } else if (allowNewRowSelectionProcess && props.onRowSelect) {
                           props.onRowSelect(row, e.ctrlKey || e.metaKey);
                           e.stopPropagation();
                        }
                     }}
                     style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        paddingLeft: allowNewRowSelectionProcess ? '0.5rem' : '0rem',
                        paddingRight: allowNewRowSelectionProcess ? '1rem' : '0rem',
                        height: allowNewRowSelectionProcess ? 'auto' : '100%',
                     }}
                  >
                     <InputField
                        isItem={row.is_item}
                        onFocus={() => onFocus(colIndex)}
                        onUnfocusOthers={() => {
                           // Clear focus by calling onFocus with invalid indexes to unfocus current cell
                           if (props.onUnfocus) {
                              props.onUnfocus();
                           }
                        }}
                        isFocused={isCellActive}
                        format={format}
                        value={value}
                        limit={column.limit}
                        columnWidth={column.width}
                        hasExpandIcon={!row.is_item && colIndex === expandCollapseColumnIndex && hasChildren}
                        onKeyDown={(e, options) => {
                           const { value, resetValue } = options;
                           props.onKeyDown(e, { column, row, value, resetValue })
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
                        tabIndex={props.getTabIndex ? props.getTabIndex(row, colIndex) : -1}
                        filter_hermosillo_non_working_days={props.filter_hermosillo_non_working_days}
                        allowNewRowSelectionProcess={allowNewRowSelectionProcess}
                        colIndex={colIndex}
                        hoveredCellIndex={hoveredCellIndex}
                     />
                  </div>
               )
            } else {
               if (column.hasOwnProperty('format')) {
                  const type = typeof format === 'string' ? format : format.type;
                  if (type === 'boolean') {
                     if (value) {
                        return format.trueIcon ? format.trueIcon({isItem: row.is_item}) : <Icon
                        style={{margin: 'auto', color: row.is_item ? 'black' : 'grey'}}
                        name={'checkmark'}
                     />
                     } else {
                        return format.falseIcon ? format.falseIcon({isItem: row.is_item}) : ''
                     }
                  }
                  value = formatColumn(format, value)
               }

               return <div
                  className={`left-align-flex value ${column.customColumnClass}`}
                  style={{
                     cursor: allowNewRowSelectionProcess ? 'pointer' : 'default',
                  }}
                  onClick={(e) => {
                     if (allowNewRowSelectionProcess && props.onRowSelect) {
                        e.stopPropagation();
                        props.onRowSelect(row, e.ctrlKey || e.metaKey);
                     }
                  }}
               >
                  <span>{value}</span></div>;
            }


         } else {
            if (column.hasOwnProperty('format')) {
               const type = typeof format === 'string' ? format : format.type;
               if (type === 'boolean') {
                  if (value) {
                     return format.trueIcon ? format.trueIcon({isItem: row.is_item}) : <Icon
                     style={{margin: 'auto', color: row.is_item ? 'black' : 'grey'}}
                     name={'checkmark'}
                  />
                  } else {
                     return format.falseIcon ? format.falseIcon({isItem: row.is_item}) : ''
                  }
               }
               value = formatColumn(format, value)
            }

            return <div
               className={`left-align-flex value ${column.customColumnClass} expanded-column`}
               style={{
                  cursor: allowNewRowSelectionProcess ? 'pointer' : 'default',
               }}
               onClick={(e) => {
                  if (allowNewRowSelectionProcess && props.onRowSelect) {
                     e.stopPropagation();
                     props.onRowSelect(row, e.ctrlKey || e.metaKey);
                  }
               }}
            >
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
                        <Icon color = 'black' name={'check square outline'} style={{"marginBottom": '0.63em' }}/> : 
                        <Icon color = {row.is_item ? 'black' : 'grey'} name={'square outline'} style={{"marginBottom": '0.63em' }}/>}
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
            const customColumnClass = col.className ? col.className : '';
            const columnClass = col.columnClass ? isFunction(col.columnClass) ? col.columnClass(col, row) : col.columnClass : '';
            const readOnlyColumnClass = addReadOnlyStyle ? 'Table-Row-ReadOnly' : '';
            let cellContent = col.Cell ? col.Cell(row) : null;
            let cellToRender = (col.Cell && cellContent !== null && cellContent !== undefined ? (
               <td
                  onClick={(e) => onCellClick(col, row, colIndex, rowIndex, e)}
                  onDoubleClick={(e) => onCellDoubleClick(col, row, colIndex, rowIndex, e)}
                  onContextMenu={(e) => onCellContextMenu(col, row, colIndex, rowIndex, e)}
                  key={colIndex}
                  style={{
                     width: col.width,
                     flex: `${col.width} 0 auto`,
                     maxWidth: col.width,
                     overflow: col.overflow ? col.overflow : 'inherit',
                     cursor: allowNewRowSelectionProcess ? 'pointer' : 'default',
                  }}
                  className={`cell ${customColumnClass} ${columnClass} ${readOnlyColumnClass} ${cellActive === colIndex ? 'cell-active' : ''} ${col.onDraggingVisible ? "on-dragging-available dragging-td-value" : ""} ${col.freeze ? 'fixed freeze_horizontal' : ''} ${customColumnClass}`}
               >
                  <div
                     className={`flex ${colIndex === expandCollapseColumnIndex && hasChildren ? "expand-column" : ""} ${readOnlyClass}`}
                        style={{
                           whiteSpace: 'pre-wrap',
                           wordBreak: 'break-word',
                           overflow: 'hidden',
                        }}
                     >
                     {!row.is_item && colIndex === expandCollapseColumnIndex &&
                        <div className={`Table-Column-${is_open ? 'Expanded' : 'Contracted'}`}
                           onClick={onRowExpand(row)}>
                           {hasChildren && (
                              is_open ? (
                                 <Icon className="icon-collapse" disabled
                                    name='minus square outline'/>
                              ) : (
                                 <Icon className="icon-expand" disabled
                                    name='plus square outline' />
                              )
                           )}


                        </div>
                     }
                     {<React.Fragment>{cellContent}</React.Fragment>}
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
                  className={`cell ${columnClass} ${readOnlyColumnClass} ${cellActive === colIndex ? 'cell-active' : ''} ${col.onDraggingVisible ? "on-dragging-available dragging-td-value" : ""} ${col.freeze ? 'fixed freeze_horizontal' : ''} ${customColumnClass}`}
               >
                  <div
                     className={`flex ${readOnlyClass} ${colIndex === expandCollapseColumnIndex && hasChildren ? "expand-column" : ""}`}
                     style={{
                        cursor: allowNewRowSelectionProcess ? 'pointer' : 'default'
                     }}
                     onClick={(e) => {
                        // Only prevent row selection if clicking directly on input elements
                        const isDirectInputClick = e.target.matches('input, textarea, select') || 
                           e.target.closest('.InputField, .react-datepicker-wrapper, .table-datepicker-wrapper, .cleave-input, .InputField-Boolean');
                        if (isDirectInputClick) {
                           e.stopPropagation();
                        } else if (allowNewRowSelectionProcess && props.onRowSelect) {
                           e.stopPropagation();
                           props.onRowSelect(row, e.ctrlKey || e.metaKey);
                        }
                     }}
                  >

                     {!row.is_item && colIndex === expandCollapseColumnIndex &&
                        <div className={`Table-Column-${is_open ? 'Expanded' : 'Contracted'}`}
                           onClick={onRowExpand(row)}>
                           {hasChildren && (
                              is_open ? (
                                 <Icon className="icon-collapse" disabled
                                    name='minus square outline' />
                              ) : (
                                 <Icon className="icon-expand" disabled
                                    name='plus square outline' />
                              )
                           )}


                        </div>
                     }
                     {renderCell(col, row, cellActive === colIndex, colIndex)}
                  </div>

               </td>
            )

            )

            if ('popupInCell' in col) {
               // Parameters: Content (it can be a function that returns a component or a String), Position, Inverted
               let content = '';
               let position = 'position' in col.popupInCell ? col.popupInCell.position :'top center';
               let inverted = 'inverted' in col.popupInCell ? col.popupInCell.inverted : false;

               if ('content' in col.popupInCell && typeof col.popupInCell.content === 'function') {
                  content = col.popupInCell.content(row)
               } else {
                  content = col.popupInCell.content;
               }

               cellToRender = <Popup content={content} position={position} inverted={inverted} trigger={cellToRender} />
            }

            return cellToRender;
         })}
      </tr>
      // )
   )
}

export default rowFunctionComponent;
