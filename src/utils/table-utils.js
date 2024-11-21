export const addFreezeColumns = (tableClassName) => {
   console.time('addFreezeColumns - 1');

   updateFreezeCells(tableClassName);
// Add event listeners.

   const tables = document.getElementsByClassName(tableClassName);
   for (let i = 0; i < tables.length; i++) {
      const tableElement = tables[i];
      tableElement.addEventListener("scroll", freeze_pane_listener(tableElement, tableClassName));
   }
   console.timeEnd('addFreezeColumns - 1');

};

const freeze_pane_listener = (tableElement) => {
   return function () {
      console.time('freeze_pane_listener - 3');
      let i;
      const translate_x = "translate(" + tableElement.scrollLeft + "px,0px)";

      const fixed_horizontal_elts = tableElement.getElementsByClassName('freeze_horizontal');

      // The webkitTransforms are for a set of ancient smartphones/browsers,
      // one of which I have, so I code it for myself:
      for (i = 0; i < fixed_horizontal_elts.length; i++) {
         fixed_horizontal_elts[i].style.webkitTransform = translate_x;
         fixed_horizontal_elts[i].style.transform = translate_x;
      }
      console.timeEnd('freeze_pane_listener - 3');
   }
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
console.time('updateFreezeCells -2');
   const tables = document.getElementsByClassName(tableClassName);
   for (const tableElement of tables) {
      // const fixed_horizontal_elements = tableElement.getElementsByClassName('freeze_horizontal');
      // const tableCells = tableElement.getElementsByTagName('td');
      const fixed_horizontal_elements = Array.from(tableElement.getElementsByClassName('freeze_horizontal'));
      const tableCells = Array.from(tableElement.getElementsByTagName('td'));
      if (tableCells != null) {
         for (let i = 0; i < tableCells.length; i++) {
            const cell = tableCells[i];
            // cell.style.removeProperty('transform')  
            cell.style.transform = '';   
         }
      }
      for (const item of fixed_horizontal_elements) {
         const parent_tr = parent_elt("TR", item);

         if (parent_tr.className.match("tr_shaded")) {
            item.style.backgroundColor = getElementBackgroundColor(item);
         }
      }
      freeze_pane_listener(tableElement, tableClassName)();
      
   }
   console.timeEnd('updateFreezeCells -2');
}
