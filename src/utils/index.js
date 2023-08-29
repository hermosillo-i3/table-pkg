import dateFormatter from "./dateFormatter";
import { Decimal } from "decimal.js";
import each from "lodash/each";
import cloneDeep from "lodash/cloneDeep";
import isArray from "lodash/isArray";
import { generateCode } from "./Utils";

const cleanText = str => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

/**
 * Sort an array of objects by date using a custom property. It can be ascending or descending
 * If dates are equal tries to compare ID
 * @param {String} property - The property that will be used to sort the array of objects.
 * @param {Boolean} desc - The order of the sort.
 * @return {Function} Sort function with the custom property
 * @example
 * sortByDate('requisition_date')
 * @example
 * sortByDate('requisition_date', true)
 */
export const sortByDate = (property, desc = false) => {


   return (a, b) => {

      const compareId = (alternative) => {
         if (a.id != null && b.id != null)
            return a.id > b.id
         else
            switch (alternative) {
               case 'after':
                  return dateFormatter(a[property]).isAfter(b[property])
               case 'before':
                  return dateFormatter(a[property]).isBefore(b[property])

               default:
                  break;
            }
      }

      const isSame = dateFormatter(a[property]).isSame(b[property])
      const isAfter = isSame ? compareId('after') : dateFormatter(a[property]).isAfter(b[property])
      const isBefore = isSame ? compareId('before') : dateFormatter(a[property]).isBefore(b[property])

      if (desc ? isAfter : isBefore) {
         return -1
      } else {
         return 1
      }
   }
};

/**
 * Sort an array of objects by code that includes dots as separator (.01.002.003.003)
 * @param {Object} prop - The property that will be used to compare.
 * @param {Object} a - The object that needs to be sorted.
 * @param {Object} b - The object that needs to be sorted.
 */
export const sortByCode = (prop = 'code') => (a, b) => {
   const t1 = replaceAll(a[prop] ?? '', '\\.', '')
   const t2 = replaceAll(b[prop] ?? '', '\\.', '')
   const x = parseInt(t1);
   const y = parseInt(t2);
   return x - y
}

export const convertToArrayObject = (array, key = "id") => {
   if (array === null || array === undefined || !Array.isArray(array))
      return {};

   return array.reduce((current, item) => {
      current[item[key]] = item;
      return current
   }, {})
};
export const isFunction = (functionToCheck) => {
   return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
};

/** Convert an array to object.
 * By the default the function only needs an array and it will assume the object key is id. If you want to override this key, just add the key property as second parameter
 * This function allows you to use multiple options to transform the array to object.
 * @param {array} array - The array to convert
 * @param {string} keyProperty - The key property to defined in the Object
 * @param {object} options - Options to transform the array into object
 * @param {function||any}  options.value - This option allow you defined the value of each object former from the array.
 * This value can be either a direct value like a string, or you can send a function to generate a dynamic value
 * @param {boolean} options.allowMultiple - This option allow you to have multiple objects into a single key. For example
 * if you group an array of fruits by color, if the color of the fruits repeat, you will have an array instead of an object for every key.
 * Example: [{name:'apple',color:'red'},{name:'pear',color:'green',name:'apple',color:'green'}] => {"green":[{name:'pear',color:'green',name:'apple',color:'green'}],"red":[{name:'apple',color:'red'}]}
 * @param {{groupKey: string, type: string}}  options.groupBy - This option allows you to manipulate how duplicated keys works.
 * For example if you want to sum all totals of the objects with the same key.
 * GroupKey='total' - [{id:'invoice',total:210},{id:'invoice',total:400}] => {"invoice":610}
 * @param {array}  options.nestedObjects - This option is used in case you sent an SequelizeModel and you need to render the nested objects inside the model. You just need to send an array with the name of the nested objects
 * @param {function}  options.createCustomProperties - This option allows you to add additional properties to the result object of each element.
 * @returns {array||string} Return string or array depending of the route sent
 */
