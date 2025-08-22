import React, { useState, useEffect, useMemo } from 'react'
import { Input, Popup, Icon, Button, Label, Checkbox, Radio } from "semantic-ui-react";
import PropTypes from 'prop-types'
import { convertObjectToArray } from "@hermosillo-i3/utils-pkg/src/object";
import Cleave from 'cleave.js/react';
import uniq from 'lodash/uniq';
import { InputField } from '..';

const FilterColumn = (props) => {
   const {
      onSubmit,
      column,
      column_extended,
      rows,
   } = props;
   let filter_options;
   if (column.format?.options != null) {
      filter_options = Object.keys(column.format.options).reduce((acc, item) => {
         return {
            ...acc,
            [column.format.options[item].id ?? column.format.options[item].key]: {
               id: column.format.options[item].id ?? column.format.options[item].key,
               text: column.format.options[item].text ?? column.format.options[item].name,
            }
         }
      }, {})
   }
   const { format = "text", assesor } = column;
   const [text, setText] = useState('')
   const [range, setRange] = useState({
      max: null,
      min: null,
      equal: null,
   })
   const [filterStatus, setFilterStatus] = useState({})
   const [filteredOptions, setFilteredOptions] = useState(filter_options || {})
   const [selectedNumberRange, setSelectedNumberRange] = useState(null)

   const toggleFilter = (filter) => {
      const newFilterOptions = { ...filterStatus }
      if (newFilterOptions[filter]) {
         delete newFilterOptions[filter]
      } else {
         newFilterOptions[filter] = true
      }
      
      setFilterStatus(newFilterOptions)
      
      if (JSON.stringify(newFilterOptions) === '{}') {
         onSubmit('')
      }
   }
   const submitFilterForSelect = () => {
      const objectOptions = column.format.options.reduce((acc, item) => {
         return {
            ...acc,
            [item.id ?? item.key]: {...item}
         }
      }, {})
      const arrayOfOptions = Object.keys(filter_options).reduce((acc, item) => {
         const key = filter_options[item].id ?? filter_options[item].key
         if (filterStatus[item]) {
            acc.push(objectOptions[key])
         }
         return acc
      }, [])
      onSubmit(arrayOfOptions.length > 0 ? arrayOfOptions : '')
   }

   const submitFilterForSearch = () => {
     onSubmit(Object.keys(filterStatus));
   };

   let colFormat = typeof format === 'object' ? format.type : format;
   
   const hasCurrencyValue = useMemo(() => {
      return (range.max != null || range.min != null || range.equal != null)
   }, [range])

   const hasDateValue = useMemo(() => {
      return ((range.max !== null && range.max !== "") || (range.min !== null && range.min !== "")) 
   }, [range])

   const hasNumberValue = useMemo(() => {
      return selectedNumberRange !== null
   }, [selectedNumberRange])

   // it will only contain the values that exists in the rows not all options available to select.
   const filterOptionsInRows = useMemo(() => {
      if(colFormat === 'search'){
          const _rows = convertObjectToArray(rows);
          const filter_options_in_rows = _rows
            ?.map((row) => row[assesor])
            .filter((value) => value != null);
         return uniq(filter_options_in_rows);
      
      }else{
         return [];
      }
   }, [rows])

   const column_extended_value = column_extended?.filter_value;
   useEffect(() => {
      if (column_extended_value != null) {
         if (colFormat === 'text' || colFormat === 'textarea') {
            setText(column_extended_value)
         } else if (colFormat === 'currency') {
            setRange(column_extended_value)
         } else if (colFormat === 'number') {
            setSelectedNumberRange(column_extended_value)
         } else if(colFormat === 'search' && Array.isArray(column_extended_value) && column_extended_value.length > 0){
            setFilterStatus({
              [column_extended_value[0]]: true,
            });
         }
      }

   }, [column_extended_value, colFormat])

   if (colFormat === 'text' || colFormat === 'textarea' || colFormat === 'list' || colFormat === 'select') {
      return (
         <Popup
            on='click'
            pinned
            position='bottom left'
            wide='very'
            content={
               filter_options == null ?
                  (<Input
                     value={text}
                     onChange={(e) => {
                        let value = e?.target?.value;
                        setText(value);
                        if (value?.length === 0) {
                           onSubmit('')
                        }
                     }}
                     onKeyDown={(e) => {
                        if (e.keyCode === 13) {
                           onSubmit(text)
                        }
                     }}
                     size='mini'
                     action={{
                        icon: 'search',
                        size: 'mini',
                        onClick: () => {
                           onSubmit(text)
                        }
                     }} />)
                  :
                  (
                     <div style>
                        <div class='wrapper'>
                           {

                              Object.keys(filter_options).map((item, index) => {
                                 return (
                                    <Checkbox checked={filterStatus[item]} onClick={() => { toggleFilter(item); }} label={filter_options[item].text} />
                                 )
                              })
                           }
                        </div>
                        <Button
                           // disabled={range.max == null && range.min == null && range.equal == null}
                           size="tiny"
                           icon
                           labelPosition='left'
                           fluid
                           onClick={() => {
                              submitFilterForSelect();
                           }}
                        >
                           <Icon name='search' size='small' />
                           Buscar
                        </Button>
                     </div>
                  )

            }
            trigger={
               < Button
                  size='mini'
                  icon='filter'
                  style={{
                     padding: '0.4rem'
                  }}
                  type={'button'}
                  {...(text.length > 0 || JSON.stringify(filterStatus) != '{}' ? { color: 'orange' } : {})}
               />
            }
         />

      )
   }

   if(colFormat === 'search'){

      if (filterOptionsInRows.length === 0) { 
            return null;
      }
        return (
          <Popup
            on="click"
            pinned
            position="bottom left"
            wide="very"
            content={
              <div style>
                <div class="wrapper">
                  {filterOptionsInRows.map((item, index) => {
                    return (
                      <Checkbox
                        checked={filterStatus[item]}
                        onClick={() => {
                          toggleFilter(item);
                        }}
                        label={item}
                      />
                    );
                  })}
                </div>
                <Button
                  size="tiny"
                  icon
                  labelPosition="left"
                  fluid
                  onClick={() => {
                    submitFilterForSearch();
                  }}
                >
                  <Icon name="search" size="small" />
                  Buscar
                </Button>
              </div>
            }
            trigger={
              <Button
                size="mini"
                icon="filter"
                style={{
                  padding: "0.4rem",
                }}
                type={"button"}
                {...(JSON.stringify(filterStatus) != "{}"
                  ? { color: "orange" }
                  : {})}
              />
            }
          />
        );
   }

   if (colFormat === 'currency') {
      return (
         <Popup
            on='click'
            pinned
            content={
               <div className="FilterColumnCurrency">
                  <div className="FilterColumnCurrencyGroup">
                     <FieldCurrency
                        label='Mayor a'
                        value={range.max}
                        disabled={range.equal}
                        onChange={(value) => {
                           const newRange = { ...range, max: value }
                           setRange(newRange)
                           if (value == null) {
                              onSubmit(newRange)
                           }
                        }}
                     />
                     <FieldCurrency
                        label='Menor a'
                        value={range.min}
                        disabled={range.equal}
                        onChange={(value) => {
                           const newRange = { ...range, min: value }
                           setRange(newRange)
                           if (value == null) {
                              onSubmit(newRange)
                           }
                        }}
                     />

                  </div>
                  <div className="FilterColumnCurrencyGroup">
                     <FieldCurrency
                        label='Igual a'
                        value={range.equal}
                        disabled={range.max || range.min}
                        onChange={(value) => {
                           const newRange = { ...range, equal: value }
                           setRange(newRange)
                           if (value == null) {
                              onSubmit(newRange)
                           }
                        }}
                     />
                  </div>


                  <Button
                     // disabled={range.max == null && range.min == null && range.equal == null}
                     size="tiny"
                     icon
                     labelPosition='left'
                     fluid
                     onClick={() => {
                        onSubmit(range)
                     }}
                  >
                     <Icon name='search' style={{"width": '5.38em'}} />
                     Buscar
                  </Button>
               </div>

            }
            trigger={
               <Button
                  size='mini'
                  icon='filter'
                  style={{
                     padding: '0.4rem'
                  }}
                  {...(hasCurrencyValue ? { color: 'orange' } : {})}
               />}
         />

      )
   }
   if (colFormat === 'date') {
      return (
         <Popup
            on="click"
            pinned
            content={
               <div className="FilterColumnCurrency">
                  <div className="FilterColumnCurrencyGroup">
                     <FieldDate
                        label="De"
                        value={range.min}
                        disabled={range.equal}
                        onChange={(value) => {
                           const newRange = { ...range, min: value };
                           setRange(newRange);
                           if (value == null) {
                              onSubmit(newRange);
                           } else if (
                              (newRange.max === null || newRange.max === "") &&
                              (newRange.min === null || newRange.min === "")
                           ) {
                              onSubmit("");
                           }
                        }}
                     />
                     <FieldDate
                        label="A"
                        value={range.max}
                        disabled={range.equal}
                        onChange={(value) => {
                           const newRange = { ...range, max: value };
                           setRange(newRange);
                           if (value == null) {
                              onSubmit(newRange);
                           } else if (
                              (newRange.max === null || newRange.max === "") &&
                              (newRange.min === null || newRange.min === "")
                           ) {
                              onSubmit("");
                           }
                        }}
                     />
                  </div>

                  <Button
                     // disabled={range.max == null && range.min == null && range.equal == null}
                     size="tiny"
                     icon
                     labelPosition="left"
                     fluid
                     onClick={() => {
                        onSubmit(range);
                     }}
                  >
                     <Icon name="search" style={{ width: "2.9em" }} />
                     Buscar
                  </Button>
               </div>
            }
            trigger={
               <Button
                  size="mini"
                  icon="filter"
                  style={{
                     padding: "0.4rem",
                  }}
                  {...(hasDateValue ? { color: "orange" } : { color: "grey" })}
               />
            }
         />
      );
   }

   if (colFormat === 'number') {
      // Get ranges from column format or use default ranges
      const numberRanges = format?.ranges || [
         { start: 0, end: 7, label: '0-7' },
         { start: 8, end: 15, label: '8-15' },
         { start: 16, label: '16+' }
      ];

      return (
         <Popup
            on="click"
            pinned
            position="bottom left"
            wide="very"
            content={
               <div style={{ padding: "12px" }}>
                  <div style={{ marginBottom: "12px", fontWeight: "bold" }}>Seleccionar rango</div>

                  <div style={{ marginBottom: "12px" }}>
                     {numberRanges.map((rangeOption, index) => (
                        <div key={index} style={{ marginBottom: "8px" }}>
                           <Radio
                              label={rangeOption.label || (rangeOption.end !== undefined ? `${rangeOption.start} - ${rangeOption.end}` : `≥ ${rangeOption.start}`)}
                              name="numberRange"
                              value={JSON.stringify(rangeOption)}
                              checked={
                                 selectedNumberRange &&
                                 selectedNumberRange.start === rangeOption.start &&
                                 selectedNumberRange.end === rangeOption.end
                              }
                              onChange={(e, { value }) => {
                                 const parsedRange = JSON.parse(value);
                                 setSelectedNumberRange(parsedRange);
                              }}
                           />
                        </div>
                     ))}

                     <div style={{ marginTop: "12px" }}>
                        <Radio
                           label="Limpiar filtro"
                           name="numberRange"
                           value="clear"
                           checked={selectedNumberRange === null}
                           onChange={() => {
                              setSelectedNumberRange(null);
                              onSubmit("");
                           }}
                        />
                     </div>
                  </div>

                  <Button
                     size="tiny"
                     icon
                     labelPosition="left"
                     fluid
                     disabled={selectedNumberRange === null}
                     onClick={() => {
                        onSubmit(selectedNumberRange);
                     }}
                  >
                     <Icon name="search" size="small" />
                     Buscar
                  </Button>
               </div>
            }
            trigger={
               <Button
                  size="mini"
                  icon="filter"
                  style={{
                     padding: "0.4rem",
                  }}
                  type={"button"}
                  {...(hasNumberValue ? { color: "orange" } : {})}
               />
            }
         />
      );
   }

   if (colFormat === 'searchSelect') {
      return (
         <Popup
            on='click'
            pinned
            position='bottom left'
            wide='very'
            content={
               <div style={{ padding: '12px',}}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '12px'}}>
                     <div>
                        <a 
                           href="#" 
                           style={{ color: '#4285f4', textDecoration: 'underline', marginRight: '4px' }}
                           onClick={(e) => {
                              e.preventDefault();
                              const allSelected = Object.keys(filteredOptions).every(key => filterStatus[key] === true);
                              const newFilterStatus = { ...filterStatus };
                              Object.keys(filteredOptions).forEach(key => {
                                 newFilterStatus[key] = !allSelected;
                              });
                              setFilterStatus(newFilterStatus);
                           }}
                        >
                           Seleccionar todos
                        </a>
                        -
                        <a 
                           href="#" 
                           style={{ color: '#4285f4', textDecoration: 'underline', marginLeft: '4px' }}
                           onClick={(e) => {
                              e.preventDefault();
                              const newFilterStatus = { ...filterStatus };
                              Object.keys(filteredOptions).forEach(key => {
                                 delete newFilterStatus[key];
                              });
                              setFilterStatus(newFilterStatus);
                           }}
                        >
                           Limpiar
                        </a>
                     </div>
                     <span style={{ color: '#666', fontSize: '12px', paddingLeft: '1em' }}>
                        Mostrando {Object.keys(filteredOptions).length}
                     </span>
                  </div>

                  <div>
                     <Input
                     style={{'paddingBottom': '.2em'}}
                     value={text}
                     onChange={(e) => {
                        let value = e?.target?.value;
                        setText(value);
                        
                        if (filter_options) {
                           const filtered = Object.keys(filter_options).reduce((acc, key) => {
                              if (filter_options[key].text.toLowerCase().startsWith(value.toLowerCase())) {
                                 acc[key] = filter_options[key];
                              }
                              return acc;
                           }, {});
                           
                           setFilteredOptions(filtered);
                        }
                        
                        if (value?.length === 0) {
                           setFilteredOptions(filter_options || {});
                        }
                     }}
                     onKeyDown={(e) => {
                        if (e.keyCode === 13) {
                           onSubmit(text)
                        }
                     }}
                     size='small'
                     placeholder="Buscar"
                  />
                  </div>

                  <div className='wrapper' style={{ marginTop: '8px' }}>
                     {
                        Object.keys(filteredOptions).map((item, index) => {
                           return (
                              <div key={index} style={{ display: 'fixed', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                                 <Checkbox 
                                    checked={filterStatus[item] === true}
                                    onClick={() => { toggleFilter(item); }} 
                                    label={filteredOptions[item].text} 
                                 />                                 
                              </div>
                           )
                        })
                     }
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                     <Button
                     size="tiny"
                     icon
                     labelPosition='left'
                     fluid
                     style={{ marginTop: '8px' }}
                     onClick={() => {
                        onSubmit(Object.keys(filterStatus).filter(key => filterStatus[key] === true));
                     }}
                  >
                     <Icon name='search' size='small' />
                     Buscar
                  </Button>
                  </div>
               </div>
            }
            trigger={
               <Button
                  size='mini'
                  icon='filter'
                  style={{ padding: '0.4rem' }}
                  type={'button'}
                  {...(text.length > 0 || JSON.stringify(filterStatus) != '{}' ? { color: 'orange' } : {})}
               />
            }
         />
      )
   }
}

