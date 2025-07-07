# FIVEBIM-TABLE.
This file is used to explain in detail changes made to the Table.

<!-- TOC -->
  [[TOC]]
## V 1.14.5
Date: Jul 04, 2025
* [FIX]
  * Fix the formatting of the rows before calling props.onPasteRows, allowing to paste several rows at the same time

## V 1.14.4
Date: Jul 02, 2025
* [FIX]
  * Enhance date filtering in InputForm and remove unused prop from TableDatePicker

## V 1.14.3
Date: Jul 02, 2025
* [FIX]
  * Change date disableling to column level instead of table

## V 1.14.2
Date: Jun 27, 2025
* [FIX]
  * Fix locale in date picker

## V 1.14.1
Date: Jun 19, 2025
* [FIX]
  * Adjust Table.scss styles
* [UPDATE]
  * Update react-datepicker version to the same one from the APP

## V 1.14.0
Date: Jun 19, 2025
* [NEW]
  * Add new date picker in columns with date type to filter non-Working days
* [UPDATE]
  * Change english text to spanish

## V 1.13.0
Date: Jun 10, 2025
* [NEW]
  * Add new type of filter column where you can search within the select options

## V 1.12.1
Date: Jun 5, 2025
* [FIX]
  * Fix an error when using invisible, frozen columns with custom sizes causing the following problems:
    - The frozen columns may change their stated width to take all the available space left by the invisible columns, and cover the whole horizontal space. 
    - Setting a width to these columns would not affect the rendered table as they would still take the available space left by the invisible columns

## V 1.12.0
Date: Apr 10, 2025
* [UPDATE]
  * Migrate from the local dateFormatter implementation to the one from utils-pkg

## V 1.11.4
Date: Mar 10, 2025
* [NEW]
  * Add a new light yellow color for the rows, so it can be used to highlight rows in precalificacion.

## V 1.11.3
Date: Jan 30, 2025
* [UPDATE]
  * Update the Table-Row-Warning class to include a color for disabled columns

## V 1.11.2
Date: Jan 27, 2025
* [FIX]
  * Make border visible when using non-editable style

## V 1.11.1
Date: Jan 27, 2025
* [FIX]
  * Fix non-editable style for null values

## V 1.11.0
Date: Jan 23, 2025
* [NEW]
  * Add style in scss for non editable columns
* [FIX]
  * Fix the color for custom rows when freezing

## V 1.10.2
Date: Jan 10, 2025
* [FIX]
  * Change comparison for previous props.actions on componentShouldUpdate, from JSON.stringify to isEqual

## V 1.10.1
Date: Dec 04, 2024
* [FIX]
  * Add validation when a value is empty in the case 'percentage' in formatColumn

## V 1.10.0
Date: Nov 27, 2024
* [NEW]
  * Add merge-main-to-pages.yml script for github actions

## V 1.9.4
Date: Nov 27, 2024
* [FIX]
  * Allow to delete the values for inputs of type percentage

## V 1.9.3
Date: Nov 25, 2024
* [FIX]
  * Fix sass warnings for 5BIMP due to deprecated code

## V 1.9.2
Date: Nov 05, 2024
* [FIX]
  * Fix editable option for columns when format is percentage.

## V 1.9.1
Date: Nov 05, 2024
* [FIX]
  * Fix sort in Table when columns format is currency/number

## V 1.9.0
Date: Sep 27, 2024
* [UPDATE]
  * Move applyFilter from Table.js to utils/index.js
* [NEW]
  * Add test for applyFilter

## V 1.8.0
Date: Sep 5, 2024
* [FIX]
  * Fix width issue

## V 1.7.0
Date: Aug 27, 2024
* [NEW]
  * Columns now can display buttons using the 'actions' param

## V 1.6.0
Date: Aug 13, 2024
* [NEW]
  * Add new pull request template
  * Add date filter
* [FIX]
  * Warnings with scss base file 
  * Fix checkbox alignment
  * Fix label alignment

## V 1.5.2
Date: Jul 18, 2024
* [UPDATE]
  * Add hover on certain row styles 

## V 1.5.1
Date: Jun 21, 2024
* [UPDATE]
  * Change font color on table headers

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
