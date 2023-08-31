import React from 'react'
import PropTypes from 'prop-types'
import { Button, Popup, Icon, Dimmer, Loader } from "semantic-ui-react";
import { HotKeys, configure } from "react-hotkeys";
import { v4 as uuidv4 } from 'uuid';

import Row from "../Row"
import Settings from "../Settings";
import NoRowsCard from "../NoRowsCard";
import TableHeader from "../Header";
import DropZone from "../DropZone";
import FilterColumn from "../FilterColumn";
import ContextMenu from "../ContextMenu/ContextMenu";
import { isEqual, pad, isNumber, removeSpecialCharacters, getAllChildren, getAllParents } from "../../utils/Utils";
import { getClipboardTextFromExcel, hasOwnProperty, replaceAll, KEY_CODES, calculateGranTotal, formatPastingRows } from "../../utils/index";
import {
   flatColumns,
   generateGroupColumns,
   isColumnEditable,
   mergeColumnsWithProperties,
   generateExtraColumnProperties
} from "../../utils/column";
import { generateCode } from '../../utils/Utils';

import "./Table.scss";
import { addFreezeColumns } from "../../utils/table-utils";
import DragDropContext from '../DragDropContext';

configure({
   ignoreTags: [],
   allowCombinationSubmatches: true,
});

const keyMap = {
   MOVE_UP: "up",
   MOVE_DOWN: ['down', 'enter'],
   CREATE_NEW: 'command+enter',
};

const KEY_EVENT = {
   38: 'MOVE_UP',
   40: 'MOVE_DOWN',
   13: 'MOVE_DOWN',
};

const generateRowsToExpand = (expandRows) => {
   // Construct the object to expand the rows
   return expandRows.reduce((acum, row_id) => {
      return {
         ...acum,
         [row_id]: { is_open: true, should_render: true }
      }
   }, {});
};

class Table extends React.Component {

   constructor(props) {
      super(props);

      this.internal_columns = [{
         Header: 'Code',
         assesor: 'Internal_Table_Code',
         width: 100
      }];


      this.state = {
         structure: [],
         open_rows: {},
         rows_extended: generateRowsToExpand(props.expandRows),
         column_extended: this.generateColumnExtended(),
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
         name: props.name || uuidv4(),
         contextMenu: {
            visible: false,
            x: 0,
            y: 0,
            actions: []
         }
      };

      this.container = React.createRef();
      this.tableHeader = React.createRef();
      this.tableToolbar = React.createRef();
   }

   keyBoardHandlers = {
      MOVE_UP: event => {
         event.preventDefault();
         if (this.state.cellActive.row - 1 >= 1) {
            this.keyboardKeyHandleMove(-1);
         }
      },
      MOVE_DOWN: event => {
         if (!(event.shiftKey && event.keyCode === 13)) {
            event.preventDefault();
            if (this.state.cellActive.row <= this.state.rendered_rows.length - 1) {
               this.keyboardKeyHandleMove(1);
            }
         }
      },
      CREATE_NEW: event => {
         event.preventDefault();
         if (this.props.onAddNew)
            this.props.onAddNew(this.state.cellActive.row_id);
      },

   };

   componentDid

   onKeyDown = (...args) => {
      if (this.props.onKeyDown) {
         this.props.onKeyDown(...args);
      }
   };

   onKeyDownHotKeys = (e) => {
      if (e.target.type === 'textarea') {
         if (!e.shiftKey && e.keyCode === KEY_CODES.ENTER) {
            e.preventDefault();
            this.keyboardKeyHandleMove(1);
            e.stopPropagation();
         }
      } else if (e.keyCode === KEY_CODES.ARROW_UP || e.keyCode === KEY_CODES.ARROW_DOWN || e.keyCode === KEY_CODES.ENTER) {
         this.keyBoardHandlers[KEY_EVENT[e.keyCode]](e);
         e.stopPropagation();
      }
   };

   keyboardKeyHandleMove = (movePosition) => {
      const { rows } = this.props;
      const { rendered_rows, cellActive } = this.state;
      const minRows = 0;
      const maxRows = rendered_rows.length;
      const { cell, row: rowPosition } = cellActive;
      let newRowIndex = rowPosition - 1;
      let newMovePosition = 0;
      const columns = this.getVisibleColumns();
      const column = columns[cell];
      let is_editable = false;
      do {
         newRowIndex = newRowIndex + movePosition;
         newMovePosition = newMovePosition + movePosition;
         const rowId = rendered_rows[newRowIndex];
         const row = rows[rowId];
         is_editable = isColumnEditable(column, row);
      } while (!is_editable && newRowIndex >= minRows && newRowIndex < maxRows);
      if (newRowIndex >= minRows && newRowIndex < maxRows) {
         this.moveToRow(newMovePosition);
      }
   };

   onFocusRow = (rowIndex, cellIndex) => {
      if (this.state.cellActive.row !== rowIndex || this.state.cellActive.cell !== cellIndex) {
         this.setState((state) => {
            return {
               ...state,
               cellActive: {
                  ...state.cellActive,
                  row: rowIndex,
                  cell: cellIndex
               }
            }
         })
      }
   };


   moveToRow = (movePosition) => {
      this.setState((state) => {
         return {
            ...state,
            cellActive: {
               ...state.cellActive,
               row: state.cellActive.row + movePosition
            }
         }
      })
   };


   shouldComponentUpdate = (nextProps, nextState) => {

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

      if (nextState.profile_selected !== this.state.profile_selected)
         return true;

      if (JSON.stringify(this.props.profiles) !== JSON.stringify(nextProps.profiles)) {
         return true
      }

      if (JSON.stringify(this.props.rows) !== JSON.stringify(nextProps.rows)) {
         return true
      }

      if (this.props.type !== nextProps.type) {
         return true
      }

      if (JSON.stringify(this.props.columns) !== JSON.stringify(nextProps.columns)) {
         return true
      }

      if (JSON.stringify(this.props.selected_rows) !== JSON.stringify(nextProps.selected_rows)) {
         return true
      }

      if (JSON.stringify(this.props.selected_cell) !== JSON.stringify(nextProps.selected_cell)) {
         return true
      }

      if (JSON.stringify(this.props.isLoading) !== JSON.stringify(nextProps.isLoading)) {
         return true
      }

      if (JSON.stringify(this.state.rows_extended) !== JSON.stringify(nextState.rows_extended)) {
         return true
      }

      if (JSON.stringify(this.state.structure) !== JSON.stringify(nextState.structure)) {
         return true
      }

      if (JSON.stringify(this.state.is_setting_open) !== JSON.stringify(nextState.is_setting_open)) {
         return true
      }

      if (JSON.stringify(this.state.column_extended) !== JSON.stringify(nextState.column_extended)) {
         return true
      }

      if (JSON.stringify(this.state.cellActive) !== JSON.stringify(nextState.cellActive)) {
         return true
      }
      if (JSON.stringify(this.props.actions) !== JSON.stringify(nextProps.actions)) {
         return true
      }

      if (JSON.stringify(this.state.isCtrlPressed) !== JSON.stringify(nextState.isCtrlPressed)) {
         return true
      }

      if (this.props.title !== nextProps.title) {
         return true
      }
      if (this.props.sortChange !== nextProps.sortChange) {
         return true
      }
      if (this.state.sortMethod !== nextState.sortMethod) {
         return true
      }

      if (JSON.stringify(this.props.expandRows) !== JSON.stringify(nextProps.expandRows)) {
         return true
      }

      if (this.state.contextMenu.x !== nextState.contextMenu.x || this.state.contextMenu.y !== nextState.contextMenu.y) {
         return true
      }

      return false
   };

