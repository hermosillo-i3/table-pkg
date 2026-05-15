export const DRAG_COLUMN_WIDTH = 25;

/**
 * Inline styles for frozen columns using position:sticky so the browser keeps
 * them aligned with horizontal scroll (avoids transform + scroll jitter).
 */
export function getFrozenStickyStyles(columns, colIndex, isDragColumnVisible) {
   const col = columns[colIndex];
   if (!col || !col.freeze) return null;
   let left = 0;
   if (isDragColumnVisible && columns[0]?.freeze) {
      left += DRAG_COLUMN_WIDTH;
   }
   for (let j = 0; j < colIndex; j++) {
      if (columns[j]?.freeze) {
         left += columns[j].width;
      }
   }
   return {
      position: 'sticky',
      left,
      /* Only stack above adjacent non-sticky cells. */
      zIndex: 3 + colIndex,
   };
}

/** Sticky styles for the drag handle column when the first data column is frozen. */
export function getDragFrozenStickyStyle(columns, isDragColumnVisible) {
   if (!isDragColumnVisible || !columns?.[0]?.freeze) return null;
   return {
      position: 'sticky',
      left: 0,
      zIndex: 2,
   };
}

const parent_elt = (wanted_node_name, elt) => {
   // Function to work up the DOM until it reaches
   // an element of type wanted_node_name, and return
   // that element.

   const this_parent = elt.parentElement;
   if ((this_parent == null) || (this_parent.nodeName == null)) {
            // Sad trombone noise.
      return null;
   } else if (this_parent.nodeName === wanted_node_name) {
            // Found it:
      return this_parent;
   } else {
      // Recurse:
      return parent_elt(wanted_node_name, this_parent);
   }
}


function getElementBackgroundColor(element) {
   return getComputedStyle(element.parentElement).backgroundColor;
}

export const updateFreezeCells = (tableClassName) => {
// Add event listeners.
   const tables = document.getElementsByClassName(tableClassName);
   for (const tableElement of tables) {
      const fixed_horizontal_elements = tableElement.getElementsByClassName('freeze_horizontal');
      const tableCells = tableElement.getElementsByTagName('td');
      if (tableCells != null) {
         for (let i = 0; i < tableCells.length; i++) {
            const cell = tableCells[i];
            cell.style.removeProperty('transform')   
         }
      }
      for (const item of fixed_horizontal_elements) {
         const parent_tr = parent_elt("TR", item);

         if (parent_tr.className.match("tr_shaded")) {
            item.style.backgroundColor = getElementBackgroundColor(item);
         }
      }
   }
}
