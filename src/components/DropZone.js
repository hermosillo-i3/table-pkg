import React from 'react';
import { Header } from "semantic-ui-react";
import { ItemTypes } from './Constants';
import { useDrop } from 'react-dnd';

const DropZone = (props) => {
  // Reemplaza DropTarget con useDrop
  const [{canDrop}, dropRef] = useDrop({
    accept: ItemTypes.ROW,
    drop: (item) => {
      if (props.onDrop) {
        props.onDrop(item, props.row, props.isCtrlPressed);
      }
    },
    canDrop: (monitor) => {
      if (props.canDrop) {
        return props.canDrop(props, monitor);
      }
      return false;
    },
    collect: (monitor) => ({
      canDrop: (props.canDrop && monitor.getItem()) ? props.canDrop(props, monitor.getItem()) : false,
    }),
  });

  //  Styles

  const thStyle = {
    backgroundColor: '#3C85FB',
    textAlign: 'center',
    fontWeight: 'bold',
    position: 'sticky',
    top: 0,
  };

  const tdStyle = {
    width: '100%',
  };

  const pStyle = {
    color: 'white',
    textAlign: 'center',
    margin: '5px',
  };

  //  No renderizar si no hay ningún elemento siendo arrastrado.
  if (!canDrop) {
    return null;
  }

  return (
    <th style={thStyle} ref={dropRef} className='Table-Row'>
      <td style={tdStyle}>
        <Header as='h4' style={pStyle}>
          Arrastra y suelta aquí los elementos
        </Header>
      </td>
    </th>
  );
};

export default DropZone;