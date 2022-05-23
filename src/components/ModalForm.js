import React from 'react'
import PropTypes from 'prop-types'
import {Field, Form, Formik} from "formik";
import Input from "./InputForm";
import {Button, Dimmer, Loader, Popup} from "semantic-ui-react";

const ModalForm = (props) => {
   const {onSubmitButtonText = 'Guardar'} = props
   return (
      <Formik className='modal-form'
              initialValues={props.initialValues ?
                 {
                    ...props.initialValues
                 } : {}}
              onSubmit={(values, {setSubmitting}) => {
                 if (props.onSubmit) {
                    props.onSubmit(values, setSubmitting);
                 } else {
                    setSubmitting(false);
                 }
              }}
      >
         {({isSubmitting}) => (
            <Form className="ui form modal-form">
               <Dimmer active={isSubmitting} inverted>
                  <Loader inverted>Cargando</Loader>
               </Dimmer>
               {props.fields.map(e => {
                  if (e.pop_up) {
                     return <div>
                        <Popup
                           key={e.name}
                           trigger={<Field key={e.name} component={Input} {...e} />}
                           content={e.pop_up.content}
                           on={e.pop_up.on}
                           position={e.pop_up.position}
                           size={e.pop_up.size}
                           wide={e.pop_up.wide}
                        />
                     </div>;
                  }
                  return <Field key={e.name} component={Input} {...e} />;
               })}
               {props.children}
               <div className='text-right bottom-action-form'>
                  <Button color="green" type="submit">{onSubmitButtonText}</Button>
               </div>
            </Form>
         )}
      </Formik>
   )
};


ModalForm.propTypes = {
   initialValues: PropTypes.object,
   fields: PropTypes.array,
   onSubmit: PropTypes.func,
};

export default ModalForm;
