import React from 'react'
import PropTypes from 'prop-types'
import Textarea from 'react-textarea-autosize';
import {Icon, Progress} from "semantic-ui-react";
import Cleave from 'cleave.js/react';
import {NumericFormat} from 'react-number-format';
import dateFormatter from "@hermosillo-i3/utils-pkg/src/dateFormatter";

import InputConfirm from "./InputConfirm";
import InputFieldSearch from "./InputFieldSearch";
import TableDatePicker from "./TableDatePicker";

import { KEY_CODES } from "../utils/index";
class InputField extends React.Component {

   constructor(props) {
      super(props);
      let currentValue = this.props.value;
      if (this.props.defaultValue != null) {
         currentValue = this.props.value != null ? this.props.value : this.props.defaultValue
      }
      this.state = {
         currentValue,
         previousValue: this.props.value,
         caretPos: 0,
         isTextAreaMultiLineActive: false,
         selectExpanded: false,
      };
      this.onChange = this.onChange.bind(this);
      this.onChangeDate = this.onChangeDate.bind(this);
      this.onBlur = this.onBlur.bind(this);
      this.onFocus = this.onFocus.bind(this);
   }

  calculateInputWidth = (text, maxWidth = null) => {
      const textLength = text?.toString().length || 0;
      
      // Empty InputFields should take up 50% of the cell width. No matter if the user is hovering or focusing the input
      if (textLength === 0) {
        return '50%';
      }

      const charWidth = 6;
      const padding = 40;
      // Reduce available width by 50px if expand icon is present
      const iconWidth = this.props.hasExpandIcon ? 50 : 0;
      const contentWidth = (textLength * charWidth) + padding;
      
      // Always respect the maximum width to prevent overflow
      if (maxWidth) {
        // If maxWidth is provided and the cell has an expand icon, reduce the available width
        if (this.props.hasExpandIcon) {
          if (contentWidth + iconWidth > (maxWidth - iconWidth)) {
            return `${maxWidth - iconWidth}px`;
          }
        }
        // If maxWidth is provided and content would exceed it, return maxWidth instead
        if (contentWidth > maxWidth) {
          return `${maxWidth}px`;
        }
      } else {
        // If no maxWidth is provided, default to 100% to respect cell boundaries
        return '100%';
      }
      
      return `${contentWidth}px`;
  }

   componentDidMount() {
      if (this.props.isFocused && this.input && this.input.focus) {
         this.input.focus();
      }
   }

   componentDidUpdate(prevProps, prevState) {
      if ((this.state.currentValue === prevState.currentValue) && (this.props.value !== prevState.previousValue)) {
         this.setState((prevState) => ({
            currentValue: this.props.value,
            previousValue: this.props.value
         }))
      }
      if (this.props.isFocused !== prevProps.isFocused) {
         if (this.input && this.input.focus && this.props.isFocused) {
            this.input.focus();
         }
      }
   }

   resetValue = () => {
      this.setState((prevState) => ({
         currentValue: prevState.previousValue
      }))
   }

   onChange(e) {
      let newValue = e.target.value;
      let valid = false;
      const format = this.props.format;
      const type = typeof format === 'string' ? format : format.type;
      const decimals = typeof format === 'string' ? 2 : format.decimals;
      const maxValue = typeof format === 'string' ? undefined : (format.hasOwnProperty('maxValue') ? format.maxValue : undefined);

      let re, isInRange
      switch (type) {
         case "text":
            valid = true;
            break;

         case "number":
            re = new RegExp(`^-?\\d*(\\.\\d{0,${decimals}})?$`);
            newValue = newValue.replace(/^0+(?!\.|$)/, '') // Automatically will change the newValue removing leading zeros
            isInRange = true;
            if (newValue.match(re)) {
               if (newValue === '') {
                  newValue = parseFloat('0');
               }
               //  Convert string to float
               if (maxValue != null) {

                  const floatValue = parseFloat(newValue);
                  if (floatValue) {
                     isInRange = floatValue <= maxValue
                  }
               }
               valid = isInRange;
            } else {
               valid = false
            }


            break;

         case "number-with-negative":
            re = new RegExp(`^-?\\d*(\\.\\d{0,${decimals}})?$`);
            isInRange = true;
            if (newValue.match(re)) {
               //  Convert string to float
               if (maxValue != null) {

                  const floatValue = parseFloat(newValue);
                  isInRange = floatValue <= maxValue
               }
               valid = isInRange;
            } else {
               valid = false
            }


            break;

         default:
            valid = true
      }

      if (valid) {
         this.setState(() => ({currentValue: newValue}));
      }


   }