export const convertArrayToObjectV2 = (array, keyProperty = 'id', options = {
   value: undefined,
   allowMultiple: false,
   groupBy: undefined,
   nestedObjects: [],
   createCustomProperties: undefined
}) => {
   if (array === null || array === undefined || typeof array !== 'object')
      return {};
   return array.reduce((accum, item) => {
      const { value, allowMultiple, groupBy, createCustomProperties } = options;
      const key = isFunction(keyProperty) ? keyProperty(item) : item[keyProperty];
      const isValueFunction = isFunction(value);
      let objectMapped = {
         [key]: value ? isValueFunction ? value(item) : value : {
            ...item,
            ...(options.nestedObjects ? options.nestedObjects.reduce((accum, key) => {
               return { ...accum, ...item[key] }
            }, {}) : {})
         },
      };
      if (allowMultiple) {
         const currentValue = accum[key] ? accum[key] : [];
         objectMapped = {
            [key]: [
               ...currentValue,
               value ? isValueFunction ? value(item) : value : item,
            ],
         };
      }
      if (groupBy) {
         // { groupKey: 'id', type: 'sum'}
         const currentValue = accum[key] ? accum[key] : 0;
         const valueDecimal = new Decimal(value ? isValueFunction ? value(item) : value : item[options.groupBy.groupKey]);
         objectMapped = {
            [key]: valueDecimal.plus(currentValue).toNumber(),
         };
      }
      if (createCustomProperties) {
         objectMapped[key] = {
            ...objectMapped[key],
            ...createCustomProperties(item)
         };
      }

      return {
         ...accum,
         ...objectMapped,
      };
   }, {});
};

/**
 * Converts an object to an array. If filterFunc is provided it will use it to filter the result array
 * @param {Object} obj - The object that will be convert to an array.
 * @param {Function} [filterFunc] - The function to filter the result array.
 * @return {Array} - The result array.
 * @example
 * convertObjectToArray({
 *    '0': {
 *    'name': 'Julio'
 *    },
 *    '1': {
 *    'name': 'Andre'
 *    }
 * })
 * @example
 * convertObjectToArray({
 *    '0': {
 *    'name': 'Julio'
 *    },
 *    '1': {
 *    'name': 'Andre'
 *    }
 * }, (item) => item.name === 'Julio' )
 */
export const convertObjectToArray = (obj, filterFunc) => {
   if (obj === null || obj === undefined)
      return [];
   if (filterFunc) {
      return Object.keys(obj).map(key => obj[key]).filter(filterFunc)
   } else {
      return Object.keys(obj).map(key => obj[key])
   }

};

export const convertArrayToObjectWithValue = (array, objectWithValues) => {
   return array.reduce((current, item) => {
      current[item.id] = {
         ...objectWithValues[item.id],
         ...item
      };
      return current
   }, {})
};

export const ObjectFilter = (obj, filterFunc) => {
   return obj ? Object.keys(obj).map(key => obj[key]).filter(filterFunc).reduce((acum, item) => {
      return {
         ...acum,
         [item.id]: item
      }
   }, {}) : {}
};
export const objectFind = (obj, filterFunc) => {
   return obj ? Object.keys(obj).map(key => obj[key]).find(filterFunc) : null;
};

export const objectMap = (obj, mapFunc) => {
   return obj ? Object.keys(obj).map(key => obj[key]).map(mapFunc).reduce((acum, item) => {
      return {
         ...acum,
         [item.id]: item
      }
   }, {}) : {}
}

export const objectSort = (obj, sortFunc) => {
   return obj ? Object.keys(obj).map(key => obj[key]).sort(sortFunc).reduce((acum, item) => {
      return {
         ...acum,
         [item.id]: item
      }
   }, {}) : {}
}

//TODO: Add documentation
export const addLevel = (object) => {
   const keyParents = Object.keys(object).filter((e) => object[e].parent_id == null);
   const addLevelChildren = (childrenKeys, level) => {
      for (const key of childrenKeys) {
         object[key].level = level;
         if (object[key]._children && object[key]._children.length > 0) {
            addLevelChildren(object[key]._children, level + 1);
         }
      }
   };
   addLevelChildren(keyParents, 0);
   return object;
};

export const isObjectEmpty = (object) => {
   if (object === null) {
      return true;
   }
   return Object.keys(object).length <= 0;
};