   handleCtrlKeyDown = ((event) => {
      const { ctrlKey, keyCode } = event;
      /* Key codes for mac cmd key
      * Firefox: 224
      * Opera: 17
      * WebKit browsers (Safari/Chrome): 91 (Left Command) or 93 (Right Command)
      */
      const cmdkey = keyCode === 91 || keyCode === 93 || keyCode === 17 || keyCode === 224;

      if (ctrlKey || cmdkey) {
         this.setState({
            isCtrlPressed: true,
         })
      }
   })

   handleCtrlKeyUp = ((event) => {
      const { ctrlKey, keyCode } = event;
      /* Key codes for mac cmd key
      * Firefox: 224
      * Opera: 17
      * WebKit browsers (Safari/Chrome): 91 (Left Command) or 93 (Right Command)
      */
      const cmdkey = keyCode === 91 || keyCode === 93 || keyCode === 17 || keyCode === 224;
      if (!ctrlKey || cmdkey) {
         this.setState({
            isCtrlPressed: false,
         })
      }
   })

   onClickOnDocument = () => {
      if (this.state.contextMenu.visible) {
         this.setState({
            contextMenu: {
               visible: false
            }
         })
      }
   }

   componentDidMount = () => {

      this.updateColumnsWidth();
      this.generateTableStructure();
      this.createDefaultValues();

      addFreezeColumns(this.state.name);

      document.addEventListener('keydown', this.handleCtrlKeyDown);
      document.addEventListener('keyup', this.handleCtrlKeyUp);
      document.addEventListener('click', this.onClickOnDocument);
      if (this.props.isExpandByDefault) {
         this.expandRows()
      }
   };

   createDefaultValues = () => {
      if (this.props.profiles) {
         const profileDefault = this.props.profiles.find((e) => e.is_default);
         if (this.state.profile_selected == null && profileDefault != null) {
            this.setState({
               profile_selected: profileDefault.id
            })
         }
      }
   };

   componentDidUpdate = (prevProps, prevState) => {
      console.log('Did update Table', this.props.type);
      // if (this.container.current.offsetWidth !== this.state.tableWidth) {
      //    // console.log(`There is a diference ${this.container.current.offsetWidth} - ${this.state.tableWidth}`)
      //    // this.updateColumnsWidth()
      // }

      if (
         JSON.stringify(prevProps.rows) !== JSON.stringify(this.props.rows) ||
         prevProps.sortChange !== this.props.sortChange ||
         prevState.sortMethod !== this.state.sortMethod ||
         JSON.stringify(prevState.column_extended) !== JSON.stringify(this.state.column_extended)
      ) {
         this.generateTableStructure();
         this.onNewRowExpand(prevProps, prevState);
      }

      if (JSON.stringify(prevProps.selected_cell) !== JSON.stringify(this.props.selected_cell)) {
         this.setState({
            cellActive: {
               ...this.props.selected_cell
            }
         });
      }

      if (!isEqual(prevProps.columns, this.props.columns)) {
         this.updateColumnsWidth({ forceUpdate: true })
      }

      if (prevProps.profileSelected !== this.props.profileSelected) {
         this.setState({
            profile_selected: this.props.profileSelected
         });
      }
      if (prevState.profile_selected !== this.state.profile_selected) {
         this.updateColumnsWidth({ forceUpdate: true })
      }

      if (!isEqual(prevProps.profiles, this.props.profiles) && this.props.profiles != null) {
         const profileDefault = this.props.profiles.find((e) => e.is_default);
         if (this.state.profile_selected == null && profileDefault != null) {
            this.setState({
               profile_selected: profileDefault ? profileDefault.id : null
            })
         } else {
            const isProfileSelectedStillExist = this.props.profiles.find((e) => e.id === this.state.profile_selected) != null;
            if (!isProfileSelectedStillExist) {
               this.setState({
                  profile_selected: profileDefault ? profileDefault.id : null
               })
            }
         }
      }


      if (JSON.stringify(prevProps.selected_rows) !== JSON.stringify(this.props.selected_rows) && this.props.selected_rows.length === 0) {
         this.removePasteEvent();
      }


      if (
         JSON.stringify(prevState.rows_extended) !== JSON.stringify(this.state.rows_extended) ||
         JSON.stringify(prevState.structure) !== JSON.stringify(this.state.structure)
      ) {
         this.setRenderedRows();
      }

      if (!isEqual(prevState.column_extended, this.state.column_extended)) {
         if (this.props.onColumnsChange)
            this.props.onColumnsChange(this.getVisibleColumns())
      }


      if (this.tableHeader.current && this.container.current) {
         let isSyncingLeftScroll = false;
         let isSyncingRightScroll = false;
         const tableHeader = this.tableHeader.current;
         const tableBody = this.container.current;

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
         }
      }

      if (this.props.expandRows !== prevProps.expandRows) {

         this.setState({
            rows_extended: generateRowsToExpand(this.props.expandRows)
         })
      }