   onChangeDate(e) {
      let date = e.target.value;
      if (date) {
         //  Remove Hours to fix bug with PT,CT
         date = dateFormatter(date).format('YYYY-MM-DD')
      }
      this.setState((prevState) => ({
         currentValue: date
      }))

      if (this.props.onUpdate) {
         this.props.onUpdate(date, this.resetValue)
      }
   }

   onBlur(e) {
      let finalValue = this.state.currentValue;
      const format = this.props.format;
      const type = typeof format === 'string' ? format : format.type;
      if ((type === 'number' || type === "currency") && ((finalValue && finalValue.length === 0) || !finalValue)) {
         //  This is to prevent an emtpy value
         finalValue = 0;
      }

      if (finalValue !== this.state.previousValue) {
         //  Only update the value if it has changed.
         // this.setState(() => ({ previousValue: finalValue }));

         if (this.props.onUpdate) {
            this.props.onUpdate(finalValue, this.resetValue)
         }
      }
      if (type === 'textarea') {
         this.setState((prevState) => ({
            caretPos: 0,
            isTextAreaMultiLineActive: false,
         }))
      }

   }

   onKeyDown(e) {
      let finalValue = this.state.currentValue;
      const format = this.props.format;
      const type = typeof format === 'string' ? format : format.type;
      if ((type === 'number' || type === "currency") && ((finalValue && finalValue.length === 0) || !finalValue)) {
         //  This is to prevent an emtpy value
         finalValue = 0;
      }

      if (finalValue !== this.state.previousValue) {
         //  Only update the value if it has changed.
         // this.setState(() => ({ previousValue: finalValue }));

         if (this.props.onKeyDown) {
            this.props.onKeyDown(e, {value: finalValue, resetValue: this.resetValue})
         }

      }
   }

   onFocus(e) {
      const {format, onFocus} = this.props;
      const {autoSelect} = format;
      const type = typeof format === 'string' ? format : format.type;
      if (onFocus) {
         onFocus();
      }
      if (autoSelect) {
         e.target.select();
      }
      if (type === 'textarea') {
         // Set the current caret (cursor) position to textArea
         const currentCaretPosition = this.state.caretPos;
         e.target.setSelectionRange(currentCaretPosition, currentCaretPosition);
      }
   }

   // Gets the current caret (cursor) position
   onCreateTextArea (e) {
      const range = window.getSelection().getRangeAt(0);
      const target = e.target;
      range.setStart(target, 0);
      const setPoint = range.toString().length;
      this.setState((prevState) => ({
         caretPos: setPoint,
      }))
  };