export const addChildrenToItems = (obj, parseKeys = true) => {
   const object = cloneDeep(obj);
   Object.keys(object).forEach(key => {

      if (object[key].parent_id != null && object[object[key].parent_id]) {
         const parent_id = object[key].parent_id;
         //  The material belongs to a category material. It needs to add it as it's child
         if (object[parent_id] !== undefined && !object[parent_id].hasOwnProperty('_children')) {
            object[parent_id]._children = []
         }
         if (object[parent_id] !== undefined) {
            object[parent_id]._children.push(parseKeys ? parseInt(key) : key)
         }
         if (object[parent_id] === undefined) {
            console.warn("Function addChildrenToItems (src/index.js): Object parent not found, parent_id: ", parent_id);
         }
      }
   });
   return object
};

export const replaceAll = (text = '', search, replacement) => {
   //for (var x in obj) {
   if (text == null || typeof text !== 'string')
      return '';
   text = text.replace(new RegExp(search, 'g'), replacement);

   return text;
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
         return dateFormatter(value).format('DD MMMM YYYY');
      default:
         return value
   }
};

const isObject = (item) => {
   return (item && typeof item === 'object' && !Array.isArray(item));
};

export const mergeDeep = (target, source) => {
   if (isObject(target) && isObject(source)) {
      for (const key in source) {
         if (isObject(source[key])) {
            if (!target[key]) Object.assign(target, { [key]: {} });
            mergeDeep(target[key], source[key]);
         } else {
            Object.assign(target, { [key]: source[key] });
         }
      }
   }
   return target;
};

export const isEmpty = (obj) => {
   const hasOwnProperty = Object.prototype.hasOwnProperty;

   // null and undefined are "empty"
   if (obj == null) return true;

   // Assume if it has a length property with a non-zero value
   // that that property is correct.
   if (obj.length > 0) return false;
   if (obj.length === 0) return true;

   // If it isn't an object at this point
   // it is empty, but it can't be anything *but* empty
   // Is it empty?  Depends on your application.
   if (typeof obj !== "object") return true;

   // Otherwise, does it have any properties of its own?
   // Note that this doesn't handle
   // toString and valueOf enumeration bugs in IE < 9
   for (let key in obj) {
      if (hasOwnProperty.call(obj, key)) return false;
   }

   return true;
};

export const isNumber = (value) => {
   if (value === null)
      return false;
   return !isNaN(value)
};

export const generateRandomString = (length, stringsTaken) => {

   const generateString = (length) => {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
         result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
   };
   if (stringsTaken == null || stringsTaken.length === 0) {
      return generateString(length);
   }
   let current_string;
   let is_valid = false;
   do {
      current_string = generateString(length);

      // eslint-disable-next-line no-loop-func
      is_valid = stringsTaken.reduce((acum, item) => {
         return (acum && !(current_string === item))
      }, true)
   } while (!is_valid);

   return current_string;
};

export const isEqual = (value, other) => {

   // Get the value type
   const type = Object.prototype.toString.call(value);

   // If the two objects are not the same type, return false
   if (type !== Object.prototype.toString.call(other)) return false;

   // If items are not an object or array, return false
   if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;

   // Compare the length of the length of the two items
   const valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
   const otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
   if (valueLen !== otherLen) return false;

   // Compare two items
   const compare = function (item1, item2) {

      // Get the object type
      const itemType = Object.prototype.toString.call(item1);

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
      for (let i = 0; i < valueLen; i++) {
         if (compare(value[i], other[i]) === false) return false;
      }
   } else {
      for (let key in value) {
         if (value.hasOwnProperty(key)) {
            if (compare(value[key], other[key]) === false) return false;
         }
      }
   }

   // If nothing failed, return true
   return true;

};

export const parseTagsInText = (text) => {
   const result = text.match(/@\[[\w\s]*\]\(\d+\)/g);
   if (result && result.length > 0) {
      const parse = result.map(r => {
         const name = r.substring(
            r.lastIndexOf("[") + 1,
            r.lastIndexOf("]")
         );
         const html = `<strong style="color: blue;">${name}</strong>`;
         return {
            original: r,
            html
         }
      });
      const parsedText = parse.reduce((acum, item) => {
         return acum.replace(item.original, item.html);
      }, text);

      return parsedText
   } else {
      return text
   }
};

