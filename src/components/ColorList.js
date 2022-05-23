import React from 'react'
import PropTypes from 'prop-types'

const colorButtonStyle = {
   display: 'flex',
   margin: '0 8px 8px 0',
   width: '48px',
   height: '32px',
   borderRadius: '4px',
   alignItems: 'center',
   justifyContent: 'center',
   cursor: 'pointer'
};

const iconStyle = {
   margin: 0,
   height: '17px',
   color: 'white',
   display: 'block',
   ':hover': {
      opacity: '0.8'
   }
};

const listColorsStyle = {
   display: 'flex',
   flexBasis: '100%',
   flexWrap: 'wrap'
};

const ColorList = (props) => {
   const {colors, onChange, value} = props;
   return (
      <div style={listColorsStyle}>
         {colors.map((color) => (
            <div
               style={colorButtonStyle}
               className={`bg-base ${color} hover-opacity`} key={color}
               onClick={() => onChange(color)}>
               <i className={`icon ${value === color ? 'check' : ''}`} style={iconStyle}/>
            </div>
         ))}
      </div>
   )
};

ColorList.propTypes = {
   colors: PropTypes.array.isRequired,
   onChange: PropTypes.func.isRequired
};

export default ColorList;
