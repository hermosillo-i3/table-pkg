import {Decimal} from "decimal.js";

class Column {
   constructor({
                  Header = 'Header',
                  assesor = '',
                  editable = false,
                  onlyItems = false,
                  format = {},
                  width = 350
               }) {

      Object.assign(this, arguments[0]);
   }
}

export default Column;

export const isColumnEditable = (column, row = {}) => {
   const {editable, onlyItems, onlyHeaders} = column;
   //	Column has been mark as editable.
   //	Still need to check if headers or items are editables or a function was provied.
   let is_editable = false;
   if (editable === true && onlyItems) {
      return row.is_item;
   } else if (editable === true && onlyHeaders) {
      return !row.is_item
   }

   if (typeof editable === "function") {
      //	It was pass a function.
      is_editable = editable(row);
   } else {
      //	It was pass a string/boolean.
      switch (editable) {
         case true:
         case "all":
            is_editable = true
            break;
         case "item":
            is_editable = row.is_item
            break;
         case "header":
            is_editable = !row.is_item
            break;
         case "header_enabled":
            is_editable = !row.is_item && !row.is_disable
            break;
         default:
            is_editable = false
      }
   }
   return is_editable;
};

export const getOnlyDataColumns = (columns = []) => {
   return columns.reduce((accum, e) => {
      if (e.columns != null) {
         return [
            ...accum,
            ...getOnlyDataColumns(e.columns)
         ]
      }
      return [
         ...accum,
         e
      ]
   }, [])
};
export const flatColumns = (columns = []) => {
   return columns.reduce((accum, e) => {
      if (e.columns != null) {
         return [
            ...accum,
            e,
            ...flatColumns(e.columns)
         ]
      }
      return [
         ...accum,
         e
      ]
   }, [])
};

export const getColumnKey = (column) => {
   return column.key || column.assesor || column.Header;
};

export const isGroupVisible = (column, isColumnVisible) => column.columns.reduce((accum, e) => isColumnVisible(getColumnKey(e)) ? true : accum, false);

export const generateGroupColumns = (columns = [], isColumnVisible) => {
   const haveGroupColumns = columns.reduce((accum, e) => accum || (e.columns && e.columns.length > 0), false);
   if (!haveGroupColumns) {
      return undefined;
   }
   const groupedColumns = columns.reduce((accum, column) => {
      const key = getColumnKey(column);
      if (!isColumnVisible(key)) {
         return accum;
      }
      if (column.columns == null) {
         accum.push({
            Header: '',
            span: 0,
            key: column.key || column.assesor || column.header,
            width: column.width,
            freeze: column.freeze,
         });
      } else {
         if (!isGroupVisible(column, isColumnVisible)) {
            return accum;
         }
         const widthAccum = column.columns.reduce((accum, e) => isColumnVisible(getColumnKey(e)) ? accum + e.width : accum + 0, 0);
         accum.push({
            ...column,
            assesor: column.columns[0].assesor,
            key: column.key || column.assesor || column.header,
            span: column.columns.length,
            width: widthAccum,
         });
      }
      return accum;
   }, []);
   return groupedColumns;
};

const isColumnVisible = (name, extended_column) => {
   return Object.prototype.hasOwnProperty.call(extended_column, name)
      ? (Object.prototype.hasOwnProperty.call(extended_column[name], 'is_visible')
         ? extended_column[name].is_visible
         : true)
      : true
};

