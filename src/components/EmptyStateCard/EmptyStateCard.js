import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {Button, Header} from "semantic-ui-react";
import './EmptyStateCard.scss';

const EmptyStateCard = (props) => {
  const {isOver, canDrop, title, subtitle, icon, iconRotation, isMultiple = false, size="medium", buttonProps} = props

  let iconSize;

  switch (size) {
    case 'small': iconSize="2x"; break;
    case 'medium': iconSize="4x"; break;
    case 'big': iconSize="6x"; break;
    default:
      break;
  }

  
  const isIconNotNull = icon !== null && icon !== undefined && icon !== '';

return (
  <div className={`empty-table-card-container-${size} ${isOver && canDrop ? 'is_over_zone' : ''}`}>
    <div className="empty-table-card">
      <div className={`empty-table-card-icon-${size}`}>
        {isIconNotNull && <FontAwesomeIcon rotation={iconRotation} icon={icon} size={iconSize} className='icon' />}
      </div>
      {isMultiple && (
        <div className={`empty-table-card-icon-multiple-${size} absolute`}>
          {isIconNotNull &&<FontAwesomeIcon rotation={iconRotation} icon={icon} size={iconSize} className='icon' />}
        </div>
      )}
      <div className={`empty-table-card-icon-${size} absolute`}>
        {isIconNotNull &&<FontAwesomeIcon rotation={iconRotation} icon={icon} size={iconSize} className='icon' />}
      </div>
    </div>
    <Header as={size === 'medium' ? 'h4' : 'h5'}>{title}
      {subtitle && <Header.Subheader>{subtitle}</Header.Subheader>}
    </Header>
    {buttonProps && <Button {...buttonProps} />}
  </div>
)
}

EmptyStateCard.propTypes = {
  isOver: PropTypes.bool,
  canDrop: PropTypes.bool,
  icon: PropTypes.string.isRequired,
  buttonProps: PropTypes.object,
}

export default EmptyStateCard