import React, { useState, useEffect } from "react";
import { Search, Icon } from "semantic-ui-react";
import { getObjectProp } from "@hermosillo-i3/utils-pkg/src/object";
import { performEnhancedSearch } from "../utils/index";

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
      // Use name if available, otherwise fall back to title
      const displayValue = result.name || result.title;
      setHasUpdated(true);
      setValue(displayValue);
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

      // Use enhanced search for better matching and scoring
      const searchOptions = {
        useEnhancedSearch: true,
        limit: 5,
        titleField: searchAttribute,
        searchPropField: searchAttribute,
        // If searchAttribute is a function, we'll need to handle it differently
        // For now, we'll use the enhanced search which will auto-detect field structure
      };

      // If searchAttribute is a function, we need to transform the options
      // to include the computed search value in a standard field
      let itemsToSearch = options;
      if (typeof searchAttribute === "function") {
        itemsToSearch = options.map(item => ({
          ...item,
          title: searchAttribute(item), // Used for search matching (e.g., "name - email")
        }));
        searchOptions.titleField = 'title';
        searchOptions.searchPropField = 'title';
      }

      let filteredResults = performEnhancedSearch(itemsToSearch, value, searchOptions);

      // Format results for display: show only name as title, email as description
      const formattedResults = filteredResults.map(result => {
        const formattedResult = { ...result };
        
        // If the original item has name, use it as title; otherwise keep existing title
        if (result.name) {
          formattedResult.title = result.name;
        }
        
        // If the original item has email, use it as description
        if (result.email) {
          formattedResult.description = result.email;
        }
        
        return formattedResult;
      });

      setIsLoading(false);
      setResults(formattedResults);
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
                       placeholder={placeholder}
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