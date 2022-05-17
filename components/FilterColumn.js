import React, { useState, useEffect, useMemo } from 'react'
import { Input, Popup, Icon, Button, Label } from "semantic-ui-react";
import Cleave from 'cleave.js/react';
import PropTypes from 'prop-types'

const FilterColumn = (props) => {
   const { onSubmit, column, column_extended } = props;


   const { format = 'text' } = column;
   const [text, setText] = useState('')
   const [range, setRange] = useState({
      max: null,
      min: null,
      equal: null,
   })

   let colFormat = typeof format === 'object' ? format.type : format;
   const column_extended_value = column_extended?.filter_value

   const hasCurrencyValue = useMemo(() => {
      return (range.max != null || range.min != null || range.equal != null)
   }, [range])

   // useEffect(() => {
   //    if (
   //       colFormat === 'currency' &&
   //       (range.max == null && range.min == null && range.equal == null)
   //    ){

   //       onSubmit(range)
   //    }
   //    // eslint-disable-next-line react-hooks/exhaustive-deps
   // }, [range])

   useEffect(() => {
      if (column_extended_value != null) {
         if (colFormat === 'text' || colFormat === 'textarea') {
         setText(column_extended_value)
         } else if (colFormat === 'currency') {
            setRange(column_extended_value)
         }
      }

   }, [column_extended_value, colFormat])

   if (colFormat === 'text' || colFormat === 'textarea' || colFormat === 'list') {
      return (
         <Popup
            on='click'
            pinned
            content={
               <Input
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
                  }} />
            }
            trigger={
               <Button
                  size='mini'
                  icon='filter'
                  style={{
                     padding: '0.4rem'
                  }}
                  type={'button'}
                  {...(text.length > 0 ? { color: 'orange' } : {})}
               />
            }
         />

      )
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
                     <Icon name='search' size='tiny' />
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

}

FilterColumn.propTypes = {
   onSubmit: PropTypes.func.isRequired,
   format: PropTypes.string,
}


const FieldCurrency = ({ label, value, onChange, disabled }) => {

   return <div className="FilterColumnField">
      <Label size="small">
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

export default FilterColumn
