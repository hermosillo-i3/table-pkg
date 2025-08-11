import React from 'react'
import capitalize from "lodash/capitalize";
import { replaceAll } from '../utils/index'
import dateFormatter from "@hermosillo-i3/utils-pkg/src/dateFormatter";
import { Checkbox, Dropdown, Form } from "semantic-ui-react";
import Select from "react-select";
import Cleave from 'cleave.js/react';

//Components
import CheckboxList from "./CheckboxList";
import ColorList from "./ColorList";
import TableDatePicker from "./TableDatePicker";

export default ({
   field, // { name, value, onChange, onBlur }
   type = 'text',
   withLabel = true,
   options,
   label,
   fileExtensions,
   includeEmptyOption = false,
   readOnly = false,
   checkLabel,
   fileStyle,
   isIgnoringTouched,
   decimals,
   form: { touched, errors, setFieldValue, setFieldError, setFieldTouched },
   ...props
}) => (
   <div style={props.style}>
      {
         withLabel ? (
            <div className="Modal_form_field_label"
               htmlFor={field.name}>{label ? label : replaceAll(capitalize(field.name), '_', ' ')}
            </div>
         ) :
            <div className="Modal_form_field_label"></div>
      }


      {(() => {
         let style;
         if (isIgnoringTouched) {
            style = (errors[field.name]) ? { ...props.inputStyle, border: 'solid 1px red' } : { ...props.inputStyle }
         } else {
            style = (touched[field.name] && errors[field.name]) ? { ...props.inputStyle, border: 'solid 1px red' } : { ...props.inputStyle }
         }
         if (readOnly) {
            style = {
               background: '#eeeeee',
               ...style
            }
         }
         switch (type) {

            case 'date':
               const filterDate = typeof format === 'object' ? format.filterDate : null;
               const filterHermosilloNonWorkingDays = typeof format === 'object' ? format.filter_hermosillo_non_working_days : false;

               const isWorkingday = (date) => {
                  return dateFormatter(date).isHermosilloWorkingDay();
               };
               
               return (
                  <TableDatePicker
                     selected={field.value}
                     onChange={(date) => {
                        const {onChange} = props;
                        if (onChange)
                           onChange(date);
                        setFieldTouched(field.name, true);
                        setFieldValue(field.name, date);
                     }}
                     filterDate={filterHermosilloNonWorkingDays ? filterDate : isWorkingday}
                     disabled={readOnly}
                     {...props}
                  />
               );
            case 'select':
               return (
                  <select
                     className="Modal_form_field_input"
                     {...field}
                     {...props}
                     onChange={(e) => {
                        const value = e.target.value;
                        if (props.onChange)
                           props.onChange(value);

                        setFieldValue(field.name, value);
                        setFieldTouched(field.name, true);
                     }}
                     disabled={readOnly}
                     style={{
                        ...style,
                     }}
                  >
                     {includeEmptyOption && <option key={undefined} value={undefined} />}
                     {options &&
                        options.map(opt => <option key={opt.value} value={opt.value} disabled={opt.disabled ? opt.disabled : false}>{opt.label}</option>)
                     }
                  </select>
               );
            case 'select-multiple':
               return (
                  <Dropdown
                     {...field}
                     {...props}
                     validate={(value) => {
                        const { validate } = props;
                        if (validate)
                           validate(value);
                     }}
                     fluid multiple selection options={options}
                     onChange={(_, data) => {
                        const { onChange } = props;
                        if (onChange)
                           onChange(data.value);
                        setFieldValue(field.name, data.value);
                     }}
                     onBlur={(_, data) => {
                        const { onBlur } = props;
                        if (onBlur)
                           onBlur(data.value);
                        setFieldValue(field.name, data.value);
                     }} />
               );
            case 'react-select':
               return (
                  <Select
                     {...field}
                     {...props}
                     onChange={(data) => {
                        const { onChange } = props;
                        if (onChange)
                           onChange(data.value);
                        setFieldValue(field.name, data);
                     }}
                     options={options}
                  />
               );
            case 'textarea':
               return (
                  <div>
                     <textarea
                        className="Modal_form_field_input"
                        style={(touched[field.name] && errors[field.name]) ? { border: 'solid 1px red' } : null}
                        {...field}
                        value={field.value || undefined}
                        {...props} />
                  </div>
               );
            case 'check':
               return (
                  <div>
                     <Checkbox
                        {...field}
                        {...props}
                        label={checkLabel ? checkLabel : label}
                        defaultChecked={field.value}
                        onChange={(_, data) => {
                           const { onChange } = props;
                           if (onChange)
                              onChange(data.checked);
                           setFieldValue(field.name, data.checked);
                        }}
                     />
                  </div>
               );
            case 'check-list':
               return (
                  <div>
                     <CheckboxList
                        {...field}
                        {...props}
                        value={field.value}
                        onChange={(value) => {
                           const { onChange } = props;
                           if (onChange)
                              onChange(value);
                           setFieldValue(field.name, value);
                        }}
                     />
                  </div>
               );
            case 'check-radio-group':
               return (
                  <div>
                     <Form.Group grouped>
                        {label && <div className="Modal_form_field_label">{label}</div>}
                        {options &&
                           options.map(opt => {
                              return (
                                 <Form.Radio
                                    label={opt.label}
                                    value={opt.value}
                                    checked={opt.checked ?? false}
                                    onChange={(_, data) => {
                                       const { onChange } = props;
                                       if (onChange)
                                          onChange(data.value);
                                    }}
                                 />
                              )
                           })
                        }
                     </Form.Group>
                  </div>
               );
            case 'color-list':
               return (
                  <div>
                     <ColorList
                        {...field}
                        {...props}
                        onChange={color => {
                           const { onChange } = props;
                           if (onChange)
                              onChange(color);
                           setFieldValue(field.name, color);
                        }}
                     />
                  </div>
               );
            case 'file':
               return (
                  <div style={{ display: 'flex', ...fileStyle }}>
                     <input
                        {...field}
                        {...props}
                        className="Modal_form_field_input"
                        style={(touched[field.name] && errors[field.name]) ? { border: 'solid 1px red' } : null}
                        value={field.value ? field.value.filename : ''}
                        readOnly

                     />

                     <input
                        type="file"
                        style={{ display: 'none' }}
                        className="inputfile"
                        id={`embedpollfileinput${field.name}`}
                        accept={fileExtensions ? fileExtensions.join(',') : undefined}
                        onChange={event => {
                           if (event.target.files.length > 0) {
                              const filename = event.target.files[0].name;
                              const content = event.target.files[0];
                              setFieldValue(field.name, {
                                 filename,
                                 content
                              });
                           }
                        }} />
                     <label htmlFor={`embedpollfileinput${field.name}`} className="Form_field_label ui icon button">
                        <i className="ui search icon"></i>

                     </label>
                  </div>
               );
            case "currency": {
               return (
                  <Cleave
                     style={{
                        textAlign: 'left',
                        ...style,
                     }}
                     className="Modal_form_field_input"
                     value={field.value}
                     // htmlRef={(input) => {
                     //    this.input = input
                     // }}
                     onChange={e => {
                        const value = e.target.rawValue ? e.target.rawValue.length > 0 ? e.target.rawValue : 0 : 0
                        let isValid = true;
                        if (props.maxValue != null) {
                           const floatValue = parseFloat(value);
                           isValid = floatValue <= props.maxValue
                        }

                        let newValue;
                        if (isValid) {
                           newValue = value
                        } else {
                           newValue = props.maxValue
                        }

                        if (props.onChange)
                           props.onChange(newValue)
                        setFieldValue(field.name, newValue);
                        setFieldTouched(field.name, true);

                     }}
                     readOnly={readOnly}
                     options={{
                        numeral: true,
                        rawValueTrimPrefix: true,
                        numeralDecimalScale: decimals ?? 2,
                        prefix: '$'
                     }
                     }
                  />
               )
            }
            case "numerical": {
               return (
                  <div>
                     <input
                        className="Modal_form_field_input"
                        type={type}
                        style={style}
                        {...field}

                        value={field.value || ''}
                        readOnly={readOnly}
                        {...props}
                        onChange={(e) => {
                           let value = e.target.value;

                           const limitLength = props.limitLength ?? 2;
                           const regex = new RegExp(`^[0-9]{0,${limitLength}}$`);


                           if (regex.test(value)) {
                              setFieldValue(field.name, value);
                              if (props.onChange)
                                 props.onChange(value)
                              setFieldTouched(field.name, true);
                           }


                        }}
                     />
                  </div>
               )
            }
            case "float": {
               return (
                  <Cleave
                     style={{
                        textAlign: 'left',
                        ...style,
                     }}
                     className="Modal_form_field_input"
                     value={field.value}
                     onChange={e => {
                        const value = e.target.rawValue ? e.target.rawValue.length > 0 ? e.target.rawValue : 0 : 0
                        let isValid = true;
                        if (props.maxValue != null) {
                           const floatValue = parseFloat(value);
                           isValid = floatValue <= props.maxValue
                        }

                        let newValue;
                        if (isValid) {
                           newValue = value
                        } else {
                           newValue = props.maxValue
                        }

                        if (props.onChange)
                           props.onChange(newValue)
                        setFieldValue(field.name, newValue);
                        setFieldTouched(field.name, true);

                     }}
                     readOnly={readOnly}
                     options={{
                        numeral: true,
                        rawValueTrimPrefix: true,
                        numeralDecimalScale: 2,
                     }
                     }
                  />
               )
            }
            case "percentage":
               return (
                  <Cleave
                     style={{
                        textAlign: 'left',
                        ...style,
                     }}
                     className="Modal_form_field_input"
                     value={field.value}
                     onChange={e => {
                        const MAX_VALUE=100;
                        const value = e.target.rawValue ? e.target.rawValue.length > 0 ? e.target.rawValue : undefined : undefined
                        let isValid = true;
                        if (MAX_VALUE != null && value) {
                           const floatValue = parseFloat(value);
                           isValid = floatValue <= MAX_VALUE
                        }

                        let newValue;
                        if (isValid) {
                           newValue = value
                        } else {
                           newValue = MAX_VALUE
                        }

                        if (props.onChange)
                           props.onChange(newValue)
                        setFieldValue(field.name, newValue);
                        setFieldTouched(field.name, true);
                      
                     }}
                     onKeyDown={e => {
                        let value = e.target.rawValue ? e.target.rawValue.length > 0 ? e.target.rawValue : undefined : undefined
                        if(e.key==='Backspace' && value){
                           e.currentTarget.setSelectionRange(value?.length-1,value?.length)
                        }
                     }}
                     readOnly={readOnly}
                     options={{
                        numeral: true,
                        numeralPositiveOnly: true,
                        numeralIntegerScale: 3,
                        numeralDecimalScale: decimals || 2,
                        numeralDecimalMark: '.',
                        prefix: '%',
                        tailPrefix:true,
                        rawValueTrimPrefix: true,
                     }
                     }
                  />
               );
            default:

               return (
                  <div>
                     <input
                        className="Modal_form_field_input"
                        type={type}
                        style={style}
                        {...field}

                        value={field.value || ''}
                        readOnly={readOnly}
                        {...props}
                        onChange={(e) => {
                           let value = e.target.value;

                           if (type === "number") {
                              value = parseInt(value)
                           }
                           if (props.onChange)
                              props.onChange(value)
                           setFieldTouched(field.name, true);
                           setFieldValue(field.name, value);
                        }}
                     />
                  </div>
               );
         }
      })()}
      {
         isIgnoringTouched ?
            (errors[field.name] && <div style={{ color: 'red' }}>{errors[field.name]}</div>) :
            (touched[field.name] && errors[field.name] && <div style={{ color: 'red' }}>{errors[field.name]}</div>)
      }
   </div>
);
