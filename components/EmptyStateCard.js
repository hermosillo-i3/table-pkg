import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {Header} from "semantic-ui-react";

const EmptyStateCard = (props) => {
  const {isOver, canDrop, title, subtitle, icon, iconRotation, isMultiple = false, size="medium"} = props

  let iconSize;

  switch (size) {
    case 'small': iconSize="2x"; break;
    case 'medium': iconSize="4x"; break;
    case 'big': iconSize="6x"; break;
    default:
      break;
  }

  
  return (
    <div className={`empty-table-card-container-${size} ${isOver && canDrop ? 'is_over_zone' : ''}`}>
      <div className="empty-table-card">
        <div className={`empty-table-card-icon-${size}`}>
          <FontAwesomeIcon rotation={iconRotation} icon={icon} size={iconSize} className='icon' />
        </div>
        {isMultiple && (
          <div className={`empty-table-card-icon-multiple-${size} absolute`}>
            <FontAwesomeIcon rotation={iconRotation} icon={icon} size={iconSize} className='icon' />
          </div>
        )}
        <div className={`empty-table-card-icon-${size} absolute`}>
          <FontAwesomeIcon rotation={iconRotation} icon={icon} size={iconSize} className='icon' />
        </div>
      </div>
      <Header as={size === 'medium' ? 'h4' : 'h5'}>{title}
        {subtitle && <Header.Subheader>{subtitle}</Header.Subheader>}
      </Header>
    </div>
  )
}

EmptyStateCard.propTypes = {
  isOver: PropTypes.bool,
  canDrop: PropTypes.bool,
  icon: PropTypes.string.isRequired
}

export default EmptyStateCard