      addFreezeColumns(this.state.name);
   };

   handleChangeProfile = (id) => {
      this.setState({
         profile_selected: id
      })
   };

   handleCreateProfile = (data, onClose) => {
      const columnExtended = this.state.column_extended;
      this.props.onCreateProfile(data, columnExtended, (id) => {
         if (id != null) {
            this.setState({
               profile_selected: id
            })
         }
         onClose();
      });
   };

   componentWillUnmount = () => {
      window.removeEventListener('keydown', this.handleCtrlKeyDown);
      window.removeEventListener('keyup', this.handleCtrlKeyUp);
      window.removeEventListener('click', this.onClickOnDocument);
      window.removeEventListener('paste', this.onPaste);
   }

   setRenderedRows = () => {
      //  It should take the structure of the table to iterate over the table.
      //  Then take rows_extended and check if the rows is open and should render.

      const getRenderedRows = (rows) => {
         return rows.reduce((acum, structure_item) => {
            const row = {
               ...this.state.rows_extended[structure_item.id],
               ...structure_item
            };

            if (row.is_open && row.subrows) {
               return [...acum, structure_item.id, ...(getRenderedRows(row.subrows))]
            } else {
               return [...acum, structure_item.id];
            }
         }, [])
      };
      const rendered_rows = getRenderedRows(this.state.structure);

      this.setState((prevState) => ({
         rendered_rows: rendered_rows
      }))
   };

   generateColumnExtended = () => {
      //  Add Internal columns
      const { state = {} } = this;
      const columns = this.props.includeCodeColumm ? [...this.internal_columns, ...this.props.columns] : [...this.props.columns];
      let profileData = {};
      if (this.props.profiles) {
         profileData = this.props.profiles.find((e) => e.id === state.profile_selected);
         profileData = profileData ? profileData.data : {};
      }

      return columns.reduce((acum, item) => {
         const key = item.key || item.assesor || item.Header;
         const profileParentColumnExtended = profileData[key] || {};
         acum[key] = {};

         const hasParentOwnIsVisible = item.hasOwnProperty('is_visible');
         const hasProfileParentOwnIsVisible = profileParentColumnExtended.hasOwnProperty('is_visible');
         if (hasProfileParentOwnIsVisible) {
            acum[key].is_visible = profileParentColumnExtended.is_visible
         } else if (hasParentOwnIsVisible) {
            acum[key].is_visible = item.is_visible
         }
         const hasParentOwnIsFreeze = item.hasOwnProperty('freeze');
         const hasProfileParentOwnIsFreeze = profileParentColumnExtended.hasOwnProperty('freeze');
         if (hasProfileParentOwnIsFreeze) {
            acum[key].freeze = profileParentColumnExtended.freeze
         } else if (hasParentOwnIsFreeze) {
            acum[key].freeze = item.freeze
         }
         if (hasOwnProperty(profileParentColumnExtended, 'width')
            && !(hasOwnProperty(profileParentColumnExtended, 'is_width_calculate')
               && profileParentColumnExtended.is_width_calculate)) {
            acum[key].width = profileParentColumnExtended.width;
            acum[key].width_base = profileParentColumnExtended.width;
         } else if (item.hasOwnProperty('width')) {
            acum[key].width = item.width;
            acum[key].width_base = item.width;
         }
         const parent = acum[key];
         if (item.hasOwnProperty('columns')) {
            const parentKey = key;
            for (const column of item.columns) {
               const key = column.key || column.assesor || column.Header;
               const profileColumnExtended = profileData[key] || {};

               acum[key] = { parent: parentKey };


               if (acum[parentKey].children == null) {
                  acum[parentKey].children = [];
               }
               acum[parentKey].children.push(key);

               if (hasOwnProperty(profileColumnExtended, 'is_visible')) {
                  acum[key].is_visible = profileColumnExtended.is_visible;
               }
               if (hasParentOwnIsVisible || hasParentOwnIsVisible) {
                  acum[key].is_visible = parent.is_visible;
               }

               if (column.hasOwnProperty('is_visible')) {
                  acum[key].is_visible = (hasProfileParentOwnIsVisible != null || hasParentOwnIsVisible != null)
                     ? parent.is_visible && column.is_visible
                     : column.is_visible;
               }
               if (profileColumnExtended.hasOwnProperty('width')) {
                  acum[key].width = profileColumnExtended.width;
                  acum[key].width_base = profileColumnExtended.width;
               } else if (column.hasOwnProperty('width')) {
                  acum[key].width = column.width;
                  acum[key].width_base = column.width;
               }
            }
         }

         return acum
      }, {});

   };

   generateTableStructure = () => {
      //  Updates the structure of the rows.
      //  It will only be executed when component is mounted and when rows or sortChange are updated.

      const { rows } = this.props;

      //  Look for root elements (The ones with parent_id)

      let rootElements = Object.keys(rows).reduce((acum, key) => {
         return rows[key].parent_id == null ? [
            ...acum,
            key
         ] : acum;
      }, []);

      const cleanCode = code => {
         return replaceAll(code, '\\.', '').trim()
      }

      const sortMethod = (a, b) => {
         if (this.state.sortMethod)
            return this.state.sortMethod(a, b);

         if (this.props.orderByCode) {
            const t1 = cleanCode(a.code);
            const t2 = cleanCode(b.code);
            const x = parseInt(t1);
            const y = parseInt(t2);
            return x - y;
         }

         if (this.props.orderByAlphanumericCode) {
            const keyValueStringA = `${a.code}`;
            const keyValueStringB = `${b.code}`;
            return keyValueStringA.localeCompare(keyValueStringB, undefined, { numeric: true })
         }

         return a.order_position - b.order_position


      };

      const column_filters = Object.keys(this.state.column_extended).reduce((acum, key) => {
         const ce = this.state.column_extended[key]
         if (ce.filter_value) {
            return [
               ...acum,
               {
                  key,
                  value: ce.filter_value,
                  format: ce.filter_format,
               }
            ]
         }
         return acum;
      }, [])

      const applyFilter = (row) => {
         return column_filters.every(filter => {
            const cellValue = row?.[filter.key];
            let filterFormat = typeof filter.format === 'object' ? filter.format.type : filter.format;

            if (cellValue != null) {
               switch (filterFormat) {
                  case 'text':
                     return cellValue.trim() !== '' ? cellValue.toLowerCase().includes(filter.value.toLowerCase()) : false;
                  case 'currency':
                     let is_valid = true;
                     if (filter.value.max)
                        is_valid = cellValue >= filter.value.max
                     if (filter.value.min)
                        is_valid = is_valid && cellValue <= filter.value.min
                     if (filter.value.equal)
                        is_valid = is_valid && cellValue === filter.value.equal
                     return is_valid
                  case 'list':
                     return cellValue.find((value) => value.toLowerCase().includes(filter.value.toLowerCase()));
                  default:
                     return cellValue.trim() !== '' ? cellValue.toLowerCase().includes(filter.value.toLowerCase()) : false;
               }

            } else {
               return false;
            }
         })
      }


      const generateTree = (elements, depth) => {
         const { filterOptions } = this.props;
         const includeChildren = filterOptions.includeChildren ?? true;
         const sortElements = elements.reduce((acum, element_id, index) => {
            const element = rows[element_id];
            if (!element) {
               return [...acum]
            }

            // Here applies columns filters
            if (column_filters.length > 0) {
               if (!applyFilter(element)) { // If the current element is filtered
                  // Check before the current element is removed if any child element is valid.
                  const children = element._children?.length > 0 ? getAllChildren(element._children, rows) : [];
                  const isFilterSuccessOnChild = children.find((child) => applyFilter(child)) != null;
                  let isFilterSuccessOnParent = false;
                  if (includeChildren) {
                     // Check before the current element is removed if any parent element is valid.
                     const parents = getAllParents(element, rows);
                     isFilterSuccessOnParent = parents.find((parent) => applyFilter(parent)) != null;
                  }

                  if (!isFilterSuccessOnParent && !isFilterSuccessOnChild) {
                     // If no child nor parent element is valid, the current element is removed
                     return [...acum]
                  }
               }
            }

            const has_position = element.hasOwnProperty('order_position') && isNumber(element.order_position);
            let internal_columns_values = this.props.includeCodeColumm ? {
               Internal_Table_Code: has_position ? this.getCodeFromPosition(element.id) : this.getCodeFromIndex(index)
            } : {};

            let item = {
               order_position: element.order_position,
               id: element_id,
               parent_id: element.parent_id,
               code: element.code,
               depth,
               ...element,
               ...internal_columns_values
            };

            if (element.hasOwnProperty('_children')) {
               item.subrows = generateTree(element._children, depth + 1);
            }
            const newArray = [
               ...acum,
               item
            ];
            return newArray;
         }, []).sort(sortMethod);

         return sortElements;
      };

      //  Get structure
      const structure = generateTree(rootElements, 0);

      //  Update internal state
      this.setState(prevState => ({
         structure,
      }));

   };

   updateColumnsWidth = (options = {}, callback) => {
      const { state = {} } = this;
      const { forceUpdate, column_extended } = options;
      const columnExtended = column_extended ? column_extended : forceUpdate ? this.generateColumnExtended() : state.column_extended;
      const columns = this.getColumns(columnExtended);
      const offsetWidth = this.container.current.offsetWidth;
      const columns_extended = generateExtraColumnProperties({
         columns,
         current_extended_columns: columnExtended,
         offsetWidth
      });
      this.setState({
         column_extended: columns_extended,
         tableWidth: this.container.current.offsetWidth
      }, callback)
   };

   onRowSelect = (row, isCtrlPress) => {
      const selected_rows = this.props.selected_rows ? this.props.selected_rows : [];
      let shouldAdd = !selected_rows.includes(row.id);

      if (this.props.onRowSelect) {
         this.removePasteEvent();
         this.addPasteEvent();
         if (isCtrlPress) {
            if (shouldAdd) {
               this.props.onRowSelect(selected_rows.concat(row.id))
            } else {
               const selectedRows = selected_rows.filter((srow => srow !== row.id));
               if (selectedRows.length <= 0) {
                  this.removePasteEvent();
               }
               this.props.onRowSelect(selectedRows)
            }

         } else {
            if (shouldAdd) {
               this.props.onRowSelect([row.id])
            } else {
               this.props.onRowSelect([]);
               this.removePasteEvent();
            }

         }
      }
   };

   onPaste = (e) => {
      if (this.props.onPasteRows) {
         const rows = getClipboardTextFromExcel(e);
         const selected_rows = this.props.selected_rows ? this.props.selected_rows : [];
         const selectedRowObject = {...this.props.rows[selected_rows[0]]};

         const selectedRowChildren = this.props.rows[selected_rows[0]]._children ?? [];
         const childrenObjectArray = selectedRowChildren.map((child) => this.props.rows[child])
         selectedRowObject._children = childrenObjectArray;

         const rowsArray = Object.keys(this.props.rows).map((key) => this.props.rows[key])
         const lastIndex = rowsArray[rowsArray.length - 1].id;

         const formattedRows = formatPastingRows(selectedRowObject, rows, true, lastIndex, this.props.onPasteOptions.lastWillBeItem)
         this.props.onPasteRows(selected_rows, formattedRows);
      }
   };

   addPasteEvent = () => {
      window.addEventListener('paste', this.onPaste);
   };

   removePasteEvent = () => {
      if (window.removeEventListener) {                   // For all major browsers, except IE 8 and earlier
         window.removeEventListener("paste", this.onPaste);
      } else if (window.detachEvent) {                    // For IE 8 and earlier versions
         window.detachEvent("paste", this.onPaste);
      }
   };

   onRowExpand = (row) => {
      //  1.- Mark as open
      //  2.- Check if it should render its children.
      if (!row.is_item) {
         // let rendered_rows = 0;
         let children = {};
         const columns = this.getVisibleColumns();

         if (row.subrows) {
            //  Get children and see if they should be rendered.

            children = row.subrows.reduce((acum, row) => {
               const shouldRender = columns.reduce((acum, current) => {
                  if (current.hasOwnProperty('text_filter') && current.text_filter.length > 0) {
                     let filter = current.text_filter.toString();
                     let checkIfIncluded = row => {

                        let textToCompare = row[current.assesor].toString().toLowerCase();
                        let isIncluded = textToCompare.includes(filter.toLowerCase());

                        if (isIncluded)
                           return true;
                        else if (row.hasOwnProperty('subrows')) {
                           return row.subrows.reduce((current, row) => {
                              return current || checkIfIncluded(row)
                           }, false)
                        } else {
                           return false
                        }
                     };
                     let isIncluded = checkIfIncluded(row);

                     // TODO: Revisar con Julio
                     // is_filter_active = true;
                     return acum && isIncluded

                  }

                  return acum && true
               }, true);

               // if (shouldRender) {
               //    //  Increase rendered rows
               //    rendered_rows++;
               // }

               return {
                  ...acum,
                  [row.id]: {
                     ...this.state.rows_extended[row.id] ?? {},
                     should_render: shouldRender
                  }
               }
            }, {});

         }
         this.setState(prevState => {
            return {
               rows_extended: {
                  ...prevState.rows_extended,
                  [row.id]: {
                     ...prevState.rows_extended[row.id],
                     is_open: prevState.rows_extended.hasOwnProperty(row.id) ?
                        (
                           prevState.rows_extended[row.id].hasOwnProperty('is_open') ? !prevState.rows_extended[row.id].is_open : true
                        ) : true,
                     should_render: true
                  },
                  ...children
               }
            }
         })
      }

      // //  Check if there is an extra hanlder in the parent
      if (this.props.hasOwnProperty('onRowExpand')) {
         this.props.onRowExpand(row)
      }


   };


   onNewRowExpand = (prevProps, prevState) => {
      // This function is used to expand a row when an element is added to it.

      if ((Object.keys(prevProps.rows).length) < Object.keys(this.props.rows).length) { // Check if there is a new row
         const last_row_in_props = this.props.rows[Object.keys(this.props.rows)[Object.keys(this.props.rows).length - 1]];
         if (last_row_in_props.parent_id !== null) {// Check that the new row was not a new section
            if (this.props.selected_rows.length === 1) { // Check if only one row is selected
               if (this.state.rows_extended[this.props.selected_rows[0]]) { // Check that a row has been opened at least once, this is to be able to check if the selected row is open or not
                  const row = this.state.rows_extended[this.props.selected_rows[0]];
                  if ((!row.hasOwnProperty('is_open') || row.is_open === false)) { // Check if the row is closed
                     this.onRowExpand(this.props.rows[this.props.selected_rows[0]]);
                  }
               } else {
                  this.onRowExpand(this.props.rows[this.props.selected_rows[0]] ?? this.props.rows[this.props.selected_rows[0].id]);
               }
            }
         }
      }

   }

   getCodeFromIndex = (index) => {
      return pad(index + 1, 2);
   };

   getCodeFromPosition = (id) => {

      const row = this.props.rows[id];

      if (row.hasOwnProperty('parent_id') && row.parent_id == null) {
         //  Get parent code
         return this.getCodeFromPosition(row.parent_id) + pad(row.order_position, 2);
         //return String.fromCharCode(97 + position - 1).toUpperCase();
      }

      return pad(row.order_position, 2);
   };


   initGenerateRows = () => {
      let rendered_rows = [];
      let object_rows = []
      let real_index_inge_andre = 0;

      const generateRows = (rows, depth) => {
         const columns = this.getVisibleColumns();
         let is_filter_active = false;

         rows.forEach((table_row, index) => {
            const row = {
               ...table_row,
               ...this.props.rows[table_row.id],
               ...this.state.rows_extended[table_row.id]
            };

            if (!row) {
               return 0
            }


            const is_open = this.state.rows_extended.hasOwnProperty(row.id) ? (
               this.state.rows_extended[row.id].hasOwnProperty('is_open') ? this.state.rows_extended[row.id].is_open : false
            ) : false;

            const shouldRender = row.parent_id == null ? true : (row.hasOwnProperty('should_render') ? row.should_render : true);

            if (shouldRender) {
               real_index_inge_andre++;
               let cellActive = undefined;
               if (this.state.cellActive.row === real_index_inge_andre) {
                  cellActive = this.state.cellActive.cell;
               }

               const is_selected = this.props.selected_rows ? this.props.selected_rows.includes(row.id) : false;

               rendered_rows.push(
                  <Row
                     styleTheme={this.props.styleTheme}
                     isDragColumnVisible={this.props.isDragColumnVisible}
                     expandCollapseColumnIndex={this.props.expandCollapseColumnIndex}
                     key={row.id}
                     index={real_index_inge_andre}
                     row={row}
                     onFocus={this.onFocusRow}
                     is_open={is_open}
                     is_selected={is_selected}
                     shouldShowSelectIcon={this.props.shouldShowSelectIcon}
                     columns={columns}
                     depth={depth}
                     onKeyDown={this.onKeyDown}
                     onKeyDownHotKeys={this.onKeyDownHotKeys}
                     cellActive={cellActive}
                     onCellClick={this.onCellClick}
                     onCellDoubleClick={this.props.onCellDoubleClick}
                     onRowClick={this.props.onRowClick}
                     onUpdateRow={this.onUpdateRow}
                     onRowExpand={this.onRowExpand}
                     onRowSelect={this.onRowSelect}
                     onPaste={this.props.onPasteCell}
                     type={this.props.type}
                     customRowClass={this.props.customRowClass}
                     ignoreItemStyle={this.props.ignoreItemStyle}
                     canDrop={this.props.canDropInRow}
                     canDrag={this.props.canDragRow}
                     onDrop={this.props.onDropInRow}
                     scrollTo={this.props.scrollToRow}
                     handleFilterColumn={this.handleFilterColumn}
                     onContextMenu={(x, y, actions) => {
                        this.setState((prevState) => ({
                           contextMenu: {
                              visible: true,
                              x,
                              y,
                              actions
                           }
                        }))
                     }}
                  />
               )
               object_rows.push(row)

            }
            //  Check if it has subrows and it's open to render subrows.

            if ((!!table_row.subrows) && (is_filter_active || is_open)) {

               generateRows(table_row.subrows, depth + 1)

            }
         })
      };

      generateRows(this.state.structure, 0);

      // Total row
      if (this.props.totalRow && !this.props.totalRow.freeze) {
         rendered_rows.unshift(
            <Row
               isDragColumnVisible={this.props.isDragColumnVisible}
               expandCollapseColumnIndex={this.props.expandCollapseColumnIndex}
               key={-1}
               index={-1}
               row={this.props.totalRow}
               is_open={true}
               is_selected={false}
               columns={this.getVisibleColumns().map(col => ({ ...col, editable: false }))}
               depth={-1}
               cellActive={-1}
               onPaste={this.props.onPasteCell}
               type={this.props.type}
               customRowClass={this.props.customRowClass}
               ignoreItemStyle={this.props.ignoreItemStyle}
            />
         )
      } else if (this.props.totalRowColumns) {
         const totalRowValues = calculateGranTotal(object_rows, this.props.totalRowColumns ?? []);
         rendered_rows.unshift(
            <Row
               isDragColumnVisible={this.props.isDragColumnVisible}
               expandCollapseColumnIndex={this.props.expandCollapseColumnIndex}
               key={-1}
               index={-1}
               row={{
                  description: 'Total',
                  ...totalRowValues
               }}
               is_open={true}
               is_selected={false}
               columns={this.getVisibleColumns().map(col => ({ ...col, editable: false }))}
               depth={-1}
               cellActive={-1}
               onPaste={this.props.onPasteCell}
               type={this.props.type}
               customRowClass={this.props.customRowClass}
               ignoreItemStyle={this.props.ignoreItemStyle}
            />
         )
      }

      return rendered_rows;
   };

   isColumnVisible = (name, extended_column) => {
      const extendedColumn = extended_column == null ? this.state.column_extended : extended_column;
      return extendedColumn.hasOwnProperty(name) ? (extendedColumn[name].hasOwnProperty('is_visible') ? extendedColumn[name].is_visible : true) : true
   };

   getVisibleColumns = () => {
      return this.getColumns().filter(colum => this.isColumnVisible(colum.assesor))
   };

   getColumns = (column_extended) => {
      const { state = {} } = this;
      let columns = this.props.includeCodeColumm ? [...this.internal_columns, ...this.props.columns] : [...this.props.columns];
      const columnExtended = column_extended != null ? column_extended : state.column_extended;
      return mergeColumnsWithProperties({ columns, extra_columns_properties: columnExtended });
   };

   getColumnsAll = () => {

      let columns = this.props.includeCodeColumm ? [...this.internal_columns, ...this.props.columns] : [...this.props.columns];
      columns = flatColumns(columns);

      return columns.map(col => {
         let new_col = { ...col };
         new_col.is_visible = true;
         if (this.state.column_extended.hasOwnProperty(new_col.assesor)) {
            const col_extended = this.state.column_extended[new_col.assesor];
            new_col = {
               ...new_col,
               ...col_extended
            };
            new_col.is_visible = col_extended.hasOwnProperty('is_visible') ? col_extended.is_visible : true;
         }
         new_col.key = new_col.key || new_col.assesor || new_col.header;
         return new_col

      })
   };

   getColumnsPlain = () => {

      let columns = this.props.includeCodeColumm ? [...this.internal_columns, ...this.props.columns] : [...this.props.columns];
      const mapColumnsWithExtendedProperties = columns => {
         return columns.map((col) => {
            let new_col = { ...col };
            new_col.is_visible = true;
            new_col.key = new_col.key || new_col.assesor || new_col.Header;

            if (new_col.columns) {
               new_col.columns = mapColumnsWithExtendedProperties(new_col.columns);
            }

            if (this.state.column_extended.hasOwnProperty(new_col.key)) {
               const col_extended = this.state.column_extended[new_col.key];
               new_col = {
                  ...new_col,
                  ...col_extended
               };
               new_col.is_visible = col_extended.hasOwnProperty('is_visible') ? col_extended.is_visible : true;
            }

            return new_col;
         })
      };

      return mapColumnsWithExtendedProperties(columns);
   };

   toggleColumn = (column) => {
      this.setState(prevState => {

         const new_columns = Object.keys(prevState.column_extended).reduce((acum, key) => {
            acum[key] = {
               ...prevState.column_extended[key]
            };
            if (key === column) {
               acum[key].is_visible = !this.isColumnVisible(key)
            }

            return acum

         }, {});
         const isColumnVisible = (column) => new_columns.hasOwnProperty(column) ? (new_columns[column].hasOwnProperty('is_visible') ? new_columns[column].is_visible : true) : true;
         const { parent, children } = new_columns[column];
         if (parent != null) {
            new_columns[parent].is_visible = new_columns[parent].children.reduce((accum, child) => isColumnVisible(child) ? true : accum, false);
         } else {
            if (children != null) {
               for (const child of children) {
                  new_columns[child].is_visible = isColumnVisible(column);
               }
            }
         }

         return ({
            column_extended: new_columns
         })
      }, () => this.updateColumnsWidth())
   };

   expandRows = () => {
      let rows = {};
      if (this.props.selected_rows.length > 0) { // To expand only the selected rows
         let rowsfromProps = this.props.rows;
         let getAllSubrows = function (row) { // Function to get all the subrows of the selected rows
            rows = {
               ...rows,
               [row.id]: rowsfromProps[row.id],
            }
            if (row.hasOwnProperty('_children') && row._children.length > 0) {
               row._children.forEach((current_row_id) => {
                  getAllSubrows(rowsfromProps[current_row_id])
               })
            }
         }

         this.props.selected_rows.forEach((row_id) => {
            getAllSubrows(this.props.rows[row_id]);
         })

      } else { // To expand all rows
         rows = this.props.rows
      }

      for (var row_id in rows) {
         const row = this.state.rows_extended[row_id];
         if (row) { // Check if the row has been extended
            if ((!row.hasOwnProperty('is_open') || row.is_open === false)) { // Check if the row is closed
               this.onRowExpand(this.props.rows[row_id]);
            }
         } else { // Else, just expand it
            this.onRowExpand(this.props.rows[row_id]);
         }
      }

   };

   collapseRows = () => {
      let rows = {};
      if (this.props.selected_rows.length > 0) { // To collapse only the selected rows
         let rowsfromProps = this.props.rows;
         let getAllSubrows = function (row) { // Function to get all the subrows of the selected rows
            rows = {
               ...rows,
               [row.id]: rowsfromProps[row.id],
            }
            if (row.hasOwnProperty('_children') && row._children.length > 0) {
               row._children.forEach((current_row_id) => {
                  getAllSubrows(rowsfromProps[current_row_id])
               })
            }
         }

         this.props.selected_rows.forEach((row_id) => {
            getAllSubrows(this.props.rows[row_id]);
         })

      } else { // To collapse all rows
         rows = this.props.rows
      }

      for (var row_id in rows) {
         const row = this.state.rows_extended[row_id];
         if (row) { // Check if the row has been extended
            if ((row.hasOwnProperty('is_open') && row.is_open === true)) { // Check if the row is opened
               this.onRowExpand(this.props.rows[row_id]);
            }
         }
      }
   };

   //  Setting methods

   toggleSettings = () => {
      this.setState(prevState => ({
         is_setting_open: !prevState.is_setting_open
      }))
   };

   onUpdateColumnProperties = (name) => {
      if (this.props.onUpdateColumnProperties) {
         this.props.onUpdateColumnProperties(this.state.column_extended, {
            id: this.state.profile_selected,
            name
         }, (id) => {
            if (id) {
               this.setState({ profile_selected: id })
            }
         });
      }
   }

   handleDeleteProfile = (id) => {
      if (this.props.onDeleteProfile) {
         this.props.onDeleteProfile(id);
         this.toggleSettings();
      }
   };

   onUpdateColumnWidth = ({ name, columns }) => {
      const allKeys = { ...this.state.column_extended, ...columns };
      const column_extended = Object.keys(allKeys).reduce((acum, colkey) => {
         const previousColumn = this.state.column_extended[colkey] || {};
         const updatedColumn = columns[colkey];
         const newColumn = {
            ...previousColumn,
            width: updatedColumn.width,
            is_visible: updatedColumn.is_visible,
            freeze: updatedColumn.freeze,
         };
         if (hasOwnProperty(updatedColumn, 'is_width_calculate') && !updatedColumn.is_width_calculate
            && hasOwnProperty(newColumn, 'is_width_calculate')) {
            delete newColumn['is_width_calculate'];
         }
         if (updatedColumn.is_width_calculate) {
            newColumn['is_width_calculate'] = updatedColumn.is_width_calculate;
            delete newColumn['width'];
         }
         return {
            ...acum,
            [colkey]: newColumn
         }
      }, {});
      this.updateColumnsWidth({ forceUpdate: true, column_extended }, () => {
         this.onUpdateColumnProperties(name)
      });
   };

   onCellClick = (column, row, colIndex, rowIndex) => {
      this.setState({
         cellActive: {
            row_id: row.id,
            row: rowIndex,
            cell: colIndex
         }
      });
      if (this.props.onCellClick)
         this.props.onCellClick(column, row);
   };

   selectAllRows = (rows) => {
      const selected_rows = Object.values(rows).map((row) => row.id);
      this.props.onRowSelect(selected_rows);
   }

   deselectAllRows = () => {
      this.props.onRowSelect([]);
   }

   onRemoveActive = () => {
      this.setState({
         cellActive: {
            row: undefined,
            cell: undefined
         },
      });
   };

   onUpdateRow = (column, row, value, resetValue) => {
      if (this.props.onUpdateRow) {
         this.props.onUpdateRow(column, row, value, resetValue, this.onRemoveActive);
      }
   };

   handleFilterColumn = (col) => filter_value => {
      if (filter_value === '') {
         // Collapse all rows if filter value was erased
         this.collapseRows();
      } else {
         // Expand searched rows
         this.expandRows();
      }
      this.setState(prevState => ({
         column_extended: Object.keys(prevState.column_extended).reduce((acum, key) => {
            if (key === col.assesor) {
               return {
                  ...acum,
                  [col.assesor]: {
                     ...prevState.column_extended[col.assesor],
                     filter_format: col.format,
                     filter_value: filter_value
                  }
               }
            }
            return {
               ...acum,
               [key]: {
                  ...prevState.column_extended[key],
                  filter_value: null,
               }

            }
         }, {})
      }))
   };

   onSubmitSettings = ({ name, columns }) => {
      this.onUpdateColumnWidth({ name, columns })
      if (this.props.onSubmitSettings) {
         this.props.onSubmitSettings({ name, columns })
      }
   }

   render() {
      const {
         title,
         rows,
         isLoading,
         bottomToolbar,
         noRowsMessage,
         selected_rows = [],
         actions = [],
         isDragColumnVisible,
         paddingBodyTable,
         isTableHeaderHidden,
         tableWrapperStyle,

      } = this.props;

      const isEmpty = Object.keys(rows).length === 0 && !isLoading;

      const columns = this.getVisibleColumns();

      const groupColumns = generateGroupColumns(this.getColumnsPlain(), this.isColumnVisible);

      const shouldRenderTitle = selected_rows ? (selected_rows.length > 0 || title) : title;



      let tableOffset = 0;
      if (this.tableToolbar.current && this.tableHeader.current) {
         const offSetIKnowWhereItComeFrom = 2;
         tableOffset = (this.tableToolbar.current.offsetHeight + this.tableHeader.current.offsetHeight) + offSetIKnowWhereItComeFrom;
      }

      const tableStyle = {
         display: 'flex',
         flexDirection: 'column',
         fontSize: '12px',
         borderSpacing: 0,
         height: `calc(100% - ${tableOffset}px)`
      };

      const droppableStyle = {
         height: '100%',
         display: 'flex',
         flexDirection: 'column'
      };

      const emptyCellStyle = {
         width: 24,
         flex: `25 0 auto`,
         maxWidth: 24
      };

      const renderColumns = (columns) => (
         columns.map((col, index) => {
            const extended_props = this.state.column_extended[col.assesor];
            const sort_directon = extended_props?.sort_directon
            const is_sortable = col.assesor ? col.sortable ?? true : false
            return (
               <td
                  className={`${col.Header !== '' && col.columns ? 'Table-Column-Header-Groups' : 'Table-Column-Header'} ${col.freeze ? 'fixed freeze_horizontal' : ''}`}
                  key={col.assesor || col.key}
                  style={{
                     width: col.width,
                     flex: `${col.width} 0 auto`,
                     maxWidth: col.width
                  }}
               >
                  <div className={`${col.Header !== '' && col.columns ? 'Table-Column-Header-Groups-Cell' : 'Table-Column-Header-Cell'}`}>
                     <div
                        className={is_sortable ? `${col.Header !== '' && col.columns ? 'Table-Column-Header-Groups-Sortable' : 'Table-Column-Header-Sortable'}` : null}
                        style={{ textAlign: 'center' }}
                        onClick={is_sortable ? () => {
                           this.setState((prevState) => ({
                              column_extended: Object.keys(prevState.column_extended).reduce((acum, key) => {
                                 if (key === col.assesor) {
                                    return {
                                       ...acum,
                                       [col.assesor]: {
                                          ...prevState.column_extended[col.assesor],
                                          sort_directon: prevState.column_extended[col.assesor].sort_directon === 'up' ? 'down' : 'up'
                                       }
                                    }
                                 }
                                 return {
                                    ...acum,
                                    [key]: {
                                       ...prevState.column_extended[key],
                                       sort_directon: null,
                                    }

                                 }
                              }, {}),
                              sortMethod: col.sortMethod ? col.sortMethod : (a, b) => {
                                 let sortUp = prevState.column_extended[col.assesor].sort_directon === 'up'
                                 let clean = str => {
                                    let tmp = replaceAll(str, '\\/', '')
                                    tmp = replaceAll(tmp, '\\.', '')
                                    tmp = removeSpecialCharacters(tmp)
                                    return tmp.trim()
                                 }
                                 let colFormat = typeof col.format === 'object' ? col.format.type : col.format;
                                 if (colFormat === 'currency' || colFormat === 'number') {
                                    return sortUp ? a[col.assesor] - b[col.assesor] : b[col.assesor] - a[col.assesor]
                                 } else {
                                    return clean(a[col.assesor]) > clean(b[col.assesor]) ? (sortUp ? 1 : -1) : (sortUp ? -1 : 1)
                                 }
                              }
                           }))
                        } : undefined}
                     >
                        {typeof col.Header === 'string' ? col.Header : col.Header()}
                        &nbsp; {col.help_info != null && <Popup content={col.help_info} trigger={<Icon name='help circle' />} />}
                        {sort_directon != null && <Icon color="blue" name={`sort alphabet ${sort_directon}`} />}
                     </div>
                     {!!col.filter && <div>
                        <FilterColumn
                           column_extended={this.state.column_extended[col.assesor]}
                           column={col}
                           onSubmit={this.handleFilterColumn(col)}
                        />
                     </div>}


                  </div>
               </td>
            )
         })
      );
      const { tableHeaderOptions, profiles = [], shouldCreateContext = false } = this.props;
      const { profile_selected } = this.state;
      const profileSelected = profiles.find((e) => profile_selected === e.id);

      return (<HotKeys handlers={this.keyBoardHandlers} keyMap={keyMap}
         style={{ outline: 'none', height: '100%', width: '100%', ...tableWrapperStyle }}>
         <div style={droppableStyle}>
            {!isTableHeaderHidden && <TableHeader
               tableHeaderOptions={tableHeaderOptions}
               profiles={this.props.profiles}
               profileSelected={profile_selected}
               filter={this.props.filter}
               setRef={this.tableToolbar}
               shouldRenderTitle={shouldRenderTitle}
               selected_rows={selected_rows}
               title={title}
               actions={actions}
               toggleSettings={this.toggleSettings}
               enableProfileConfiguration={this.props.enableProfileConfiguration}
               onChangeProfile={this.handleChangeProfile}
               onCreateProfile={this.handleCreateProfile}
               columns={this.props.columns}
               rows={this.state.structure}
               allowToDownloadCVS={this.props.allowToDownloadCVS}
               rows_extended={this.state.rows_extended}
               expandRows={
                  {
                     displayButton: this.props.isExpandRowsButtonActive,
                     isRowSelected: this.props.selected_rows.length > 0 ? true : false,
                     isRowHeaderSelected: (this.props.selected_rows.filter((row_id) => this.props.rows[row_id] && this.props.rows[row_id].is_item === false)).length > 0 ? true : false,
                     action: this.expandRows,
                     ...(tableHeaderOptions.expandRows || {})
                  }
               }
               collapseRows={
                  {
                     displayButton: this.props.isCollapseRowsButtonActive,
                     isRowSelected: this.props.selected_rows.length > 0 ? true : false,
                     isRowHeaderSelected: (this.props.selected_rows.filter((row_id) => this.props.rows[row_id] && this.props.rows[row_id].is_item === false)).length > 0 ? true : false,
                     action: this.collapseRows,
                     ...(tableHeaderOptions.collapseRows || {})
                  }
               }
            />}

            {/* ------------ TABLE ------------*/}
            <table className={`the-table-header ${this.state.name}`} ref={this.tableHeader} style={{
               display: 'flex',
               flexDirection: 'column',
            }}>
               {groupColumns && groupColumns.length > 0 && (
                  <thead>
                     <tr className="Table-Row-Header tr_shaded">
                        {isDragColumnVisible &&
                           <td colSpan="1" className={`${groupColumns && groupColumns[0]?.freeze ? 'freeze_horizontal' : ''}`}
                              style={emptyCellStyle}> {/* Empty Cell to format table*/}</td>}

                        {renderColumns(groupColumns)}
                     </tr>
                  </thead>
               )}
               <thead>
                  <tr className="Table-Row-Header tr_shaded">
                     {isDragColumnVisible &&
                        <td colSpan="1" className={`${columns && columns[0]?.freeze ? 'freeze_horizontal' : ''}`} style={emptyCellStyle}> {/* Empty Cell to format table*/}
                           {this.props.enableSelectAll && <Button
                              size="large"
                              compact
                              className="select-all-button"
                              basic
                              icon={selected_rows.length === Object.keys(rows).length && Object.keys(rows).length > 0 ? "check square outline" : "square outline"}
                              onClick={() => {
                                 if (selected_rows.length < Object.keys(rows).length && Object.keys(rows).length) {
                                    this.selectAllRows(rows);
                                 } else {
                                    this.deselectAllRows();
                                 }
                              }} />}
                        </td>}
                     {
                        renderColumns(columns)
                     }
                  </tr>
                  {this?.props?.totalRow?.freeze && <Row
                     isDragColumnVisible={this.props.isDragColumnVisible}
                     expandCollapseColumnIndex={this.props.expandCollapseColumnIndex}
                     key={-1}
                     index={-1}
                     row={this.props.totalRow}
                     is_open={true}
                     is_selected={false}
                     columns={this.getVisibleColumns().map(col => ({ ...col, editable: false }))}
                     depth={-1}
                     cellActive={-1}
                     onPaste={this.props.onPasteCell}
                     type={this.props.type}
                     customRowClass={this.props.customRowClass}
                     ignoreItemStyle={this.props.ignoreItemStyle}
                  />}
               </thead>
            </table>

            <table
               className={`table-drag-n-drop the-table ${this.props.className} scrolly_table scrolling_table_2 ${this.state.name}`}
               style={tableStyle}
               ref={(current) => {
                  this.container = {
                     current
                  };
                  if (this.props.setRef) {
                     this.props.setRef(current);
                  }
               }}
            >
               {groupColumns && groupColumns.length > 0 && (
                  <thead>
                     <tr className="Table-Row-Header">
                        {isDragColumnVisible &&
                           <td colSpan="1" className={`${groupColumns && groupColumns[0]?.freeze ? 'freeze_horizontal' : ''}`} style={emptyCellStyle}> {/* Empty Cell to format table*/}</td>}

                        {renderColumns(groupColumns)}
                     </tr>
                  </thead>
               )}
               <thead>
                  <tr className="Table-Row-Header">
                     {isDragColumnVisible &&
                        <td colSpan="1" className={`${groupColumns && groupColumns[0]?.freeze ? 'freeze_horizontal' : ''}`} style={emptyCellStyle}> {/* Empty Cell to format table*/}</td>}

                     {renderColumns(columns)
                     }
                  </tr>
               </thead>
               <tbody

                  style={{
                     display: 'table',
                     padding: paddingBodyTable ? paddingBodyTable : 'none'
                  }}>
                  {
                     isEmpty ?
                        (
                           <NoRowsCard
                              noRowsMessage={noRowsMessage}
                              onDrop={this.props.onDropInZone}
                              canDrop={this.props.canDropInZone}
                              isCtrlPressed={this.state.isCtrlPressed}
                           />
                        )
                        :
                        ([
                           <DropZone
                              key='dropzone'
                              onDrop={this.props.onDropInZone}
                              canDrop={this.props.canDropInZone}
                              isCtrlPressed={this.state.isCtrlPressed}
                           />,
                           this.initGenerateRows()
                        ])
                  }

               </tbody>
            </table>


            {/* ------------ EXTRA ------------*/}

            {
               isLoading &&
               <Dimmer active={isLoading} inverted>
                  <Loader>Cargando</Loader>
               </Dimmer>
            }
            {bottomToolbar != null && bottomToolbar}

            <Settings
               profile={profileSelected}
               isOpen={this.state.is_setting_open}
               columns={this.getColumnsPlain()}
               onClose={this.toggleSettings}
               toggleColumn={this.toggleColumn}
               onSubmit={this.onSubmitSettings}
               onConfirmDelete={this.handleDeleteProfile}
               isColumnVisible={this.isColumnVisible}>
            </Settings>

            {this.state.contextMenu.visible && <ContextMenu
               onClose={() => {
                  this.setState({
                     contextMenu: {
                        visible: false
                     }
                  })
               }}
               x={this.state.contextMenu.x}
               y={this.state.contextMenu.y}
               actions={this.state.contextMenu.actions}
            />
            }
         </div>

      </HotKeys>);
   }
}