export const generateExtraColumnProperties = ({columns, current_extended_columns, offsetWidth}) => {
   //  This width is the sum of all columns that were not set by the user. Such as Expanded column, Selected column, etc.
   const scrollWidth = 17;
   const widthOfDummyColumns = 55 + scrollWidth;
   const maxWidth = offsetWidth;
   const columnsExtended = mergeColumnsWithProperties({columns, extra_columns_properties: current_extended_columns});

   const column_width_taken = columnsExtended.reduce((acum, column) => {
      const hasWidth = Object.prototype.hasOwnProperty.call(column, 'width') && column.width !== undefined;
      const isVisible = isColumnVisible(column.assesor, current_extended_columns);
      const increase = (hasWidth && isVisible) ? column.width : 0;
      return {
         free_space: acum.free_space + ((hasWidth && !isVisible) ? column.width_base : 0),
         visible_columns: acum.visible_columns + (isVisible ? 1 : 0),
         number: acum.number + ((hasWidth && isVisible) ? 1 : 0),
         value: acum.value + increase
      }
   }, {free_space: 0, visible_columns: 0, number: 0, value: 0});

   let new_columns;
   if (column_width_taken.visible_columns === column_width_taken.number) {
      //  All the columns have width already

      //  Check if there are invisible columns

      if (column_width_taken.visible_columns < columnsExtended.length) {
         //  There are at less 1 invisible column. We need to increase the value of other columns

         const increaseBy = new Decimal(new Decimal(column_width_taken.free_space).div(column_width_taken.visible_columns).toFixed(0)).toNumber();
         new_columns = columnsExtended.reduce((acum, column) => {
            const key = getColumnKey(column);
            const isVisible = isColumnVisible(key, current_extended_columns);
            if (isVisible) {
               acum[key].width = current_extended_columns[key].width_base + increaseBy
            }
            acum[key].is_visible = isVisible;
            return acum
         }, current_extended_columns)

      } else {
         //  All columns are visible, Use original width
         new_columns = columnsExtended.reduce((acum, column) => {
            const key = getColumnKey(column);
            acum[key].width = current_extended_columns[key].width;
            return acum
         }, current_extended_columns)
      }

   } else {
      //  Some columns do not have width property
      let column_width = (maxWidth - column_width_taken.value - widthOfDummyColumns) / (column_width_taken.visible_columns - column_width_taken.number);
      const min_width = 120;

      // Check if the new column width is smaller that the minimum width
      if (column_width < min_width) {
         column_width = min_width; // If is smaller, set the column width to this value. This will avoid breaks in the table.
      }

      new_columns = columnsExtended.reduce((acum, column) => {

         const key = getColumnKey(column);
         acum[key] = {
            ...current_extended_columns[key]
         };

         if (!column.hasOwnProperty('width') || column.width === undefined) {
            if (column.hasOwnProperty('min_width') && column_width < column.min_width) { // Check if the width is not smaller than the minimum width.
               acum[key].width = column.min_width;
               acum[key].width_base = column.min_width;
            } else {
               acum[key].width = column_width;
               acum[key].width_base = column_width;
            }
            acum[key].is_width_calculate = true;
         } else {
            acum[key].width_base = column.width
         }

         return acum
      }, current_extended_columns)

   }
   return new_columns;
};

export const mergeColumnsWithProperties = ({columns, extra_columns_properties}) => {
   const onlyDataColumns = getOnlyDataColumns(columns);

   return onlyDataColumns.map(col => {
      // Creating new object with current column values
      let new_col = {...col};

      // Validating if the column have extra properties
      if (Object.prototype.hasOwnProperty.call(extra_columns_properties, new_col.assesor)) {
         // If the column have extra properties we have to assigned to the new column
         const col_extended = extra_columns_properties[new_col.assesor];
         // Validating for every property if exist inside the extra properties
         if (Object.prototype.hasOwnProperty.call(col_extended, 'width_base')) {
            new_col.width_base = col_extended.width_base
         }
         if (Object.prototype.hasOwnProperty.call(col_extended, 'width')) {
            new_col.width = col_extended.width
         }
         if (Object.prototype.hasOwnProperty.call(col_extended, 'is_visible')) {
            new_col.is_visible = col_extended.is_visible
         }
         if (Object.prototype.hasOwnProperty.call(col_extended, 'freeze')) {
            new_col.freeze = col_extended.freeze
         }
      }

      // Creating a valid key for the column
      new_col.key = new_col.key || new_col.assesor || new_col.header;
      return new_col

   })
};