export const getRawText = (text) => {
   if (text == null)
      return '';
   const result = text.match(/@\[[\w\s]*\]\(\d+\)/g);
   if (result && result.length > 0) {
      const parse = result.map(r => {
         const name = r.substring(
            r.lastIndexOf("[") + 1,
            r.lastIndexOf("]")
         );
         const html = name;
         return {
            original: r,
            html
         }
      });
      const parsedText = parse.reduce((acum, item) => {
         return acum.replace(item.original, item.html);
      }, text);

      return parsedText
   } else {
      return text
   }
};

export const stripVowelAccent = (str) => {
   const regexToRemove = [
      { re: /[\xC0-\xC6]/g, ch: 'A' },
      { re: /[\xE0-\xE6]/g, ch: 'a' },
      { re: /[\xC8-\xCB]/g, ch: 'E' },
      { re: /[\xE8-\xEB]/g, ch: 'e' },
      { re: /[\xCC-\xCF]/g, ch: 'I' },
      { re: /[\xEC-\xEF]/g, ch: 'i' },
      { re: /[\xD2-\xD6]/g, ch: 'O' },
      { re: /[\xF2-\xF6]/g, ch: 'o' },
      { re: /[\xD9-\xDC]/g, ch: 'U' },
      { re: /[\xF9-\xFC]/g, ch: 'u' },
      { re: /[\xD1]/g, ch: 'N' },
      { re: /[\xF1]/g, ch: 'n' }];
   for (const regex of regexToRemove)
      str = str.replace(regex.re, regex.ch);
   return str;
};

export const sumPropsOfObjectArray = (arrayOfObjects) => {
   const items = arrayOfObjects;
   const keys = arrayOfObjects.length > 0 ? Object.keys(arrayOfObjects[0]) : [];

   let sums = {};

   each(items, function (item) {
      each(keys, function (prop) {
         sums[prop] = (sums[prop] || 0) + item[prop];
      });
   });

   return sums;
};

export const concatPropsOfObjectArray = (arrayOfObjects) => {
   const items = arrayOfObjects;

   const keys = arrayOfObjects.length > 0 ? Object.keys(arrayOfObjects[0]) : [];

   let sums = {};

   each(items, function (item) {
      each(keys, function (prop) {
         sums[prop] = sums[prop] ? sums[prop].concat(item[prop]) : [item[prop]];
      });
   });

   return sums;
};

export const isClipboardFromExcel = (e) => {
   // Get pasted data via clipboard API
   const clipboardData = e.clipboardData || window.clipboardData;
   const pastedData = clipboardData.getData('Text');

   const clipRows = pastedData.trim().split('\r\n');
   return clipRows.length > 1;
};

export const getClipboardTextFromExcel = (e) => {
   // Stop data actually being pasted into div
   e.stopPropagation();
   e.preventDefault();

   // Get pasted data via clipboard API
   const clipboardData = e.clipboardData || window.clipboardData;
   const pastedData = clipboardData.getData('Text');

   const clipRows = pastedData.trim().split('\r\n');
   const rows = [];
   const regexForBreakLines = /\r?\n|\r/g;
   let columnsToRemove = [];
   let firstRowSplitted = clipRows[0].trim().split('\t');

   // Check if exists empty columns. This is to remove posible combined columns.
   for (let y = 0; y < firstRowSplitted.length; y++) {
      if (firstRowSplitted[y] === '' && firstRowSplitted[y - 1] === '') {
         columnsToRemove.push(y);
         columnsToRemove.push(y - 1);
      }
   }
   columnsToRemove = columnsToRemove.filter((item, index) => columnsToRemove.indexOf(item) === index); // Remove duplicated values

   for (let x = 0; x < clipRows.length; x++) {
      // Split rows into columns
      let rowSplitted = clipRows[x].trim().split('\t');

      // Remove the set of empty columns
      rowSplitted = rowSplitted.filter((item, index) => columnsToRemove.indexOf(index) === -1)

      // Remove quotes from strings with break lines
      for (let y = 0; y < rowSplitted.length; y++) {
         if (typeof rowSplitted[y] === 'string' && rowSplitted[y].match(regexForBreakLines)) {
            if (rowSplitted[y].charAt(0) === '"' && rowSplitted[y].charAt(rowSplitted[y].length - 1) === '"') {
               rowSplitted[y] = rowSplitted[y].substring(1, rowSplitted[y].length - 1)
            }
         }
      }

      rows.push(rowSplitted);
   }

   return rows;
};

