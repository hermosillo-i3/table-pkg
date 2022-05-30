import './_base.scss'; 
import DefaultTable from './components/Table/Table';
import TableComponent from './components/Table/Table';
import RowComponent from './components/Row';
import DropZoneComponent from './components/DropZone';
import ContextMenuComponent from './components/ContextMenu/ContextMenu';
import EmptyStateCardComponent from './components/EmptyStateCard/EmptyStateCard';
import FilterColumnComponent from './components/FilterColumn';
import HeaderComponent from './components/Header';
import InputFieldComponent from './components/InputField';
import NoRowsCardComponent from './components/NoRowsCard';
import SettingsComponent from './components/Settings';
import ToolbarComponent from './components/Toolbar/Toolbar';
import UtilsComponent from './utils/Utils';

// export default Table;
// export {
//     Table as Table,
//     Row,
//     DropZone,
//     ContextMenu,
//     EmptyStateCard,
//     FilterColumn,
//     Header,
//     InputField,
//     NoRowsCard,
//     Settings,
//     Toolbar,
//     Utils,
// };

export const Table = TableComponent;
export const Row = RowComponent;
export const DropZone = DropZoneComponent;
export const ContextMenu = ContextMenuComponent;
export const EmptyStateCard = EmptyStateCardComponent;
export const FilterColumn = FilterColumnComponent;
export const Header = HeaderComponent;
export const InputField = InputFieldComponent;
export const NoRowsCard = NoRowsCardComponent;
export const Settings = SettingsComponent;
export const Toolbar = ToolbarComponent;
export const Utils = {
    ...UtilsComponent,
};
export default TableComponent;