Table.propTypes = {
   className: PropTypes.string,
   title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
   ]),
   styleTheme: PropTypes.oneOf(
      [
         'striped',
      ]
   ),
   type: PropTypes.oneOf(
      [
         'Detail',
         'Material',
         'MaterialImport',
         'LineItem',
         'LineItemImport',
         'LineItemDetail',
         'UoM',
         'EstimateItem',
         'Undefined',
         'MeasurementUnit',
         'Package',
         'PackageItem',
         'BillingItem',
         'Grafo',
         'WBS',
      ]
   ),
   columns: PropTypes.arrayOf(PropTypes.shape({
      Header: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
      assesor: PropTypes.string,
      onlyItems: PropTypes.bool,
      onlyHeaders: PropTypes.bool,
      editable: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.func]),
      width: PropTypes.number,
      is_visible: PropTypes.bool,
      Cell: PropTypes.func,
      format: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.func]),
      filter: PropTypes.bool,
      sortable: PropTypes.bool,
      sortMethod: PropTypes.func,
      help_info: PropTypes.string,
      freeze: PropTypes.bool,
      compressLongText: PropTypes.bool,
   })).isRequired,
   rows: PropTypes.object.isRequired,
   actions: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      icon: PropTypes.string,
      subIcon: PropTypes.string,
      subIconPosition: PropTypes.string,
      action: PropTypes.func,
      position: PropTypes.oneOf(['left', 'right']),
      custom_button: PropTypes.func
   })),
   selected_rows: PropTypes.array,
   selected_cell: PropTypes.object,
   totalRow: PropTypes.object,
   totalRowColumns: PropTypes.array,

   onPasteRows: PropTypes.func,
   onPasteCell: PropTypes.func,
   onRowClick: PropTypes.func,
   onRowExpand: PropTypes.func,
   onRowSelect: PropTypes.func,
   onCellClick: PropTypes.func,
   onCellDoubleClick: PropTypes.func,
   onUpdateRow: PropTypes.func,
   onAddNew: PropTypes.func,
   onUpdateColumnProperties: PropTypes.func,

   canDragRow: PropTypes.func,
   canDropInRow: PropTypes.func,
   canDropInZone: PropTypes.func,
   onDropInRow: PropTypes.func,
   onDropInZone: PropTypes.func,
   customRowClass: PropTypes.func,
   isLoading: PropTypes.bool,

   noRowsMessage: PropTypes.object,
   includeCodeColumm: PropTypes.bool,
   orderByCode: PropTypes.bool,
   orderByAlphanumericCode: PropTypes.bool,
   sort: PropTypes.func,
   expandCollapseColumnIndex: PropTypes.number,
   isDragColumnVisible: PropTypes.bool,

   isTableHeaderHidden: PropTypes.bool,
   paddingBodyTable: PropTypes.string,
   expandRows: PropTypes.array,
   enableSelectAll: PropTypes.bool,
   tableHeaderOptions: PropTypes.object,
   profiles: PropTypes.array,
   enableProfileConfiguration: PropTypes.bool,
   onChangeProfile: PropTypes.func,
   /**
    * Gets called when the user clicks on the button
    *
    * @param {Object} data The react
    * @param {Object} columns All props of this Button
    * @param {function} onClose All props of this Button
    */
   onCreateProfile: PropTypes.func,
   onDeleteProfile: PropTypes.func,

   bottomToolbar: PropTypes.any,
   isExpandRowsButtonActive: PropTypes.bool,
   isCollapseRowsButtonActive: PropTypes.bool,
   isExpandByDefault: PropTypes.bool,
   scrollToRow: PropTypes.number,
   allowToDownloadCVS: PropTypes.bool,
   filterOptions: PropTypes.object,
   ignoreItemStyle: PropTypes.bool,
   shouldShowSelectIcon: PropTypes.bool,
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
   onRowSelect: () => {
   },
   onUpdateRow: () => {
   },
   onUpdateColumnProperties: () => {
   },
   isLoading: false,
   includeCodeColumm: false,
   orderByCode: false,
   orderByAlphanumericCode: false,
   shouldShowSelectIcon: false,
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
      includeChildren: true,
   },
};

export default DragDropContext(Table);