FilterColumn.propTypes = {
   onSubmit: PropTypes.func.isRequired,
   format: PropTypes.string,
}


const FieldCurrency = ({ label, value, onChange, disabled }) => {

   return <div className="FilterColumnField">
      <Label size="small" style={{"padding":'1em'}}>
         {label}
      </Label>
      <Cleave
         className={`InputField ${disabled && 'FilterColumnInputDisabled'}`}
         value={value}
         disabled={disabled}
         onChange={e => {
            const value = e.target.rawValue
            try {
               const floatValue = parseFloat(value);
               onChange(isNaN(floatValue) ? null : floatValue)
            } catch (error) {
               onChange(null)
            }


         }}
         onKeyDown={(e) => {

         }}
         // onBlur={this.onBlur}
         // onFocus={this.onFocus}
         options={{
            numeral: true,
            rawValueTrimPrefix: true,
            numeralDecimalScale: 2,
            prefix: '$'
         }
         }
      />
   </div>
}

const FieldDate = ({ label, value, onChange, disabled }) => {

   return <div className="FilterColumnField">
      <Label size="small" style={{"padding":'1em'}}>
         {label}
      </Label>
      <InputField
         format="date"
         value={value}
         disabled={disabled}
         onUpdate={e => {
            onChange(e)
            
         }}
      />
   </div>
}

export default FilterColumn
