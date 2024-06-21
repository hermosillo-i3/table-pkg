# FIVEBIM-TABLE.
This file is used to explain in detail changes made to the Table.

<!-- TOC -->
  [[TOC]]

## V 1.5.0
Date: Jun 21, 2024
* [NEW]
  * Add new colors for row levels (6, 7, 8) and their hover colors 

## V 1.4.0
Date: Jun 19, 2024
* [FIX]
  * Fix freeze horizontal in table row items 
  * Fix hover in table row items with depth 1 to 5

## V 1.3.1
Date: Jun 13, 2024
* [FIX]
  * Remove duplicate options in FilterColum when type is Search 
  * Removing all options was not showing all rows

## V 1.3.0
Date: Jun 12, 2024
* [NEW]
  * InputFieldSearch, component to search in a catalog of items. 
  * Add hover style for colored rows

## V 1.2.0
Date: Apr 29, 2024
* [FIX]
  * Fix bug with style when hover a selected row. 
  * Fix bug with style when a row is deselected.

## V 1.1.6
Date: Feb 29, 2024
* [FIX]
  * Show subrows in CSV files

## V 1.1.5
Date: Feb 23, 2024
* [UPDATE]
  * Filter object values when generating CSV file

## V 1.1.4
Date: Feb 16, 2024
* [FIX]
  * Fix total row in shouldRenderCell function

## V 1.1.3
Date: Feb 16, 2024
* [UPDATE]
  * Change color on boolean cells when row is item
* [FIX]
  * Render false boolean cells

## V 1.1.2
Date: Feb 16, 2024
* [UPDATE]
  * Added format boolean icon props

## V 1.1.1
Date: Jan 29, 2024
* [UPDATE]
  * Remove Husky from repository

## V 1.1.0
Date: Jan 26, 2024
* [NEW]
  * Add property to Column to add popups in their cells

## V 1.0.2
Date: Nov 28, 2023
* [UPDATE]
  * Empty state card to manage a button action

## V 1.0.1
Date: Nov 7, 2023
* [FIX]
  * Drag n Drop in noRowsCard
  * Missing style when hovering no rows card

## V 1.0.0
Date: Oct 30, 2023
* [NEW]
  * Update package versions in package json 
  * Add filter for select type column

## V 0.2.29
Date: Sep 22, 2023
* [UPDATE]
  * Removal of svg libraries that are not used

## V 0.2.28
Date: Sep 22, 2023
* [UPDATE]
  * Update fortawesome dependencies in package json

## V 0.2.27
Date: Sep 08, 2023
* [NEW]
  * Add readme file

## V 0.2.26
Date: Sep 06, 2023
* [UPDATE]
  * Deprecated node-sass dependency replace for sass

## V 0.2.25
Date: Aug 11, 2023
* [FIX]
  * Fix paste event in table.

## V 0.2.24
Date: Jun 27, 2023
* [FIX]
  * Omit dev dependencies on pipeline.
  * Ignore scripts when installing.

## V 0.2.23
Date: Jun 26, 2023
* [FIX]
  * Testing husky pre push
  * Table now can be used with yarn link

## V 0.2.22
Date: May 24, 2023
* [UPDATE]
  * Revert onChangeDate behaviour
* [FIX]
  * Bug in freezed columns, row background color changes to transparent

## V 0.2.21
Date: May 9, 2023
* [FIX]
  * Bug in input for date. Date now changes only when the user clicks a date, not with arrows

## V 0.2.20
Date: Apr 19, 2023
* [FIX]
  * Bug when trying to sort columns, kept sorting by the table default sort method

## V 0.2.19
Date: Apr 10, 2023
* [UPDATE]
  * Removed Todo-List column
  
## V 0.2.18
Date: Mar 27, 2023
* [NEW]
  * Sort of alphanumeric code and prop
  * Select icon for table rows

## V 0.2.17
Date: Sep 21, 2022
* [UPDATE]
  * Removed moment library

## V 0.2.16
Date: Aug 25, 2022
* [UPDATE]
  * Added save of data when hitting enter for input field types

## V 0.2.15
Date: Aug 19, 2022
* [FIX]
  * Fix import declaration

## V 0.2.14
Date: Aug 19, 2022
* [NEW]
  * Drag and drop independent context
* [UPDATE]
  * Removed context library

## V 0.2.13
Date: Aug 18, 2022
* [FIX]
  * Chain validation for null objects

## V 0.2.12
Date: Jul 26, 2022
* [UPDATE]
  * Input form regex test

## V 0.2.11
Date: Jun 15, 2022
* [UPDATE]
  * Removed husky prepare script

## V 0.2.10
Date: Jun 15, 2022
* [FIX]
  * Compress text class
  * Support for compress text editable
* [UPDATE]
  * Husky hooks for pre-push and post-commit

## V 0.2.9
Date: Jun 10, 2022
* [UPDATE]
  * Table reference for sync on multiple
  * Row custom classname for column
  * EmptyStateCard validation for icon when null

## V 0.2.8
Date: Jun 10, 2022
* [NEW]
  * Compress text funcionality for table rows
  * Native datepicker
* [UPDATE]
  * React datepicker removed
* [FIX]
  * Dropzone sticky row

## V 0.2.6
Date: Jun 3, 2022
* [UPDATE]
  * Restructure of dependencies

## V 0.2.5
Date: Jun 3, 2022
* [UPDATE]
  * Removed unused dependencies

## V 0.2.4
Date: Jun 3, 2022
* [UPDATE]
  * Proptypes for table column
  * Storybook to add a freeze story

## V 0.2.3
Date: Jun 3, 2022
* [FIX]
  * Util that convert tree structure to flat array

## V 0.2.2
Date: Jun 2, 2022
* [UPDATE]
  * Restructure of dependencies
* [FIX]
  * Crashed image on compiled page

## V 0.2.1
Date: Jun 1, 2022
* [FIX]
  * Crashed image on compiled page

## V 0.2.0
Date: Jun 1, 2022
* [NEW]
  * Custom theming for storybook
* [UPDATE]
  * Removed storybook introduction

## V 0.1.8
Date: Jun 1, 2022
* [UPDATE]
  * Gitlab script update for storybook

## V 0.1.7
Date: Jun 1, 2022
* [UPDATE]
  * Gitlab script update for storybook

## V 0.1.6
Date: Jun 1, 2022
* [UPDATE]
  * Gitlab deploy for storybook

## V 0.1.5
Date: May 31, 2022
* [NEW]
  * Added gitlab pages support
* [UPDATE]
  * Removed storybook non-used pages

## V 0.1.4
Date: May 30, 2022
* [FIX]
  * Utils empty import

## V 0.1.3
Date: May 30, 2022
* [FIX]
  * Index imports and exports

## V 0.1.2
Date: May 30, 2022
* [NEW]
  * Husky implementation

## V 0.1.1
Date: May 23, 2022
* [FIX]
  * Decimal bug when adding a decimal

## V 0.1.0
Date: May 23, 2022
* [NEW]
  * Prototype stable table version