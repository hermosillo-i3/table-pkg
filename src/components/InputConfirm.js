import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Input } from "semantic-ui-react";
import pick from "lodash/pick";

const InputConfirm = (props) => {
   const [initialValue] = useState(props.value);
   const [hide, setHide] = useState(props.hide !== undefined ? props.hide : true);
   const [value, setValue] = useState(props.value);
   const [editMode, setEditMode] = useState(false);

   const inputRef = useRef(null);


   useEffect(() => {
      setHide(props.hide);
   }, [props.hide]);

   useEffect(() => {
      if (editMode) {
         setFocusInput();
      }
   }, [editMode]);

   useEffect(() => {
      if (props.appearOnClick)
         setEditMode(true);
   }, [props.appearOnClick]);

   useEffect(() => {
      if (!hide)
         setFocusInput();
   }, [hide]);

   const onAccept = () => {
      if (!appearOnClick)
         setEditMode(false);
      setHide(true);
      if (props.onAccept)
         props.onAccept(value);
   };

   const onCancel = () => {
      setValue(initialValue);
      if (!appearOnClick)
         setEditMode(false);
      setHide(true);
      if (props.onCancel)
         props.onCancel(initialValue);
   };
   const onKeyDown = (e) => {
      if (e.keyCode === 13) onAccept();
      if (e.keyCode === 2) onCancel();
      if (props.onKeyDown) props.onKeyDown(e);
   };

   const setFocusInput = () => {
      if (inputRef && inputRef.current)
         inputRef.current.focus();
   };


   const propsFilteredForInput = pick(props, ['placeholder', 'type', 'maxLength']);
   const { trigger: ComponentTrigger, appearOnClick } = props;

   return (
      <React.Fragment>
         {(hide && appearOnClick) && (
            React.cloneElement(ComponentTrigger, {
               onClick: () => {
                  setHide(false);
               }
            })
         )}
         {(!appearOnClick || !hide) && (
            <div className='input-confirm'>
               <Input 
                  className='full-size h4' 
                  value={value}
                  onKeyDown={onKeyDown}
                  onKeyUp={props.onKeyUp}
                  ref={inputRef}
                  onBlur={onAccept}
                  onChange={(e, data) => {
                     setValue(e.target.value);
                     setEditMode(true);
                     if (props.onChange)
                        props.onChange(e.target.value);
                  }}
                  {...propsFilteredForInput}
               />
               <div className={'clickable actions ' + (editMode ? '' : 'hide')}>
                  <Button basic icon='check' className='on-hover-green' onClick={onAccept} />
                  <Button basic icon={'cancel'} className='on-hover-red' onClick={onCancel}
                  />
               </div>
            </div>
         )}
      </React.Fragment>
   )
};

InputConfirm.propTypes = {
   trigger: PropTypes.node,
   appearOnClick: PropTypes.bool,
   onAccept: PropTypes.func,
   onKeyUp: PropTypes.func,
   onKeyDown: PropTypes.func,
   onCancel: PropTypes.func,
   onChange: PropTypes.func,
   value: PropTypes.any,
   editMode: PropTypes.bool,
};

export default InputConfirm;
