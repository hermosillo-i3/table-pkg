import React from 'react'
import { Icon, Popup, Button, Modal } from "semantic-ui-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select";
import ModalForm from "../ModalForm";
import { CSVLink } from "react-csv";
import { convertTreeStructureToFlatArray } from "../../utils/Utils";
import './Toolbar.scss';


const styles = {
   groupActions: {
      container: {
         display: 'inline-block',
         border: '1px solid #e8e8e8',
         borderRadius: '5px',
         marginRight: '1rem'
      },
      header: {
         fontSize: '0.7rem',
         marginLeft: '5px',
         fontWeight: 500,
         position: 'absolute',
         top: '1px',
         background: 'white',
         padding: '0 .833em',
         borderRadius: '.28571429rem',
      }
   }
};

const getHeaderText = col => {
   if (typeof col.Header === 'string') {
      return col.Header
   } else {
      return col.HeaderRaw ?? ''
   }
}

const userConfigurationSelectStyles = {
   option: (styles, { data }) => {
      return {
         ...styles,
         color: data.color != null ? data.color : styles.color,
         cursor: data.cursor != null ? data.cursor : 'default',
      };
   },
};

export default class Toolbar extends React.Component {

   constructor(props) {
      super(props);
      this.state = {
         is_create_profile_modal_open: false
      }
   }


   handleChangeProfile = (data) => {
      const { value } = data;
      const {
         onChangeProfile
      } = this.props;
      if (value === -1) {
         this.setState({ is_create_profile_modal_open: true });
      } else if (onChangeProfile) {
         onChangeProfile(value);
      }
   };

   handleCreateProfileCloseModal = () => {
      this.setState({ is_create_profile_modal_open: false })
   };

   handleCreateProfile = (values) => {
      if (this.props.onCreateProfile)
         this.props.onCreateProfile(values, this.handleCreateProfileCloseModal);
   };

   getExcelRows = () => {

      return convertTreeStructureToFlatArray(this.props.rows ?? [], 'subrows');
   }

