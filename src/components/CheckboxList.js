import React, {useCallback} from 'react';
import PropTypes from 'prop-types';
import {Checkbox, Grid} from "semantic-ui-react";

const CheckboxList = ({checkList, value, onChange: onChangeProp}) => {

   const onChange = useCallback((check, checked) => {
      const newValue = {
         ...value,
         [check.value]: true
      };
      if (!checked)
         delete newValue[check.value];
      onChangeProp(newValue);
   }, [value, onChangeProp]);

   return (
      <Grid>
         <Grid.Row>
            {
               checkList.map(e => {
                  return (
                     <Grid.Column key={e.name} width={2}>
                        <Checkbox label={e.label} value={e.value}
                                  checked={value[e.value] === true}
                                  onChange={(event, data) => onChange(e, data.checked)}/>
                     </Grid.Column>
                  )
               })
            }
         </Grid.Row>
      </Grid>
   );
};

CheckboxList.propTypes = {
   checkList: PropTypes.array,
   value: PropTypes.object,
   onChange: PropTypes.func,
};

CheckboxList.defaultProps = {
   checkList: [],
   value: {},
   onChange: () => {
   },
};

export default CheckboxList;