   render() {

      const {isFocused, format, limit, customProps = {}, onPaste, maxValue, customColumnClass, compressLongText, isItem, tabIndex, onFocus} = this.props;
      const {currentValue, isTextAreaMultiLineActive, selectExpanded} = this.state;
      const type = typeof format === 'string' ? format : format.type;
      const decimals = typeof format === 'string' ? 2 : format.decimals;

      const shouldShowBorder = this.props.allowNewRowSelectionProcess && (this.props.hoveredCellIndex === this.props.colIndex || isFocused);
      const isHovered = this.props.allowNewRowSelectionProcess && this.props.hoveredCellIndex === this.props.colIndex;

      const newRowSelectionStyle = this.props.allowNewRowSelectionProcess ? {
        margin: '5px 0px 5px 0px',
        width: isHovered ? '50%' : 'auto',
        maxWidth: '100%',
        border: shouldShowBorder ? '2px solid #1f76b7' : '2px solid transparent',
        cursor: 'text',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
      } : {
        margin: '0',
        maxWidth: '100%',
        width: '100%',
      };

      const newRowSelectionStyleWithMinimalWidth = this.props.allowNewRowSelectionProcess ? {
        minHeight: '20px',
        minWidth: isHovered ? '50%' : '20px',
        ...newRowSelectionStyle,
      } : {};

      switch (type) {
        case "textarea": {
          // Add 20px to the customWidth to account for the border, paddings, etc. and stop the text from being crammed into the cell
          const customWidth = (this.props.columnWidth ? `${Math.min(this.props.columnWidth, parseInt(this.calculateInputWidth(this.state.currentValue, this.props.columnWidth)))+20}px` : '100%');
          if (isFocused) {
            return (
              <Textarea
                className={this.props.allowNewRowSelectionProcess ? '' : `InputField ${customColumnClass}`}
                style={{
                  resize: "none",
                  margin: this.props.allowNewRowSelectionProcess ? '5px 0px 5px 0px' : '0',
                  maxWidth: '100%',
                  border: shouldShowBorder ? '2px solid #1f76b7' : '2px solid transparent',
                  cursor: 'text',
                  overflow: 'visible',
                  textOverflow: 'clip',
                  whiteSpace: 'normal',
                  backgroundColor: 'transparent',
                  wordWrap: 'break-word',
                  wordBreak: 'break-word',
                  boxSizing: 'border-box',
                  width: this.props.allowNewRowSelectionProcess ? customWidth : '100%',
                }}
                ref={(input) => {
                  this.input = input;
                }}
                tabIndex={tabIndex}
                onKeyDown={(e) => {
                  this.onKeyDown(e);
                  if (this.props.onKeyDownHotKeys) {
                    this.props.onKeyDownHotKeys(e);
                    if (e.shiftKey && e.keyCode === KEY_CODES.ENTER) {
                      this.setState((prevState) => ({
                        isTextAreaMultiLineActive: true,
                      }));
                    } else if (
                      (!e.shiftKey && e.keyCode === KEY_CODES.ENTER) ||
                      (!isTextAreaMultiLineActive &&
                        (e.keyCode === KEY_CODES.ARROW_UP ||
                          e.keyCode === KEY_CODES.ARROW_DOWN))
                    ) {
                      this.onBlur(e);
                    }
                  }
                }}
                minRows={1}
                type="text"
                value={this.state.currentValue}
                onChange={this.onChange}
                onBlur={this.onBlur}
                maxLength={limit}
                onFocus={(e) => {
                  this.onFocus(e);
                  setTimeout(() => {
                    if (this.input) {
                      const inputLength = this.input.value.length;
                      this.input.setSelectionRange(inputLength, inputLength);
                    }
                  })
                }}
              />
            );
          } else {
            const compressedClass = `Text ${customColumnClass} ${compressLongText ? "compress-row" : ""}` 
            return (
              <p
                className={this.props.allowNewRowSelectionProcess ? `Text ${customColumnClass}` : compressedClass}
                style={{
                  ...newRowSelectionStyleWithMinimalWidth,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  boxSizing: 'border-box',
                }}
                tabIndex={tabIndex}
                onClick={(e) => this.onCreateTextArea(e)}
                onFocus={() => {
                  if (onFocus) {
                    onFocus();
                  }
                }}
                onMouseEnter={(e) => {
                  e.target.style.whiteSpace = 'pre-wrap';
                  e.target.style.overflow = 'visible';
                  e.target.style.textOverflow = 'clip';
                  e.target.style.height = 'auto';
                  e.target.style.maxHeight = 'none';
                }}
                onMouseLeave={(e) => {
                  e.target.style.whiteSpace = 'nowrap';
                  e.target.style.overflow = 'hidden';
                  e.target.style.textOverflow = 'ellipsis';
                  e.target.style.height = '';
                  e.target.style.maxHeight = '';
                }}
              >
                {String(this.state.currentValue)}
              </p>
            );
          }
        }

        case "number": {
          const customWidth = this.props.columnWidth ? `${Math.min(this.props.columnWidth - 10, parseInt(this.calculateInputWidth(this.state.currentValue, this.props.columnWidth)))}px` : '100%';
          return (
            <input
              ref={(input) => {
                this.input = input;
              }}
              className={`InputField ${customColumnClass}`}
              type="text"
              value={this.state.currentValue}
              onChange={this.onChange}
              onBlur={this.onBlur}
              tabIndex={tabIndex}
              style={{
                resize: 'none',
                maxWidth: '100%',
                border: shouldShowBorder ? '2px solid #1f76b7' : '2px solid transparent',
                cursor: 'text',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                boxSizing: 'border-box',
                width: this.props.allowNewRowSelectionProcess ? customWidth : '100%',
              }}
              onKeyDown={(e) => {
                this.onKeyDown(e);
                if (this.props.onKeyDownHotKeys) {
                  this.props.onKeyDownHotKeys(e);
                  if (e.shiftKey && e.keyCode === KEY_CODES.ENTER) {
                    this.setState((prevState) => ({
                      isTextAreaMultiLineActive: true,
                    }));
                  } else if (
                    (!e.shiftKey && e.keyCode === KEY_CODES.ENTER) ||
                    (!isTextAreaMultiLineActive &&
                      (e.keyCode === KEY_CODES.ARROW_UP ||
                        e.keyCode === KEY_CODES.ARROW_DOWN))
                  ) {
                    this.onBlur(e);
                  }
                }
              }}
              onPaste={(e) => {
                if (onPaste) {
                  onPaste(e);
                }
              }}
              onFocus={this.onFocus}
            />
          )
        }

        case "progress-bar": {
          return (
            <InputConfirm
              value={this.state.currentValue}
              hide={!isFocused}
              tabIndex={tabIndex}
              onAccept={(value) => {
                this.onChange({ target: { value } });
                if (this.props.onUpdate) {
                  this.props.onUpdate(value, this.resetValue);
                }
              }}
              onKeyUp={(e) => {
                if (this.props.onKeyUp) this.props.onKeyUp(e);
              }}
              onKeyDown={(e) => {
                this.onKeyDown(e);
                if (this.props.onKeyDownHotKeys) {
                  this.props.onKeyDownHotKeys(e);
                  if (e.shiftKey && e.keyCode === KEY_CODES.ENTER) {
                    this.setState((prevState) => ({
                      isTextAreaMultiLineActive: true,
                    }));
                  } else if (
                    (!e.shiftKey && e.keyCode === KEY_CODES.ENTER) ||
                    (!isTextAreaMultiLineActive &&
                      (e.keyCode === KEY_CODES.ARROW_UP ||
                        e.keyCode === KEY_CODES.ARROW_DOWN))
                  ) {
                    this.onBlur(e);
                  }
                }
              }}
              trigger={
                <Progress
                  progress
                  color="blue"
                  percent={this.state.currentValue}
                  className={`InputField ${customColumnClass}`}
                />
              }
              appearOnClick={true}
            />
          );
        }
        case "number-with-negative": {
          return (
            <input
              ref={(input) => {
                this.input = input;
              }}
              className={this.props.allowNewRowSelectionProcess ? customColumnClass : `InputField ${customColumnClass}`}
              type="text"
              value={this.state.currentValue}
              onChange={this.onChange}
              onBlur={this.onBlur}
              onFocus={this.onFocus}
              tabIndex={tabIndex}
              style={{
                ...newRowSelectionStyleWithMinimalWidth,
                width: this.props.allowNewRowSelectionProcess ? customWidth : '100%',
              }}
              onKeyDown={(e) => {
                this.onKeyDown(e);
                if (this.props.onKeyDownHotKeys) {
                  this.props.onKeyDownHotKeys(e);
                  if (e.shiftKey && e.keyCode === KEY_CODES.ENTER) {
                    this.setState((prevState) => ({
                      isTextAreaMultiLineActive: true,
                    }));
                  } else if (
                    (!e.shiftKey && e.keyCode === KEY_CODES.ENTER) ||
                    (!isTextAreaMultiLineActive &&
                      (e.keyCode === KEY_CODES.ARROW_UP ||
                        e.keyCode === KEY_CODES.ARROW_DOWN))
                  ) {
                    this.onBlur(e);
                  }
                }
              }}
            />
          );
        }

        case "currency": {
          const customWidth = (this.props.columnWidth ? `${Math.min(this.props.columnWidth, parseInt(this.calculateInputWidth(this.state.currentValue, this.props.columnWidth)))}px` : '100%');
          return (
            <Cleave
              className={`InputField ${customColumnClass}`}
              value={this.state.currentValue}
              htmlRef={(input) => {
                this.input = input;
              }}
              tabIndex={tabIndex}
              style={{
                ...newRowSelectionStyleWithMinimalWidth,
                width: this.props.allowNewRowSelectionProcess ? customWidth : '100%',
              }}
              onChange={(e) => {
                const value = e.target.rawValue;
                let isValid = true;
                if (maxValue != null) {
                  const floatValue = parseFloat(value);
                  isValid = floatValue <= maxValue;
                }

                if (isValid) {
                  this.setState((prevState) => ({
                    currentValue: value,
                  }));
                }
              }}
              onPaste={(e) => {
                if (onPaste) {
                  onPaste(e);
                }
              }}
              onKeyDown={(e) => {
                this.onKeyDown(e);
                if (this.props.onKeyDownHotKeys) {
                  this.props.onKeyDownHotKeys(e);
                  if (e.shiftKey && e.keyCode === KEY_CODES.ENTER) {
                    this.setState((prevState) => ({
                      isTextAreaMultiLineActive: true,
                    }));
                  } else if (
                    (!e.shiftKey && e.keyCode === KEY_CODES.ENTER) ||
                    (!isTextAreaMultiLineActive &&
                      (e.keyCode === KEY_CODES.ARROW_UP ||
                        e.keyCode === KEY_CODES.ARROW_DOWN))
                  ) {
                    this.onBlur(e);
                  }
                }
              }}
              onBlur={this.onBlur}
              onFocus={this.onFocus}
              options={{
                numeral: true,
                rawValueTrimPrefix: true,
                numeralDecimalScale: decimals,
                prefix: "$",
              }}
            />
          );
        }

        case "percentage": {
          return (
            <Cleave
              className={this.props.allowNewRowSelectionProcess ? customColumnClass : `InputField ${customColumnClass}`}
              value={this.state.currentValue || "0"}
              htmlRef={(input) => {
                this.input = input;
              }}
              tabIndex={tabIndex}
              style={newRowSelectionStyleWithMinimalWidth}
              onChange={(e) => {
                let value = e.target.rawValue;

                // Ignore the tail prefix when pressing backspace and the cursor is at the end of the input
                if (e.nativeEvent.inputType === "deleteContentBackward" && this.input.selectionEnd === this.input.value.length) {
                  value = value.slice(0, -1);
                }

                let isValid = true;
                if (maxValue != null) {
                  const floatValue = parseFloat(value);
                  isValid = floatValue <= maxValue;
                }
                if (isValid) {
                  this.setState((prevState) => ({
                    currentValue: value,
                  }), () => {
                    if (this.props.updateRow) {
                      this.props.updateRow(value);
                    }
                  });
                }
              }}
              onPaste={(e) => {
                if (onPaste) {
                  onPaste(e);
                }
              }}
              onKeyDown={(e) => {
                this.onKeyDown(e);
                if (this.props.onKeyDownHotKeys) {
                  this.props.onKeyDownHotKeys(e);
                  if (e.shiftKey && e.keyCode === KEY_CODES.ENTER) {
                    this.setState((prevState) => ({
                      isTextAreaMultiLineActive: true,
                    }));
                  } else if (
                    (!e.shiftKey && e.keyCode === KEY_CODES.ENTER) ||
                    (!isTextAreaMultiLineActive &&
                      (e.keyCode === KEY_CODES.ARROW_UP ||
                        e.keyCode === KEY_CODES.ARROW_DOWN))
                  ) {
                    this.onBlur(e);
                  }
                }
              }}
              onBlur={this.onBlur}
              onFocus={this.onFocus}
              options={{
                numeral: true,
                rawValueTrimPrefix: true,
                numeralDecimalScale: decimals,
                prefix: "%",
                tailPrefix: true,
              }}
            />
          );
        }

        case "number-format": {
          return (
            <NumericFormat
              getInputRef={(input) => {
                this.input = input;
              }}
              className={`InputField ${customColumnClass}`}
              value={this.state.currentValue}
              onBlur={this.onBlur}
              tabIndex={tabIndex}
              style={newRowSelectionStyleWithMinimalWidth}
              onValueChange={(values) => {
                const { value } = values;
                // formattedValue = $2,223
                // value ie, 2223
                this.setState((prevState) => ({
                  currentValue: value,
                }));
              }}
              onFocus={this.onFocus}
              thousandSeparator={true}
              onKeyDown={(e) => {
                this.onKeyDown(e);
                if (this.props.onKeyDownHotKeys) {
                  this.props.onKeyDownHotKeys(e);
                  if (e.shiftKey && e.keyCode === KEY_CODES.ENTER) {
                    this.setState((prevState) => ({
                      isTextAreaMultiLineActive: true,
                    }));
                  } else if (
                    (!e.shiftKey && e.keyCode === KEY_CODES.ENTER) ||
                    (!isTextAreaMultiLineActive &&
                      (e.keyCode === KEY_CODES.ARROW_UP ||
                        e.keyCode === KEY_CODES.ARROW_DOWN))
                  ) {
                    this.onBlur(e);
                  }
                }
              }}
              onPaste={(e) => {
                if (onPaste) {
                  onPaste(e);
                }
              }}
              {...format.options}
            />
          );
        }

        case "text": {
          const customWidth = (this.props.columnWidth ? `${Math.min(this.props.columnWidth - 10, parseInt(this.calculateInputWidth(this.state.currentValue, this.props.columnWidth)))}px` : '100%');
          return isFocused ? (
            <input
              className={this.props.allowNewRowSelectionProcess ? '' : `InputField ${customColumnClass}`}
              ref={(input) => {
                this.input = input;
              }}
              type="text"
              value={this.state.currentValue}
              onChange={this.onChange}
              onBlur={this.onBlur}
              maxLength={limit}
              tabIndex={tabIndex}
              style={{
                ...(this.props.allowNewRowSelectionProcess && { boxSizing: 'border-box' }),
                width: this.props.allowNewRowSelectionProcess ? customWidth : '100%',
                resize: 'none',
                margin: this.props.allowNewRowSelectionProcess ? '5px 0px 5px 0px' : '0',
                border: shouldShowBorder ? '2px solid #1f76b7' : '2px solid transparent',
                cursor: 'text',
                backgroundColor: 'transparent',
                maxWidth: '100%',
              }}
              onPaste={(e) => {
                if (onPaste) {
                  onPaste(e);
                }
              }}
              onFocus={this.onFocus}
              onKeyDown={(e) => {
                this.onKeyDown(e);
                if (this.props.onKeyDownHotKeys) {
                  this.props.onKeyDownHotKeys(e);
                  if (e.shiftKey && e.keyCode === KEY_CODES.ENTER) {
                    this.setState((prevState) => ({
                      isTextAreaMultiLineActive: true,
                    }));
                  } else if (
                    (!e.shiftKey && e.keyCode === KEY_CODES.ENTER) ||
                    (!isTextAreaMultiLineActive &&
                      (e.keyCode === KEY_CODES.ARROW_UP ||
                        e.keyCode === KEY_CODES.ARROW_DOWN))
                  ) {
                    this.onBlur(e);
                  }
                }
              }}
              {...customProps}
            />
          ) : (
            <div
              className={this.props.allowNewRowSelectionProcess ? `value expanded-column` : `left-align-flex value ${customColumnClass} expanded-column`}
              tabIndex={tabIndex}
              onClick={this.onFocus}
              onFocus={(e) => {
                if (this.props.onFocus) {
                  this.props.onFocus();
                }
              }}
              style={{
                outline: 'none',
                cursor: 'text',
                minHeight: '20px',
                minWidth: '50%',
                maxWidth: '100%',
                border: shouldShowBorder ? '2px solid #1f76b7' : '2px solid transparent',
                overflow: 'visible',
                wordWrap: 'break-word',
                whiteSpace: 'normal',
                boxSizing: 'border-box',
                display: 'flex',
                flex: this.props.allowNewRowSelectionProcess ? 'none' : 1,
                alignItems: 'center',
              }}
            >
              <span className={`${compressLongText ? "compress-row" : ""}`}>
                {String(this.state.currentValue) || ''}
              </span>
            </div>
          );
        }

        case "select": {
          const { options, placeholder, defaultValue } = this.props.format;
          // Use currentValue if it exists, otherwise null (which will show placeholder)
          let value = this.state.currentValue;
          
          // If currentValue is null, use defaultValue
          if (value == null && defaultValue != null && defaultValue !== "") {
            value = defaultValue;
          }
          return isFocused ? (
              <select
                ref={(input) => {
                  this.input = input;
                }}
                value={value}
                className={this.props.allowNewRowSelectionProcess ? '' : `InputField ${customColumnClass}`}
                onBlur={(e) => {
                  this.setState({ selectExpanded: false });
                  this.onBlur(e);
                }}
                onFocus={this.onFocus}
                onChange={this.onChange}
                tabIndex={tabIndex}
                style={{
                  width: '100%',
                  border: shouldShowBorder ? '2px solid #1f76b7' : '2px solid transparent',
                  height: selectExpanded ? 'auto' : undefined,
                }}
              >
                {(!value || value === '') && !defaultValue && (
                  <option value="" disabled>
                    {placeholder || 'Selecciona una opción'}
                  </option>
                )}
                {options.map(({ value: optionValue, key, text }, index) => (
                  <option value={optionValue} key={key ? key : index}>
                    {text}
                  </option>
                ))}
              </select>
          ) : (
            <div
              className={this.props.allowNewRowSelectionProcess ? '' : `InputField ${customColumnClass}`}
              onClick={() => {
                // Focus the InputField component first
                if (this.props.onFocus) {
                  this.props.onFocus();
                }
                // Then simulate a click on the focused element after a brief delay
                setTimeout(() => {
                  if (this.input) {
                    this.input.showPicker();                      
                  }
                }, 50);
              }}
              onFocus={() => {
                if (this.props.onFocus) {
                  this.props.onFocus();
                }
              }}
              style={{
                outline: 'none',
                cursor: 'pointer',
                color: isItem ? 'black' : 'white',
                minHeight: '20px',
                minWidth: '20px',
                width: '100%',
                border: shouldShowBorder ? '2px solid #1f76b7' : '2px solid transparent',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                boxSizing: 'border-box',
              }}
            >
              {
                options.find((option) => option.key === (this.state.currentValue || defaultValue))?.text || placeholder || 'Selecciona una opción'
              }
            </div>
          )

        }

        case "date": {
          const toDate = (date) => {
            if (!date) return;
            let p = date.split("-");
            p = p.map((i) => parseInt(i));
            return new Date(p[0], p[1] - 1, p[2]);
          };

          let selected = currentValue;
          if (typeof currentValue == "string") {
            selected = toDate(selected);
          } else if (typeof currentValue == "number") {
            selected = new Date(selected);
          }

          // Check if filter function is provided in format
          const filterDate = typeof format === 'object' ? format.filterDate : null;
          const filterHermosilloNonWorkingDays = typeof format === 'object' ? format.filter_hermosillo_non_working_days : false;
          
          const isWorkingday = (date) => {
            return dateFormatter(date).isHermosilloWorkingDay();
          };

          const customWidth = (this.props.columnWidth ? `${Math.min(this.props.columnWidth, parseInt(this.calculateInputWidth(this.state.currentValue, this.props.columnWidth)))}px` : '100%');

          return (
            <TableDatePicker
              selected={selected}
              style={{
                width: '100%',
                border: shouldShowBorder ? '2px solid #1f76b7' : '2px solid transparent',
                width: this.props.allowNewRowSelectionProcess ? customWidth : '100%',
                minWidth: '70%',
              }}
              onChange={(date) => {
                this.onChangeDate({ target: { value: date } });
              }}
              filterDate={!filterHermosilloNonWorkingDays ? filterDate : isWorkingday}
              disabled={this.props.disabled}
              tabIndex={tabIndex}
              {...customProps}
            />
          );
        }

        case "boolean": {
          const booleanStyle = {
            ...newRowSelectionStyleWithMinimalWidth,
            width: '100%',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            margin: this.props.allowNewRowSelectionProcess ? '5px auto' : 'auto'
          };

          return (
            <React.Fragment>
              {this.state.currentValue ? (
                <div
                  className={this.props.allowNewRowSelectionProcess ? `InputField-Boolean ${customColumnClass}` : `InputField-Boolean ${customColumnClass}`}
                  tabIndex={tabIndex}
                  style={booleanStyle}
                  onClick={() => {
                    this.props.onUpdate(
                      !this.state.currentValue,
                      this.resetValue
                    );
                  }}
                >
                  {format.trueIcon ? (
                    format.trueIcon({ isItem })
                  ) : (
                    <Icon
                      style={{
                        margin: "auto",
                        color: isItem ? "black" : "white",
                      }}
                      name={"checkmark"}
                    />
                  )}
                </div>
              ) : (
                <div
                  className={this.props.allowNewRowSelectionProcess ? `InputField-Boolean ${customColumnClass}` : `InputField-Boolean ${customColumnClass}`}
                  tabIndex={tabIndex}
                  style={booleanStyle}
                  onClick={() => {
                    this.props.onUpdate(
                      !this.state.currentValue,
                      this.resetValue
                    );
                  }}
                >
                  {format.falseIcon ? format.falseIcon({ isItem }) : ""}
                </div>
              )}
            </React.Fragment>
          );
        }

        case "search": {
          if (isFocused) {
            return (
              <InputFieldSearch
                {...this.props}
                {...format}
                resetValue={this.resetValue}
                value={this.state.currentValue}
                tabIndex={tabIndex}
                allowNewRowSelectionProcess={this.props.allowNewRowSelectionProcess}
                customStyle={this.props.customStyle}
              />
            );
          } else {
            return (
              <div
                className={`left-align-flex value ${customColumnClass} expanded-column`}
                onClick={() => {
                  if (this.props.onFocus) {
                    this.props.onFocus();
                  }

                  // Simulate a click on the focused element to trigger the search
                  setTimeout(() => {
                    if (this.input) {
                      this.input.focus();
                    }
                  }, 50);
                }}
                onFocus={(e) => {
                  if (this.props.onFocus) {
                    this.props.onFocus();
                  }
                }}
                style={{
                  ...this.props.customStyle,
                  outline: 'none',
                  cursor: 'pointer',
                  minHeight: '20px',
                  minWidth: '20px',
                  width: '100%',
                  border: shouldShowBorder ? '2px solid #1f76b7' : '2px solid transparent',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  boxSizing: 'border-box',
                  padding: this.props.allowNewRowSelectionProcess ? '5px 0px 5px 0px' : '0',
                }}
              >
                <span className={`${compressLongText ? "compress-row" : ""}`}>
                  {this.state.currentValue ? (
                    this.state.currentValue
                  ) : (
                    <span className="Color-Light-Grey">{format.placeholder}</span>
                  )}
                </span>
              </div>
            );
          }
        }
          
        default:
          break;
      }
   };
}

InputField.propTypes = {
   value: PropTypes.any.isRequired,
   isFocused: PropTypes.bool,
   tabIndex: PropTypes.number,
   //onBlur: PropTypes.func.isRequired
};

InputField.defaultProps = {
   format: 'text'
};

export default InputField