export const openFileInNewTab = (blobFile) => {
   // This function is to open a file (e.g: pdf, png, etc.) in a new tab in the browser
   const URL = window.URL || window.webkitURL;
   const dataUrl = URL.createObjectURL(blobFile);
   window.open(dataUrl, '_blank');
};
export const filterByText = (text, filter) => {
   let cleanedText = cleanText(text);
   cleanedText = cleanedText.toLocaleLowerCase();
   filter = filter.toLocaleLowerCase();
   return cleanedText.includes(filter);
}

export const formatRowsBeforePaste = (rows, parent_id, code) => {
   const trim = value => value ? value.trim() : null;

   return rows.map((row, i) => {
      // Rows should be copied in this order
      let [description, uom, quantity, ur] = row;

      description = trim(description);
      const short_description = trim(description ? description.substring(0, 40) : '');
      uom = trim(uom ? uom.toLowerCase() : null);
      quantity = trim(quantity);
      ur = trim(ur);

      const newRow = {
         is_item: 1,
         parent_id,
         code: `${code}.0${i + 1}`
      };
      newRow.description = description || "";
      newRow.short_description = short_description || "";
      newRow.uom = uom || "";
      if (quantity) {
         newRow.quantity = replaceAll(quantity, ',', '');
      }
      if (ur) {
         ur = replaceAll(ur.replace('$', '').trim(), ',', '');
         if (isNumber(ur)) {
            newRow.unit_rate = ur;
         }
      }
      return newRow;
   });
}

// One could simply use Canvas#toBlob method instead, but it's just to show
// that it can be done using result of SignaturePad#toDataURL.
export const dataURLToBlob = (dataURL) => {
   // Code taken from https://github.com/ebidel/filer.js
   const parts = dataURL.split(';base64,');
   const contentType = parts[0].split(":")[1];
   const raw = window.atob(parts[1]);
   const rawLength = raw.length;
   const uInt8Array = new Uint8Array(rawLength);

   for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
   }

   return new Blob([uInt8Array], { type: contentType });
};

export const hasOwnProperty = (object, key) => {
   return Object.prototype.hasOwnProperty.call(object, key);
};

