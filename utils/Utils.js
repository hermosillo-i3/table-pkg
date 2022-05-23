import moment from "moment";
import { sortByCode } from "./index";
import _uniqBy from "lodash/uniqBy";

export const isEqual = (value, other) => {

   // Get the value type
   var type = Object.prototype.toString.call(value);

   // If the two objects are not the same type, return false
   if (type !== Object.prototype.toString.call(other)) return false;

   // If items are not an object or array, return false
   if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;

   // Compare the length of the length of the two items
   var valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
   var otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
   if (valueLen !== otherLen) return false;

   // Compare two items
   var compare = function (item1, item2) {

      // Get the object type
      var itemType = Object.prototype.toString.call(item1);

      // If an object or array, compare recursively
      if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
         if (!isEqual(item1, item2)) return false;
      }

      // Otherwise, do a simple comparison
      else {

         // If the two items are not the same type, return false
         if (itemType !== Object.prototype.toString.call(item2)) return false;

         // Else if it's a function, convert to a string and compare
         // Otherwise, just compare
         if (itemType === '[object Function]') {
            if (item1.toString() !== item2.toString()) return false;
         } else {
            if (item1 !== item2) return false;
         }

      }
   };

   // Compare properties
   if (type === '[object Array]') {
      for (var i = 0; i < valueLen; i++) {
         if (compare(value[i], other[i]) === false) return false;
      }
   } else {
      for (var key in value) {
         if (value.hasOwnProperty(key)) {
            if (compare(value[key], other[key]) === false) return false;
         }
      }
   }

   // If nothing failed, return true
   return true;

};

export const pad = (number, size) => {
   var s = String(number);
   while (s.length < (size || 2)) {
      s = "0" + s;
   }
   return s;
};

export const isNumber = (value) => {
   if (value === null)
      return false
   return !isNaN(value)
};

export const getAllChildren = (childrenIds, items) => {
   return childrenIds.reduce((total, key) => {
      const item = items[key];
      let arrayToReturn = [
         ...total,
         item,
      ];
      if (item._children && item._children.length > 0) {
         arrayToReturn = [
            ...arrayToReturn,
            ...getAllChildren(item._children, items),
         ];
      }
      return arrayToReturn;
   }, []);
};

export const formatColumn = (format, value) => {

   const type = typeof format === 'string' ? format : format.type;
   const decimals = typeof format === 'string' ? 2 : format.decimals;

   const transform = function (org, n, x, s, c) {
      const re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
         num = org.toFixed(Math.max(0, ~~n));

      return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
   };
   switch (type) {
      case 'currency':
         return !isNaN(value) ? (
            `$${transform(parseFloat(value), decimals, 3, ',', '.')}`
         ) : value;
      case 'number':
         return !isNaN(value) ? (
            `${transform(parseFloat(value), decimals, 3, ',', '.')}`
         ) : value;
      case 'percentage':
         return !isNaN(value) ? (
            `${transform(parseFloat(value), decimals, 3, ',', '.')}%`
         ) : value;
      case 'date':
         if (!value) {
            return '';
         }
         return moment(value).format(format.dateFormat != null ? format.dateFormat : 'DD MMMM YYYY');
      case 'boolean':
         return value ? '✔️' : ''
      default:
         return value
   }
};


export const isFunction = (functionToCheck) => {
   return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
};

/** Filter a tree-based object keeping the headers of children
 * @param {Object} items tree based object
 * @param {Function} filterMethod the function that will be apply to filter children
 * @param {Boolean} includeEmptyHeaders if true it will include empty headers
 * @param {Function} parseItem optional function to parse item
 */
export const applyFilter = (items, filterMethod, includeEmptyHeaders = true, parseItem) => {
   let validItems = {};

   const lookInChildren = (children) => {

      let isValid = false;
      let isValidChild = false;

      // TODO: Agregar un return al final , como funciona el metodo some
      // eslint-disable-next-line array-callback-return
      children.some(child => {

         if (validItems[child]) {
            isValid = true;
            return true
         }


         let item = items[child];
         if (item) {
            if (item.is_item) {
               if (filterMethod(item)) {
                  isValid = true
                  validItems[item.id] = true;

                  return true;
               }
            } else {
               if (item._children && item._children.length > 0) {
                  isValidChild = lookInChildren(item._children);
               } else {
                  isValidChild = includeEmptyHeaders
               }

               if (isValidChild)
                  return true;
            }
         }


      });

      return isValid || isValidChild;
   }

   items = Object.keys(items).reduce((acum, key) => {
      let pack = items[key]
      if (pack.is_item) {
         if (filterMethod(pack)) {
            return {
               ...acum,
               [key]: parseItem ? parseItem(pack) : pack
            }
         }
      } else {
         if (pack._children && pack._children.length > 0) {
            if (lookInChildren(pack._children)) {
               return {
                  ...acum,
                  [key]: pack
               }
            }
         } else {
            if (includeEmptyHeaders)
               return {
                  ...acum,
                  [key]: pack
               }
         }
      }

      return {
         ...acum
      }
   }, {})


   return items;
};

/** Removes some special characters from a text string
 * @param {String} textWithSpecial Text with especial characters.
 * @return {String} The result text without characters
 */
 export const removeSpecialCharacters = (textWithSpecial) => {
   if (textWithSpecial == null) {
      return ''
   }
   // eslint-disable-next-line no-useless-escape
   const regex = /\<|\>|\:|\"|\/|\\|\||\?|\*|\`|\.$/gim
   return textWithSpecial.replace(regex, '');
};

 
 /**
 * Converts a tree structure array to a flat array using a target property that will be used as the key. Ut uses recursion
 * @param {Array<TreeItem>} list_of_items A complete tree of items
 * @param {String} child_property The property that will be used as the key to check if the item has children
 * @returns {Array<TreeItem>} A flat array with all the items of the tree stucture
 */
 export const convertTreeStructureToFlatArray = (list_of_items, child_property) => {
   const rowsToReturn = [];
   for (const row of list_of_items) {
     rowsToReturn.push(row)
     if (row[child_property]) {
       if (!Array.isArray(row[child_property])) {
         throw new Error('The property ' + child_property + ' must be an array')
       }
       rowsToReturn.push(...convertTreeStructureToFlatArray(row[child_property]))
     }
   }
   return rowsToReturn;
 }
 
 /**
  * Gets all the parent structure from a children item
  * @param {Object} item The child item 
  * @param {Object} list_of_items A complete tree of items
  * @returns {Array<Object>} The array of the parents of the item
  */
 export const getAllParents = (item, list_of_items) => {
   const recursiveAux = (item, list_of_items_object) => {
     if (item.parent_id === null) {
       return [];
     } else {
       const parent = list_of_items_object[item.parent_id];
       return [
         parent,
         ...recursiveAux(parent, list_of_items_object),
       ]
     }
   }
 
   return recursiveAux(item, list_of_items)
 };