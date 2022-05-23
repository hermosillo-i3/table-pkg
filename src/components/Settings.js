import React, {useEffect, useState} from 'react'
import {Table, Button, Input, Checkbox, Modal, Confirm, Icon} from "semantic-ui-react";
import PropTypes from 'prop-types'
import {getColumnKey} from "../../utils/column";
import {convertArrayToObjectV2} from "../../utils/index";

const Settings = (props) => {

   const {profile} = props;

   let columnsFromGroups = {};

   // Flat columns to get one list of all columns including the nested columns
   let flatColumns = props.columns.reduce((accum, e) => {
      accum.push(e);
      if (e.columns) {
         accum.push(...e.columns);
         e.columns.forEach((column) => {
            columnsFromGroups= {
               ...columnsFromGroups,
               [column.key]: {
                  ...column,
                  'parent_column_key': e.key,
               },
            }
         })
      }
      return accum;
   }, []);
   const widthState = convertArrayToObjectV2(flatColumns, 'key');

   const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
   const [name, setName] = useState(profile ? profile.name : '');
   const [columns, setColumns] = useState(widthState);

   useEffect(() => {
      setName(profile ? profile.name : '');
   }, [profile]);

   useEffect(() => {
      let columnsFromGroups = {};
      const flatColumns = props.columns.reduce((accum, e) => {
         accum.push(e);
         if (e.columns) {
            accum.push(...e.columns);
            e.columns.forEach((column) => {
               columnsFromGroups= {
                  ...columnsFromGroups,
                  [column.key]: {
                     ...column,
                     'parent_column_key': e.key,
                  },
               }
            })
         }
         return accum;
      }, []);
      const widthState = convertArrayToObjectV2(flatColumns, 'key');
      setColumns(widthState);
   }, [props.columns]);

   const changeWidth = (assesor) => (e) => {
      let value = e.target.value;
      if (value.length > 0) {
         if (isNaN(value)) {
            value = 0
         } else {
            value = parseInt(value)
         }
      }
      columns[assesor].width = value;
      columns[assesor].is_width_calculate = false;
      setColumns({...columns})
   };
   const handleChangeAutoWidth = (assesor) => (e) => {
      columns[assesor].is_width_calculate = !columns[assesor].is_width_calculate;
      setColumns({...columns})
   };
   const handleChangeFreeze = (assesor) => (e) => {
      const indexOfCurrentAssesor = flatColumns.findIndex(column => column.key === assesor);

      // Check the subsequent columns freeze property (Only when current freeze property is true)
      if (Object.prototype.hasOwnProperty.call(columns[assesor], 'freeze') && columns[assesor].freeze === true) {
         flatColumns = flatColumns.map((column) => { // flatColumns is updated in case that is queried and the state 'columns' has not yet been updated.  
            return {
               ...columns[column.key],
            }
         });
         const existsAFreezeColumnAfterCurrentOne = flatColumns.slice(indexOfCurrentAssesor + 1)
            .findIndex(column => Object.prototype.hasOwnProperty.call(column, 'freeze') && column.freeze === true) !== -1 ? true : false;
         // If there is a freeze column after the current one, it will be deactivated.
         if(existsAFreezeColumnAfterCurrentOne) {
            for(let i=indexOfCurrentAssesor + 1; i < flatColumns.length; i++){
               columns[flatColumns[i].key].freeze = false;
            }
         }
      }
      
      // Check the previous columns freeze property (Only when current freeze property is false)
      if (indexOfCurrentAssesor > 0 && (!Object.prototype.hasOwnProperty.call(columns[assesor], 'freeze') || columns[assesor].freeze === false)) {
         // It will activate the precious columns freeze property.
         for(let i=0; i < indexOfCurrentAssesor; i++){
            columns[flatColumns[i].key].freeze = true;
         }
      }

      // Apply freeze property to current column
      columns[assesor].freeze = !columns[assesor].freeze;

      // Activate the children columns if current column is a parent of a group of columns and it is been activated
      if (columns[assesor].columns && columns[assesor].freeze) {
         const childrenColumns = columns[assesor].columns;
         childrenColumns.forEach((column) => {
            columns[column.assesor].freeze = true;
         })
      }

      // Freeze properties are applied to columns
      setColumns({...columns})
   };

   const checkValidValues = () => {
      return Object.keys(columns).reduce((acum, colkey) => {
         return acum && typeof columns[colkey] != 'string'
      }, true)
   };

   const onClose = () => {
      if (checkValidValues()) {
         props.onSubmit({name, columns});
      }
      props.onClose()
   };

   const handleToggleColumn = (key) => {
      columns[key].is_visible = !columns[key].is_visible;
      setColumns({...columns})
   };


   const handleChangeName = (e) => {
      setName(e.target.value);
   };

   const renderColumns = (columns) => {
      const columnsKeys = Object.keys(columns);
      return columnsKeys.map(key => (
         <React.Fragment key={key}>
            <Column data={columns[key]} changeWidth={changeWidth} toggleColumn={handleToggleColumn}
                    onChangeAutoWidth={handleChangeAutoWidth} onChangeFreeze={handleChangeFreeze} columnsFromGroups={columnsFromGroups}/>
         </React.Fragment>
      ))
   };

   const handleCancelDelete = () => {
      setIsConfirmDeleteOpen(false);
   };
   const handleConfirmDelete = () => {
      if (props.onConfirmDelete) {
         props.onConfirmDelete(profile.id);
         setIsConfirmDeleteOpen(false);
      }
   };

   const handleDelete = () => {
      setIsConfirmDeleteOpen(true);
   };

   const isFromProfile = profile != null;

   return (
      <React.Fragment>
         <Modal
            className='modal-table-settings'
            open={props.isOpen}
            onClose={props.onClose}
            closeOnDimmerClick={false}
         >
            <Modal.Header>
               {isFromProfile
                  ? (
                     <div className='header-table-settings'>
                        <Input onChange={handleChangeName} value={name}
                               className='input-table-settings'/>
                        <Icon name='trash' onClick={handleDelete}/>
                     </div>
                  )
                  : "Predeterminado"}
            </Modal.Header>
            <Modal.Content>
               <Table celled>
                  <Table.Header>
                     <Table.Row>
                        <Table.HeaderCell>Columna</Table.HeaderCell>
                        <Table.HeaderCell>Mostrar/Ocultar</Table.HeaderCell>
                        <Table.HeaderCell>Ancho de la celda</Table.HeaderCell>
                        <Table.HeaderCell>Ancho automatico</Table.HeaderCell>
                        <Table.HeaderCell>Congelar celda</Table.HeaderCell>
                     </Table.Row>
                  </Table.Header>

                  <Table.Body>
                     {renderColumns(columns)}
                  </Table.Body>

                  <Table.Footer fullWidth>
                     <Table.Row>
                        <Table.HeaderCell colSpan='5'>
                           <Button fluid onClick={onClose}>OK</Button>
                        </Table.HeaderCell>
                     </Table.Row>
                  </Table.Footer>
               </Table>
            </Modal.Content>
         </Modal>
         {isFromProfile && <Confirm
            open={isConfirmDeleteOpen}
            confirmButton='Confirmar'
            cancelButton='Cancelar'
            header='¿Estás seguro?'
            onCancel={handleCancelDelete}
            onConfirm={handleConfirmDelete}
         />}
      </React.Fragment>
   )
};

