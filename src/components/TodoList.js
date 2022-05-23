import React, {useState} from 'react'
import {Button, Header, Icon, Input, List} from "semantic-ui-react";

const uuidv1 = require('uuid/v1');

const TodoList = (props) => {
   //Define states for the hoc component
   const [value, setValue] = useState('');


   const {list} = props;
   return (
      <div className='todo-list-input fluid'>
         <Input fluid
                value={value}
                onChange={(_, data) => setValue(data.value)}
                label={
                   <Button
                      icon
                      type="button"
                      onClick={() => {
                         if (value != null && value !== '') {
                            const newList = list ? list : [];
                            if (props.onChange)
                               props.onChange([
                                  ...newList,
                                  {
                                     label: value,
                                     value,
                                     id: `${uuidv1()}`
                                  }
                               ]);
                            setValue('');
                         }
                      }}>
                      <Icon name='plus'/>
                   </Button>
                }
                labelPosition='right'
                placeholder={props.placeholder ? props.placeholder : 'Agregar concepto'}
         />
         {list && list.length > 0 && (
            <List verticalAlign='middle'>
               {list.map(e => {
                  return (
                     <List.Item key={e.id}>
                        <List.Content floated='right'>
                           <Icon onClick={() => {
                              let newList = list ? list : [];
                              newList = newList.filter(item => item.id !== e.id);
                              if (props.onChange)
                                 props.onChange(newList);
                           }} name='delete' className='clickable'/>
                        </List.Content>
                        <List.Content>{e.label}</List.Content>
                     </List.Item>
                  )
               })}
            </List>
         )}
         {!(list && list.length > 0) && (
            <div className='empty-state'>
               <div className='content'>
                  <Icon name='clipboard list'/>
                  <Header as='h4'>
                     <Header.Content>
                        List vacia
                        <Header.Subheader>Agrega elementos en el cuadro de texto de arriba</Header.Subheader>
                     </Header.Content>
                  </Header>
               </div>
            </div>
         )}
      </div>
   )
};

TodoList.propTypes = {};

export default TodoList;