export const getObjectProp = function (object, stringProp) {
   let s = stringProp;
   let o = object;
   s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
   s = s.replace(/^\./, '');           // strip a leading dot
   var a = s.split('.');
   for (var i = 0, n = a.length; i < n; ++i) {
      var k = a[i];
      if (k in o) {
         o = o[k];
      } else {
         return;
      }
   }
   return o;
}
export const KEY_CODES = {
   ARROW_UP: 38,
   ARROW_DOWN: 40,
   ENTER: 13,
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

export const getUserPrimaryRole = (user) => {
   if (user.project_role != null) {
      return user.project_role;
   }
   return user.roles ? (user.roles[0] ? user.roles[0] : null) : null;
};

export const groupUsersByRoles = (users) => {
   const groupedByRole = convertArrayToObjectV2(users, (e) => e.role.tag, { allowMultiple: true });
   return Object.keys(groupedByRole).map((e) => ({
      tag: e,
      name: groupedByRole[e][0].role.name,
      users: groupedByRole[e],
   })).sort((a, b) => a.tag < b.tag ? -1 : a.tag > b.tag ? 1 : 0);
};

/**
 * Convert uom (a text value) to a clean value to be used as a synonym
 * @param {String} uom
 * @returns {String} cleaned uom value
 */
export const convertUomToSynonymousFormat = (uom) => {
   let uomFormated = '';
   if (typeof uom === 'string') {
      uomFormated = uom;
      uomFormated = uomFormated.toLowerCase();
      uomFormated = uomFormated.replaceAll(' ', '');
      uomFormated = uomFormated.replaceAll('.', '');
      uomFormated = stripVowelAccent(uomFormated);
   }
   return uomFormated;
}

/** It returns a synonym of input UOM if there's an existing one
* @param {Object} measurement_units Object that contains all measurement units and their synonyms
* @param {String} value Value that represents UOM that will be checked
* @return {String} UOM synonym
*/
export const getUOMSynonym = (measurement_units, value) => {
   const measurementUnitsArray = convertObjectToArray(measurement_units);
   const uomSynonymsListObject = measurementUnitsArray.reduce((accum, uom) => {
      return {
         ...accum,
         ...uom.synonyms,
      }
   }, {});

   // Check if the measurement unit exists or exists a synonymous
   let uom = convertUomToSynonymousFormat(value);
   uom = uomSynonymsListObject[uom];
   return uom;
}


/**
 * Validate if the user have the rol or roles sent
 * @param {Object} user
 * @param {Array} roles
 * @returns {Boolean} cleaned uom value
 */
export const userHaveRole = (user, roles) => {
   if (user.project_role != null && user.project_role?.length > 0) {
      return (user.project_role.find((e) => roles.includes(e.tag)) !== undefined);
   }

   return user?.roles?.reduce((accum, role) => {
      return (roles.find((e) => e === role.tag) !== undefined) || accum;
   }, false);
};

/**
 * Sort method using local compare and the key property
 * @param {String} key property for the sort method
 * @returns {function(*, *): number} Return the value of the compare
 */
export const sortByLocalCompare = (key) => (a, b) => {
   const keyValueStringA = `${a[key]}`;
   const keyValueStringB = `${b[key]}`;
   return keyValueStringA.localeCompare(keyValueStringB, undefined, { numeric: true })
}

/** Validates that a text does not contain any non allowed words
 * @param {String} text The input text that may contain non allowed words
 * @param {Array} notAllowedWords The array of words that are not allowed on given string
 * @return {Boolean} A boolean that indicates wheter text is allowed or not
 */
export const validateNonAllowedWords = (text, nonAllowedWords) => {
   if (!(typeof text === 'string')) {
      return false;
   }

   if (!isArray(nonAllowedWords)) {
      return false;
   }

   for (const nonAllowWord in nonAllowedWords) {
      if (!(typeof nonAllowWord === 'string')) {
         return false;
      }
   }

   for (const nonAllowWord of nonAllowedWords) {
      if (text.trim().toLowerCase().includes(nonAllowWord.trim().toLowerCase())) {
         return false;
      }
   }

   return true;
};

/**
 * Substitutes the accents from a given string
 * @param {String} text The string to substitute accents from
 * @returns {String} The recieved string with accents substituted
 */
export const deaccentString = (text) => {
   return text.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

/**
 * Concats an array into another array in the given index position
 * @param {Array<Object>} targetArray The array to insert the elements to
 * @param {Array<Object>} injectArray The array to be inserted
 * @param {Number} index The index position to insert the injectArray
 * @returns {Array<Object>} The targetArray with the insertArray elements concatenated
 */
export const injectIntoArray = (targetArray, injectArray, index) => {
   const arrayLength = targetArray.length
   const startIndex = 0;
   const endIndex = index ?? arrayLength;
   const startSlice = targetArray.slice(startIndex, endIndex);
   const endSlice = targetArray.slice(endIndex, arrayLength);
   return startSlice.concat(injectArray).concat(endSlice);
};

export const calculateGranTotal = (rows, fields) => {
   const initialObj = fields.reduce((acum, f) => ({ ...acum, [f]: new Decimal(0) }), {})
   return Object.keys(rows).reduce((acum, key) => {
      const row = rows[key]

      if (row.parent_id == null) {
         let tmp = {}
         fields.forEach(field => {
            tmp[field] = acum[field].plus(Number(row[field] ?? 0))
         });
         return tmp
      } else
         return acum

   }, initialObj)
}

/**
 * This method add parent id to each element based on the code.
 * @Example
 * const items = [{code: '02', description: 'Limpieza'}, {code: '02.01', description: 'Cocina'}, {code: '02.01.01', description: 'Fabuloso'}]
 * output = [{code: '02', description: 'Limpieza', parent_id: null},
 *           {code: '02.01', description: 'Cocina', parent_id: '02'},
 *           {code: '02.01.01', description: 'Fabuloso', parent_id: '02.01'}]
 * @param {Array<Object>} rows
 * @param {Integer} index
 * @param {Integer} qty
 * @param {String} code
 * @param {String} parent_id
 * @returns
 */
export const addParentsIdUsingCode = (rows, index, qty, code, parent_id) => {
   const actualRow = rows[index]
   if (code != null && actualRow != null) {
      const codeLength = code.length
      const codeToCompare = actualRow.code.substring(0, codeLength)
      if (codeToCompare === code) {
         rows[index]['parent_id'] = parent_id
         addParentsIdUsingCode(rows, index + 1, qty, code, parent_id)
      }
      // if (code.length - actualRow.code.length > 2) return
   }
   if (index < qty) {
      addParentsIdUsingCode(rows, index + 1, qty, rows[index].code, rows[index].id)
   } else return
}

export const addIsItemToObjectArray = (objectArr, lastWillBeItem) => {
   const rowsObject = objectArr.reduce((acc, item) => {
      return {
         ...acc,
         [item.id]: item
      }
   }, {})
   const deepObject = objectArr.reduce((acc, item) => {
      const parentItem = rowsObject[item.parent_id] ? rowsObject[item.parent_id] : null
      let newItem = { ...item }
      let i = 0
      if (parentItem != null) {
         while (i < parentItem._children.length) {
            if (rowsObject[parentItem._children[i]]._children != null && !lastWillBeItem) {
               newItem['is_item'] = false
            } else {
               newItem['is_item'] = true
            }
            i++
         }
      }
      return [...acc, { ...newItem }]
   }, [])
   return deepObject
}

export const createTree = (rows, index, qty, code, parent_id, selectedRow, itemsArray) => {
   if (selectedRow._children[0]?.is_item) {
      let allChildrens = selectedRow._children
      rows.forEach((item) => {
         const newCode = generateCode(allChildrens)
         const newItem = {
            ...item,
            id: null,
            is_item: true,
            code: `${selectedRow.code}.${newCode}`,
            parent_id: selectedRow.id
         }
         allChildrens.push(newItem)
         itemsArray.push(newItem)
      })
      return false
   }
   else {
      let i = 0; const rowsLength = rows.length
      while (i < rowsLength) {
         const splittedCode = rows[i]?.code?.split('.')
         if (splittedCode?.length >= 1) {
            let j = 0; const splittedCodeLength = splittedCode.length
            while (j < splittedCodeLength) {
               const codeToCompare = splittedCode[j]
               if (!Number(codeToCompare)) {
                  console.log('El codigo no es valido')
                  return false
               }
               j++
            }
         } else {
            console.log('No se ha reconocido el codigo')
         }
         i++
      }
      addParentsIdUsingCode(rows, index, qty, code, parent_id)
      return true
   }
}


export const createObjectUsingFirstRow = (objectArray) => {
}

export const updateCode = (rows, lastCode, willBeASon = false) => {
   if (willBeASon) {

   } else {
      // const lastCodeSplitted = lastCode.split('.')
      // const lastCodeNumber = Number(lastCodeSplitted[0])

      // const justHeaders = Object.keys(rows).filter((key) => !rows[key].is_item && rows[key].parent_id == null)
      // let index = 1
      // const justHeadersUpdatedObject = justHeaders.reduce((acc, key) => {
      //    const updatedKey = lastCodeNumber + index
      //    index++
      //    return {
      //       ...acc,
      //       [rows[key].code]: `${updatedKey >= 10 ? updatedKey : '0' + updatedKey}`
      //    }
      // }, {})

      // const updatedItems = Object.keys(rows).reduce((acc, key) => {
      //    const splittedCode = rows[key].code.split('.')
      //    const firstElementCode = splittedCode[0]
      //    const newCode = justHeadersUpdatedObject[firstElementCode] ? justHeadersUpdatedObject[firstElementCode] : rows[key].code
      //    const secondPart = rows[key].code.substring(firstElementCode.length + 1, rows[key].code.length)
      //    const newFormattedCode = `${newCode}${secondPart ? '.' + secondPart : ''}`
      //    const newItem = {
      //       ...rows[key],
      //       code: newFormattedCode
      //    }
      //    return {
      //       ...acc,
      //       [key]: { ...newItem }
      //    }
      // }, {})
      // return updatedItems
   }
}


export const fixCodesAsNumbers = (rows, addZero = false) => {
   const objectRows = rows.reduce((acc, item) => { return { ...acc, [item[0]]: [...item] } }, {})
   const allCodes = rows.reduce((acc, item) => {
      return {
         ...acc,
         [item[0]]: item[0]
      }
   }, {})

   const formattedCodes = Object.keys(allCodes).reduce((acc, key) => {
      const spplitCode = key.split('.')
      const completeString = spplitCode.reduce((acc, item) => {
         return `${acc}${!addZero ? Number(item) : Number(item) > 10 ? Number(item) : '0' + Number(item)}.`
      }, '')
      const formattedString = completeString.substring(0, completeString.length - 1)
      return {
         ...acc,
         [key]: formattedString
      }
   }, {})

   const updatedItems = Object.keys(objectRows).map((key) => {
      const trimmedArray = objectRows[key].slice(1, objectRows[key].length)
      trimmedArray.unshift(formattedCodes[key])
      return [...trimmedArray]
   })
   return updatedItems
}

export const recursiveFunction = (rows, actualRow, parentRow, childrenObject) => {
   const parentCode = parentRow.code
   if(childrenObject[parentCode] == null){
      childrenObject[parentCode] = []
   }
   const newCode = generateCode(childrenObject[parentCode])
   rows[actualRow.id].code = `${parentCode}.${newCode}`
   childrenObject[parentCode].push(rows[actualRow.id])
   if(rows[actualRow.id]._children != null){
      rows[actualRow.id]._children.forEach((item) => {
         recursiveFunction(rows, rows[item], rows[actualRow.id], childrenObject)
      })
   }
}

export const formatCodes = (rows, selectedRow) => {
   const objectRows = rows.reduce((acc, item) => { return { ...acc, [item.id]: { ...item } } }, {})
   const justHeaders = rows.reduce((acc, item) => {
      if (item.parent_id == selectedRow.id) {
         return [...acc, item]
      }
      return acc
   }, [])

   justHeaders.forEach((item, index) => {
      const newCode = generateCode(selectedRow._children)
      justHeaders[index].code = `${selectedRow.code}.${newCode}`
      objectRows[item.id].code = `${selectedRow.code}.${newCode}`
      
      selectedRow._children.push({...item, code: `${selectedRow.code}.${newCode}`})
   })
   // Children object is an object with code keys and array of children as values
   const childrenObject = {}
   justHeaders.forEach((item) => {
      if(item._children) {
         item._children.forEach((child) => {
         recursiveFunction(objectRows, objectRows[child], item, childrenObject)
         })
      }
   })
   return objectRows
}

export const formatPastingRows = (selectedRow, newRows, willBeASon, lastIndex, parent_code = null, lastWillBeItem = true) => {
   const newIndex = lastIndex + 1
   const correctCodeRows = fixCodesAsNumbers(newRows, true)
   const orderedRows = correctCodeRows.sort()
   const rowsArray = orderedRows.map((row, index) => {
      const newRow = { code: row[0], description: row[1], id: index + newIndex, is_item: false }
      if (willBeASon) {
         newRow.parent_id = selectedRow.id
      }
      return newRow
   })
   let objectArray = []
   const isOk = createTree(rowsArray, 0, rowsArray.length - 1, null, null, selectedRow, objectArray)
   if (isOk) {
      const objectOfRows = rowsArray.reduce((acc, row) => {
         acc[row.id] = { ...row }
         return acc
      }, {})

      let rowsWithChildren = addChildrenToItems(objectOfRows, lastWillBeItem)
      const finalArray = Object.keys(rowsWithChildren).map((key) => {
         return {
            ...rowsWithChildren[key],
            is_header: rowsWithChildren[key].parent_id == selectedRow.id
         }
      }
      )
      const finalRows = lastWillBeItem ? addIsItemToObjectArray(finalArray) : finalArray
      const newRows = formatCodes(finalRows, selectedRow)
      // let finalObjectRows = finalRows.reduce((acc, row) => {
      //    acc[row.id] = { ...row }
      //    return acc
      // }, {})
      return newRows
   } else {
      const newRows = formatCodes(objectArray, selectedRow)

      return newRows
   }
}