const Column = ({data, changeWidth, toggleColumn, onChangeAutoWidth, onChangeFreeze, columnsFromGroups}) => {
   let description = data.Header;

   if(typeof data.Header !== 'string'){
      description = data.description;
   }

   const key = getColumnKey(data);
   return (
      <Table.Row>
         <Table.Cell>{description}</Table.Cell>
         <Table.Cell
            style={{
               cursor: 'pointer'
            }}
            onClick={() => toggleColumn(key)}
         >
            {data.is_visible ? '✓' : 'X'}
         </Table.Cell>
         {data.columns == null ? (
            <Table.Cell>
               <Input fluid={true} onChange={changeWidth(key)} value={data.width} disabled={data.is_width_calculate}/>
            </Table.Cell>
         ) : <Table.Cell/>}
         {data.columns == null ? (
            <Table.Cell collapsing>
               <Checkbox fluid={"true"} onChange={onChangeAutoWidth(key)} checked={data.is_width_calculate}/>
            </Table.Cell>
         ) : <Table.Cell/>}
         {columnsFromGroups[data.assesor] == null ? (
            <Table.Cell collapsing>
               <Checkbox fluid={"true"} onChange={onChangeFreeze(key)} checked={data.freeze}/>
            </Table.Cell>
         ) : <Table.Cell/>}
      </Table.Row>
   )
}

Settings.propTypes = {
   columns: PropTypes.array,
   onClose: PropTypes.func,
   toggleColumn: PropTypes.func,
   onSubmit: PropTypes.func,
   isColumnVisible: PropTypes.func,
}

export default Settings
