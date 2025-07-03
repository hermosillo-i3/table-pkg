import React from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from './Constants';
import EmptyStateCard from "./EmptyStateCard/EmptyStateCard";

const NoRowsCard = (props) => {
  const { noRowsMessage, isCtrlPressed } = props;

  const title = noRowsMessage ? noRowsMessage.title : 'Empty table';
  const subtitle = noRowsMessage ? noRowsMessage.subtitle : '';
  const icon = noRowsMessage ? noRowsMessage.icon : 'tools';
  const isMultiple = noRowsMessage ? noRowsMessage.isMultiple : false;
  const hasButtonProps = noRowsMessage ? noRowsMessage.buttonProps : false;

  // Reemplaza DropTarget con useDrop
  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: ItemTypes.ROW,
    drop: (item) => {
      if (props.onDrop) {
        props.onDrop(item, props.row, isCtrlPressed);
      }
    },
    canDrop: (monitor) => {
      if (props.canDrop) {
        return props.canDrop(props, monitor);
      }
      return false;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: (props.canDrop && monitor.getItem()) ? props.canDrop(props, monitor.getItem()) : false,
    }),
  });

  return (
    <tr style={{ display: 'flex' }}>
      <td style={{ margin: 'auto', padding: '1.5rem 0' }}>
        <div ref={dropRef}>
          <EmptyStateCard
            icon={icon}
            isOver={isOver}
            isMultiple={isMultiple}
            canDrop={canDrop}
            title={title}
            subtitle={subtitle}
            buttonProps={hasButtonProps ?? noRowsMessage.buttonProps}
          />
        </div>
      </td>
    </tr>
  );
}

export default NoRowsCard;