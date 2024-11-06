import React from 'react'
import PropTypes from 'prop-types'
import Textarea from 'react-textarea-autosize';
import { Icon, Progress } from "semantic-ui-react";
import Cleave from 'cleave.js/react';
import {NumericFormat} from 'react-number-format';
import dateFormatter from "../utils/dateFormatter";

import InputConfirm from "./InputConfirm";
import InputFieldSearch from "./InputFieldSearch";

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
      };
      this.onChange = this.onChange.bind(this);
      this.onChangeDate = this.onChangeDate.bind(this);
      this.onBlur = this.onBlur.bind(this);
      this.onFocus = this.onFocus.bind(this);
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

      const {isFocused, format, limit, customProps = {}, onPaste, maxValue, customColumnClass, compressLongText, isItem} = this.props;
      const {currentValue, isTextAreaMultiLineActive} = this.state;
      const type = typeof format === 'string' ? format : format.type;
      const decimals = typeof format === 'string' ? 2 : format.decimals;

      switch (type) {
        case "textarea": {
          if (isFocused) {
            return (
              <Textarea
                className={`InputField ${customColumnClass}`}
                style={{
                  resize: "none",
                  padding: 0,
                }}
                inputRef={(input) => {
                  this.input = input;
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
                minRows={1}
                type="text"
                value={this.state.currentValue}
                onChange={this.onChange}
                onBlur={this.onBlur}
                maxLength={limit}
                onFocus={this.onFocus}
              />
            );
          } else {
            return (
              <p
                className={`Text ${customColumnClass} ${
                  compressLongText ? "compress-row" : ""
                }`}
                onClick={(e) => this.onCreateTextArea(e)}
              >
                {this.state.currentValue}
              </p>
            );
          }
        }

        case "number": {
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
          );
        }

        case "progress-bar": {
          return (
            <InputConfirm
              value={this.state.currentValue}
              hide={!isFocused}
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
              className={`InputField ${customColumnClass}`}
              type="text"
              value={this.state.currentValue}
              onChange={this.onChange}
              onBlur={this.onBlur}
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
            />
          );
        }

        case "currency": {
          return (
            <Cleave
              className={`InputField ${customColumnClass}`}
              value={this.state.currentValue}
              htmlRef={(input) => {
                this.input = input;
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
              className={`InputField ${customColumnClass}`}
              value={this.state.currentValue || "0"}
              htmlRef={(input) => {
                this.input = input;
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
                tailPrefix:true,
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
          return isFocused ? (
            <input
              className={`InputField ${customColumnClass}`}
              ref={(input) => {
                this.input = input;
              }}
              type="text"
              value={this.state.currentValue}
              onChange={this.onChange}
              onBlur={this.onBlur}
              maxLength={limit}
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
              className={`left-align-flex value ${customColumnClass} expanded-column`}
            >
              <span className={`${compressLongText ? "compress-row" : ""}`}>
                {this.state.currentValue}
              </span>
            </div>
          );
        }

        case "select": {
          const { options, placeholder, defaultValue } = this.props.format;
          let value = this.state.currentValue;
          if (defaultValue != null && defaultValue !== "") {
            value =
              this.state.currentValue == null || this.state.currentValue === ""
                ? defaultValue
                : this.state.currentValue;
          }
          return (
            <select
              defaultValue={defaultValue}
              value={value}
              className={`InputField ${customColumnClass}`}
              placeholder={placeholder}
              onChange={this.onChange}
              onBlur={this.onBlur}
              onFocus={this.onFocus}
            >
              {options.map(({ value, key, text }, index) => (
                <option value={value} key={key ? key : index}>
                  {text}
                </option>
              ))}
            </select>
          );
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

          return (
            <React.Fragment>
              <input
                type="date"
                onFocus={this.onFocus}
                className={`InputField ${customColumnClass}`}
                onChange={this.onChangeDate}
                value={
                  selected ? dateFormatter(selected).format("YYYY-MM-DD") : null
                }
                onKeyDown={(e) => {
                  this.onKeyDown(e);
                  if (this.props.onKeyDownHotKeys)
                    this.props.onKeyDownHotKeys(e);
                }}
                {...customProps}
              />
            </React.Fragment>
          );
        }

        case "boolean": {
          return (
            <React.Fragment>
              {this.state.currentValue ? (
                <div
                  className={`InputField-Boolean ${customColumnClass}`}
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
                  className={`InputField-Boolean ${customColumnClass}`}
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

         return (
           <InputFieldSearch
             {...this.props}
             {...format}
             resetValue={this.resetValue}
             value={this.state.currentValue}
           />
         );
         }
          
        default:
          break;
      }
   };
}

InputField.propTypes = {
   value: PropTypes.any.isRequired,
   isFocused: PropTypes.bool,
   //onBlur: PropTypes.func.isRequired
};

InputField.defaultProps = {
   format: 'text'
};

export default InputField