   render() {
      const { props, state } = this;
      const {
         is_create_profile_modal_open
      } = state;
      const {
         shouldRenderDefaultActions,
         pasteModalActive = false,
         enableProfileConfiguration = false,
         profiles = [],
         profileSelected,
         allowToDownloadCVS = false
      } = props;
      const allowToOpenSettings = props.allowToOpenSettings === undefined ? true : props.allowToOpenSettings;
      const icon_size = 'large';
      const button_style = { paddingTop: '.2rem', paddingBottom: '.2rem', boxShadow: 'none' };
      const optionsProfiles = [
         ...profiles.map((e) => ({ value: e.id, label: e.name })),
         { value: -1, label: 'Crear nuevo perfil...', color: '#2185d0', cursor: 'copy' }
      ];

      let profileSelectedOption = optionsProfiles.find((e) => e.value === profileSelected);
      if (profileSelectedOption === undefined) {
         profileSelectedOption = null;
      }
      const left_actions = [], right_actions = [];

      //  Separete actions

      for (let index = 0; index < props.actions.length; index++) {
         const action = props.actions[index];
         if (action.position === 'right') {
            right_actions.push(action)
         } else {
            left_actions.push(action)
         }
      }

      //  Get styles

      const left_actions_style = {
         flex: `1`,
         alignItems: 'flex-start',
         display: 'flex'
      };

      const right_actions_style = {
         flex: `1`,
         justifyContent: 'flex-end',
         display: 'flex'
      };


      const renderButton = (item) => {
         if (item.actions != null) {
            const styleHeader = { ...styles.groupActions.header };
            if (item.color) {
               styleHeader.color = item.color;
            }
            if (item.backgroundColor) {
               styleHeader.backgroundColor = item.backgroundColor;
            }
            return (
               <div style={styles.groupActions.container} key={item.name}>
                  <span style={styleHeader}>{item.name}</span>
                  <Button.Group>
                     {item.actions.map((e) => renderButton(e))}
                  </Button.Group>
               </div>
            )
         }
         if (item.custom_button)
            return React.cloneElement(
               item.custom_button(),
               { key: item.name }
            );
         else
            return <Popup key={item.name} trigger={
               <Button
                  basic
                  style={button_style}
                  icon={item.icon !== undefined}
                  size={item.icon ? "large" : "small"}
                  active={item.active}
                  onClick={item.action}
                  loading={item.loading}
                  disabled={item.disabled}
                  type="button"
               >
                  {(item.icon === undefined && item.fasicon === undefined) && item.name}
                  {item.subIcon ? (
                     <Icon.Group>
                        <Icon name={item.icon} rotated={item.iconRotation} />
                        <Icon corner={item.subIconPosition ? item.subIconPosition : 'top right'}
                           name={item.subIcon} />
                     </Icon.Group>
                  ) : (
                     item.fasicon ? <FontAwesomeIcon icon={item.fasicon} /> :
                        <Icon name={item.icon} rotated={item.iconRotation} />
                  )}
               </Button>
            } content={item.name} inverted />
      };

      const renderExpandRowsButton = () => {
         if (props.expandElements && props.expandElements.displayButton) { // Check if the button needs to be displayed
            if (!props.expandElements.isRowSelected) { // Display the button to expand all the header rows.
               return (
                  <Popup
                     trigger={
                        <Button style={button_style} size={icon_size} icon='angle double down' basic
                           onClick={props.expandElements.action} type="button" />
                     }
                     content='Expandir todos los elementos'
                     inverted
                  />
               )
            } else {
               if (props.expandElements.isRowHeaderSelected) { // Display the button to expand only the header rows selected.
                  return (
                     <Popup
                        trigger={
                           <Button style={button_style} size={icon_size} icon='angle down' basic
                              onClick={props.expandElements.action} type="button" />
                        }
                        content='Expandir elementos seleccionados'
                        inverted
                     />
                  )
               }
            }
         }
      }

      const renderCollapseRowsButton = () => {
         if (props.collapseElements && props.collapseElements.displayButton) { // Check if the button needs to be displayed
            if (!props.collapseElements.isRowSelected) { // Display the button to collapse all the header rows.
               return (
                  <Popup
                     trigger={
                        <Button style={button_style} size={icon_size} icon='angle double up' basic
                           onClick={props.collapseElements.action} type="button" />
                     }
                     content='Contraer todos los elementos'
                     inverted
                  />
               )
            } else {
               if (props.collapseElements.isRowHeaderSelected) { // Display the button to collapse only the header rows selected.
                  return (
                     <Popup
                        trigger={
                           <Button style={button_style} size={icon_size} icon='angle up' basic
                              onClick={props.collapseElements.action} type="button" />
                        }
                        content='Contraer elementos seleccionados'
                        inverted
                     />
                  )
               }
            }
         }
      }
      const renderPasteModalButton = () => {
         if (!props.collapseElements.isRowSelected){
            return (
               <Popup
                  trigger={
                     <Button style={button_style} size={icon_size} icon='table' basic
                        onClick={props.pasteModalAction} type="button" />
                  }
                  content='Pegar elementos desde excel'
                  inverted
               />
            )
         }
      }

      const excelHeaders = this.props.columns?.reduce((acum, col) => {
         if (col.columns) {
            return [...acum,
            ...col.columns.map(c => ({
               label: `${getHeaderText(col)}-${getHeaderText(c)}`,
               key: c.assesor,
            }))
            ]
         } else {
            return [
               ...acum,
               {
                  label: getHeaderText(col),
                  key: col.assesor,
               }
            ]
         }
      }, []) ?? []

      const excelRows = this.getExcelRows();

      return (
         <div style={this.props.style}>

            {
               (left_actions.length > 0 || shouldRenderDefaultActions) &&

               <div style={left_actions_style} className="left-actions">

                  <Button.Group style={{ height: '100%' }}>
                     {left_actions.map((item, index) => renderButton(item, index))}
                     {pasteModalActive && renderPasteModalButton()}
                     {shouldRenderDefaultActions && renderExpandRowsButton()}
                     {shouldRenderDefaultActions && renderCollapseRowsButton()}
                  </Button.Group>

               </div>

            }

            <div style={right_actions_style} className="right-actions">

               <Button.Group>
                  {right_actions.map((item, index) => renderButton(item, index))}

                  {enableProfileConfiguration && <div className='react-select' style={{ width: '200px', height: '100%' }}>
                     <Select
                        value={profileSelectedOption}
                        options={optionsProfiles}
                        placeholder='Seleccione un perfil'
                        styles={userConfigurationSelectStyles}
                        onChange={this.handleChangeProfile}
                     />
                  </div>}
                  {allowToDownloadCVS &&
                     <CSVLink
                        filename='data.csv'
                        data={excelRows}
                        headers={excelHeaders}
                     >
                        <Popup
                           trigger={
                              <Button
                                 style={button_style}
                                 size={icon_size}
                                 icon='download'
                                 basic
                                 type="button"
                              />
                           }
                           content='Exportar a Excel'
                           inverted
                        />
                     </CSVLink>
                  }
                  {allowToOpenSettings && <Popup
                     trigger={
                        <Button
                           style={button_style}
                           size={icon_size}
                           icon='setting'
                           basic
                           onClick={props.openSettings}
                           type="button"
                        />
                     }
                     content='Configuración'
                     inverted
                  />}

               </Button.Group>

            </div>
            <Modal className=''
               open={is_create_profile_modal_open}
               onClose={() => this.setState({ is_create_profile_modal_open: false })}>
               <Modal.Header>Crear nuevo perfil</Modal.Header>
               <Modal.Content>
                  <ModalForm initialValues={{}} fields={[{
                     label: 'Nombre',
                     name: 'name',
                  },]} onSubmit={this.handleCreateProfile} />
               </Modal.Content>
            </Modal>
         </div>
      )
   }
}
