import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import dateFormatter from "@hermosillo-i3/utils-pkg/src/dateFormatter";
import 'react-datepicker/dist/react-datepicker.css';

const TableDatePicker = ({
  selected,
  onChange,
  disabled = false,
  filterDate = null,
  dateFormat = "dd/MM/yyyy",
  placeholderText = "dd/mm/yyyy",
  onKeyDown,
  className = "",
  ...props
}) => {
  
  // Working day filter function
  const isWorkingday = (date) => {
    return dateFormatter(date).isHermosilloWorkingDay();
  };

  // Convert string/number dates to Date objects
  const getSelectedDate = () => {
    if (!selected) return null;
    
    if (typeof selected === "string") {
      const parts = selected.split("-");
      if (parts.length === 3) {
        const [year, month, day] = parts.map(p => parseInt(p));
        return new Date(year, month - 1, day);
      }
    } else if (typeof selected === "number") {
      return new Date(selected);
    } else if (selected instanceof Date) {
      return selected;
    }
    
    return null;
  };

  // Handle date change
  const handleDateChange = (date) => {
    if (onChange) {
      onChange(date);
    }
  };

  // Handle key down events
  const handleKeyDown = (e) => {
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  // Handle click events to prevent row selection
  const handleClick = (e) => {
    e.stopPropagation();
  };

  const selectedDate = getSelectedDate();

  return (
    <div onClick={handleClick}>
      <DatePicker
        locale="es"
        selected={selectedDate}
        onChange={handleDateChange}
        filterDate={filterDate}
        disabled={disabled}
        dateFormat={dateFormat}
        placeholderText={placeholderText}
        onKeyDown={handleKeyDown}
        className={`table-datepicker ${className}`}
        popperClassName="table-datepicker-popper"
        wrapperClassName="table-datepicker-wrapper"
        calendarClassName="table-datepicker-calendar"
        {...props}
      />
    </div>
  );
};

TableDatePicker.propTypes = {
  selected: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Date)
  ]),
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  filterDate: PropTypes.func,
  dateFormat: PropTypes.string,
  placeholderText: PropTypes.string,
  onKeyDown: PropTypes.func,
  className: PropTypes.string,
};

export default TableDatePicker; 