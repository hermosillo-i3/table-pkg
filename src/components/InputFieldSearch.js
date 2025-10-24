import React, { useState, useEffect } from "react";
import { Search, Icon } from "semantic-ui-react";
import deburr from "lodash/deburr";
import escapeRegExp from "lodash/escapeRegExp";
import filter from "lodash/filter";
import { getObjectProp } from "@hermosillo-i3/utils-pkg/src/object";

const initialState = { isLoading: false, results: [], value: "" };

const InputFieldSearch = (props) => {
    const searchRef = React.createRef();

    const {
      isFocused,
      customColumnClass,
      compressLongText,
      options,
      searchAttribute = "title",
      placeholder = "Buscar...",
      resetValue,
      onUpdate,
      allowNewRowSelectionProcess,
      customStyle,
    } = props;

    const [isLoading, setIsLoading] = useState(initialState.isLoading);
    const [results, setResults] = useState(initialState.results);
    const [value, setValue] = useState(props.value);
    const [hasUpdated, setHasUpdated] = useState(false);

    useEffect(() => {
        if(isFocused){
            searchRef.current.focus();
        }
    }, [isFocused]);

    const handleResultSelect = (_, { result }) => {
      const { title } = result;
      setHasUpdated(true);
      setValue(title);
      onUpdate(result, resetValue);
    };

    /**
     * Handles clearing the selected value and resetting the component to initial state
     */
    const handleClear = () => {
      setValue("");
      setHasUpdated(true);
      setResults([]);
      onUpdate(null, resetValue);
    };

    const handleSearchChange = (_, { value }) => {
      setValue(value);
      setIsLoading(true);
      setHasUpdated(false);

      const re = new RegExp(escapeRegExp(value), "i");
      
      const isMatch = (result) => {
        const searchValue =
          typeof searchAttribute === "function"
            ? searchAttribute(result)
            : getObjectProp(result, searchAttribute);

        return re.test(deburr(searchValue));
      };

      let filteredResults = filter(options, isMatch);

      // add limit to the results of 5
      filteredResults = filteredResults.slice(0, 5);

      setIsLoading(false);
      setResults(filteredResults);
    };

    const handleBlur = () => {
        if(!hasUpdated){
            // Reset the value in case the user didn't select any result
            setValue(props.value);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
          if (results.length === 1) {
            handleResultSelect(null, { result: results[0] });
          }
          if (!hasUpdated) {
            // Reset the value in case the user didn't select any result
            setValue(props.value);
          }
          props.onKeyDownHotKeys(e);
        } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            if(results.length === 0){
                props.onKeyDownHotKeys(e);
            }
        }
        e.stopPropagation();
    };
    if (isFocused) {
           return (
              <React.Fragment>
                 <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <Search
                       className={`InputFieldSearch ${customColumnClass}`}
                       input={{ ref: searchRef, icon: value ? null : "search" }}
                       placeholder={"Escribe para buscar..."}
                       minCharacters={3}
                       fluid
                       noResultsMessage="No se encontraron resultados"
                       loading={isLoading}
                       onResultSelect={handleResultSelect}
                       onSearchChange={handleSearchChange}
                       onBlur={handleBlur}
                       onKeyDown={handleKeyDown}
                       results={results}
                       value={value}
                       style={customStyle}
                    />
                    {value && (
                       <Icon
                          name="times"
                          className="clear-icon-focused"
                          style={{
                             position: "absolute",
                             right: "5px",
                             top: "7px",
                             cursor: "pointer",
                             color: "red",
                             fontSize: "12px",
                             zIndex: 10,
                          }}
                          onClick={handleClear}
                       />
                    )}
                 </div>
              </React.Fragment>
           );
         }else{
             return (
                <div
                   className={
                      allowNewRowSelectionProcess
                         ? `left-align-flex value ${customColumnClass}`
                         : `left-align-flex value ${customColumnClass} expanded-column`
                   }
                   style={customStyle}
                >
                   <span className={`${compressLongText ? "compress-row" : ""}`}>
                      {value ? value : <span className="Color-Light-Grey">{placeholder}</span>}
                   </span>
                </div>
             );
          
         }
};

export default InputFieldSearch;