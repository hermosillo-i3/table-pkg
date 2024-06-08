import React, { useState, useEffect } from "react";
import { Search } from "semantic-ui-react";
import deburr from "lodash/deburr";
import escapeRegExp from "lodash/escapeRegExp";
import filter from "lodash/filter";

const initialState = { isLoading: false, results: [], value: "" };

/**
 * Returns properties of object in the selected stringProp
 * Example: getObjectProp({a: {b: 1}}, 'a.b') returns 1
 * @param {Object} object
 * @param {String} stringProp
 * @returns {Object}
 */
const getObjectProp = function (object, stringProp) {
    let s = stringProp
    let o = object
    s = s.replace(/\[(\w+)\]/g, '.$1') // convert indexes to properties
    s = s.replace(/^\./, '') // strip a leading dot
    const a = s.split('.')
    for (let i = 0, n = a.length; i < n; ++i) {
        const k = a[i]
        if (k in o) {
            o = o[k]
        } else {
            return
        }
    }
    return o
}

const InputFieldSearch = (props) => {
    const searchRef = React.createRef();
    const hiddenRef = React.createRef();

    const {
      isFocused,
      customColumnClass,
      compressLongText,
      options,
      searchAttribute = "title",
      placeholder = "Buscar...",
      resetValue,
      onUpdate,
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
    //   if (props.onChangeSelected) {
    //     props.onChangeSelected(result);
    //   }
      const { title } = result;
      setHasUpdated(true);
      setValue(title);
      onUpdate(result, resetValue);
    //   hiddenRef.current.focus();
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
          props.onKeyDownHotKeys(e);
        } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            if(results.length === 0){
                props.onKeyDownHotKeys(e);
            }
        }
        console.log("e.key", e.key);
        e.stopPropagation();
    };

    if (isFocused) {
           return (
             <React.Fragment>
               <input
                 ref={hiddenRef}
                 type="text"
                 style={{
                   position: "absolute",
                   left: "-9999px",
                //    display: "none",
                 }}
               />
               <Search
                 input={{ ref: searchRef }}
                 placeholder={"Escribe para buscar..."}
                 minCharacters={3}
                 fluid
                 noResultsMessage="No se encontraton resultados"
                 loading={isLoading}
                 onResultSelect={handleResultSelect}
                 onSearchChange={handleSearchChange}
                 onBlur={handleBlur}
                 onKeyDown={handleKeyDown}
                 results={results}
                 value={value}
               />
             </React.Fragment>
           );
         }else{
             return (
               <div
                 className={`left-align-flex value ${customColumnClass} expanded-column`}
               >
                 <span className={`${compressLongText ? "compress-row" : ""}`}>
                   {value ? (
                     value
                   ) : (
                     <span className="Color-Light-Grey">{placeholder}</span>
                   )}
                 </span>
               </div>
             );
          
         }
};

export default InputFieldSearch;